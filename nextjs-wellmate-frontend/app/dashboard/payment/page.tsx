"use client";

import React, { Suspense, useMemo, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { appointmentsApi } from "@/services/appointments";
import Swal from "sweetalert2";
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    Download,
    ShieldCheck,
    Smartphone,
    Info,
    Loader2
} from "lucide-react";

function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const qrCodeUrl = searchParams.get("qrCodeUrl");
    const amount = searchParams.get("amount");
    const appointmentId = searchParams.get("appointmentId");

    const [isConfirmed, setIsConfirmed] = useState(false);

    // ─── Polling for Payment Status ───
    useEffect(() => {
        if (!appointmentId || isConfirmed) return;

        const pollInterval = setInterval(async () => {
            try {
                const appointment = await appointmentsApi.getById(appointmentId);

                if (appointment.status === "confirmed") {
                    clearInterval(pollInterval);
                    setIsConfirmed(true);

                    // Show Success Alert and Redirect
                    Swal.fire({
                        title: "ชำระเงินสำเร็จ!",
                        text: "การนัดหมายของคุณได้รับการยืนยันแล้ว",
                        icon: "success",
                        confirmButtonColor: "#C6E065",
                        confirmButtonText: "ตกลง",
                        allowOutsideClick: false,
                        timer: 3000,
                        timerProgressBar: true,
                    }).then(() => {
                        router.push("/dashboard/appointments");
                    });
                }
            } catch (error) {
                console.error("Polling error:", error);
            }
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(pollInterval);
    }, [appointmentId, isConfirmed, router]);

    const formattedAmount = useMemo(() => {
        return Number(amount || 0).toLocaleString();
    }, [amount]);

    if (!qrCodeUrl) {
        return (
            <main className="flex-1 overflow-y-auto px-8 py-8 z-10 custom-scrollbar ml-64 bg-[#fffbf5]">
                <div className="max-w-xl mx-auto text-center py-20">
                    <Info className="w-16 h-16 text-[#8a7550] mx-auto mb-4 opacity-20" />
                    <h1 className="text-2xl font-black text-[#3d3522] mb-2">ไม่พบข้อมูลการชำระเงิน</h1>
                    <p className="text-[#8a7550] mb-8">กรุณาลองใหม่อีกครั้งจากการจองคิว</p>
                    <button
                        onClick={() => router.push("/dashboard/nutrition")}
                        className="px-8 py-4 bg-[#C6E065] text-[#3d3522] font-bold rounded-2xl shadow-md hover:bg-[#b8d450] transition-all cursor-pointer"
                    >
                        กลับหน้าแรก
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 overflow-y-auto px-8 py-8 z-10 custom-scrollbar ml-64 bg-[#fffbf5]">
            <div className="max-w-[1400px] mx-auto">
                <button
                    onClick={() => router.push("/dashboard/appointments")}
                    className="flex items-center gap-2 text-[#8a7550] hover:text-[#3d3522] font-bold transition-colors mb-8 cursor-pointer"
                >
                    <ArrowLeft className="w-5 h-5" /> ย้อนกลับ
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left: QR Section */}
                    <div className="lg:col-span-3 h-full">
                        <div className="bg-white rounded-[40px] border border-[#f0e6cc] shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden h-full flex flex-col">
                            <div className="py-6 border-b border-[#f0e6cc] text-center">
                                <h2 className="text-2xl font-black text-[#3d3522]">Scan QR Code เพื่อชำระเงิน</h2>
                            </div>

                            <div className="p-10 text-center space-y-8">
                                {/* QR Code Container */}
                                <div className="relative inline-block p-6 bg-white border border-[#f0e6cc] rounded-[32px] shadow-sm">
                                    {isConfirmed ? (
                                        <div className="w-64 h-64 md:w-80 md:h-80 flex flex-col items-center justify-center bg-gray-50 rounded-2xl">
                                            <CheckCircle2 className="w-20 h-20 text-[#C6E065] mb-4 animate-bounce" />
                                            <p className="font-bold text-[#4A6707]">ชำระเงินสำเร็จแล้ว!</p>
                                        </div>
                                    ) : (
                                        <img
                                            src={qrCodeUrl}
                                            alt="PromptPay QR Code"
                                            className="w-64 h-64 md:w-80 md:h-80 object-contain mx-auto"
                                        />
                                    )}
                                </div>

                                {/* Orange Action Button */}
                                {!isConfirmed && (
                                    <div className="max-w-md mx-auto">
                                        <button
                                            onClick={() => window.open(qrCodeUrl, '_blank')}
                                            className="w-full bg-[#FF6A2C] text-white font-black py-4 px-8 rounded-2xl shadow-lg shadow-[#FF6A2C]/20 hover:bg-[#ff5a14] transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                                        >
                                            <Download className="w-5 h-5" />
                                            บันทึก QR Code
                                        </button>
                                    </div>
                                )}

                                {/* Status Polling Indicator */}
                                <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#8a7550] py-2">
                                    {isConfirmed ? (
                                        <span className="text-[#4A6707] flex items-center gap-1.5 font-black">
                                            <CheckCircle2 className="w-4 h-4" />
                                            ยืนยันการชำระเงินเรียบร้อย
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 opacity-60">
                                            <Loader2 className="w-4 h-4 animate-spin text-[#C6E065]" />
                                            กำลังรอการชำระเงิน... (โปรดอย่าปิดหน้านี้)
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary & Instructions */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Summary Card */}
                        <div className="bg-white rounded-[32px] p-8 border border-[#f0e6cc] shadow-sm space-y-6">
                            <h3 className="text-xl font-black text-[#3d3522]">สรุปรายการจำหน่าย</h3>

                            <div className="bg-[#FEF5E7] p-6 rounded-[24px] flex justify-between items-center">
                                <span className="text-lg font-bold text-[#3d3522]">ยอดชำระเงิน</span>
                                <span className="text-2xl font-black text-[#FF6A2C]">{formattedAmount} บาท</span>
                            </div>

                            <div className="pt-2 text-left space-y-2">
                                <p className="text-base font-black text-[#3d3522]">ปรึกษานักโภชนาการออนไลน์</p>
                                <p className="text-[13px] text-[#8a7550] leading-tight font-medium">
                                    ID: <span className="font-bold text-[#3d3522]">{appointmentId?.slice(0, 16).toUpperCase()}</span>
                                </p>
                            </div>
                        </div>

                        {/* Instructions Section */}
                        <div className="bg-[#faf8f2] p-8 rounded-[32px] border border-[#f0e6cc] flex-1">
                            <h3 className="text-sm font-black text-[#3d3522] mb-6 leading-relaxed">ขั้นตอนการชำระเงินโดยใช้ QR code ผ่าน mobile banking application</h3>
                            <ol className="space-y-4 text-[13px] text-[#3d3522]">
                                <li className="flex gap-4">
                                    <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center font-bold text-[#3d3522] border border-[#f0e6cc] flex-shrink-0 shadow-sm text-xs">1</span>
                                    <span>หากหน้านี้อยู่บนมือถือให้ทำการแคปภาพหน้าจอโดยให้เห็น QR code ทั้งหมดไว้ก่อน</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center font-bold text-[#3d3522] border border-[#f0e6cc] flex-shrink-0 shadow-sm text-xs">2</span>
                                    <span>เข้าสู่ระบบ mobile banking application</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center font-bold text-[#3d3522] border border-[#f0e6cc] flex-shrink-0 shadow-sm text-xs">3</span>
                                    <span>เลือกเมนู โอนเงิน หรือ upload QR หรือ scan QR</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center font-bold text-[#3d3522] border border-[#f0e6cc] flex-shrink-0 shadow-sm text-xs">4</span>
                                    <span>ใช้มือถือ upload QR หรือ scan QR ที่ปรากฏบนหน้านี้</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center font-bold text-[#3d3522] border border-[#f0e6cc] flex-shrink-0 shadow-sm text-xs">5</span>
                                    <span>ตรวจสอบชื่อบัญชีว่าถูกต้องตามที่ระบุ</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center font-bold text-[#3d3522] border border-[#f0e6cc] flex-shrink-0 shadow-sm text-xs">6</span>
                                    <span>เมื่อทำรายการเสร็จสิ้น หน้าจอจะแสดงผลสำเร็จ</span>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="p-10 ml-64">Loading payment information...</div>}>
            <PaymentContent />
        </Suspense>
    );
}
