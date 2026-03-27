"use client";

import React, { useState } from "react";
import { RefreshCcw, CheckCircle, XCircle, Clock, Search, FileText, Download, ChevronDown } from "lucide-react";
import Swal from "sweetalert2";

// Mock Data
const mockRefunds = [
  {
    id: "REF-5001",
    orderId: "ORD-9912",
    customerName: "สมชาย ใจดี",
    amount: 350,
    reason: "อาหารมีสิ่งแปลกปลอม",
    status: "Pending",
    date: "2026-03-27 10:30",
    restaurantName: "Healthy Bowl สลัดบาร์",
  },
  {
    id: "REF-5002",
    orderId: "ORD-9884",
    customerName: "สมหญิง รักเรียน",
    amount: 120,
    reason: "ออเดอร์ตกหล่น ไม่ได้รับสินค้า",
    status: "Approved",
    date: "2026-03-26 14:15",
    restaurantName: "Lean & Clean",
  },
  {
    id: "REF-5003",
    orderId: "ORD-9870",
    customerName: "วิชัย แดนดิน",
    amount: 450,
    reason: "รออาหารนานเกิน 2 ชั่วโมง",
    status: "Pending",
    date: "2026-03-27 11:45",
    restaurantName: "Keto Kitchen",
  },
  {
    id: "REF-5004",
    orderId: "ORD-9801",
    customerName: "มาลี สีสวย",
    amount: 250,
    reason: "รสชาติเปรี้ยวบูด",
    status: "Rejected",
    date: "2026-03-25 09:20",
    restaurantName: "Vegan Hub",
  },
];

export default function RefundManagementPage() {
  const [refunds, setRefunds] = useState(mockRefunds);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAction = (id: string, action: "Approved" | "Rejected", amount: number, customer: string) => {
    const isApprove = action === "Approved";
    
    Swal.fire({
      title: isApprove ? "ยืนยันการคืนเงิน" : "ปฏิเสธการคืนเงิน",
      text: isApprove 
        ? `คุณต้องการอนุมัติการคืนเงินยอด ฿${amount.toLocaleString()} ให้กับคุณ ${customer} ใช่หรือไม่?`
        : `คุณต้องการปฏิเสธคำขอคืนเงินของคุณ ${customer} ใช่หรือไม่?`,
      icon: isApprove ? "question" : "warning",
      showCancelButton: true,
      confirmButtonColor: isApprove ? "#B59039" : "#EF4444",
      cancelButtonColor: "#9CA3AF",
      confirmButtonText: isApprove ? "ยืนยันอนุมัติ" : "ยืนยันปฏิเสธ",
      cancelButtonText: "ยกเลิก",
      shape: "rounded-3xl"
    }).then((result) => {
      if (result.isConfirmed) {
        setRefunds((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: action } : r))
        );
        Swal.fire({
          title: "สำเร็จ!",
          text: isApprove ? "อนุมัติการคืนเงินสำเร็จ" : "ปฏิเสธการคืนเงินสำเร็จ",
          icon: "success",
          confirmButtonColor: "#B59039",
        });
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F0FDF4] text-[#15803D]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]"></span> อนุมัติแล้ว
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF2F2] text-[#B91C1C]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B91C1C]"></span> ปฏิเสธ
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#B45309]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B45309]"></span> รอตรวจสอบ
          </span>
        );
    }
  };

  const filteredRefunds = refunds.filter((r) =>
    r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto w-full p-8 ml-64 bg-[#F7F5EE] min-h-screen">
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#B59039] shadow-sm">
              <RefreshCcw className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#B59039] uppercase tracking-wider mb-0.5">Wellmate ผู้ดูแลระบบ</p>
              <h1 className="text-2xl font-black text-[#2A2A2A]">จัดการคำขอการคืนเงิน</h1>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-bold shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-colors">
              นโยบายการคืนเงิน
            </button>
            <button className="px-6 py-2.5 bg-[#966E00] text-white rounded-full text-sm font-bold shadow-md hover:bg-[#7D5C00] flex items-center gap-2 transition-colors">
              <Download className="w-4 h-4" />
              ส่งออกข้อมูล
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm flex items-center justify-between">
            <div className="w-14 h-14 bg-[#F3F4F6] rounded-2xl flex items-center justify-center text-gray-600">
              <FileText className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-400 mb-1">คำขอทั้งหมด</p>
              <h3 className="text-3xl font-black text-[#2A2A2A]">{refunds.length}</h3>
              <p className="text-[10px] text-gray-400 mt-1">รายการสะสม</p>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 shadow-sm flex items-center justify-between">
            <div className="w-14 h-14 bg-[#FEF3C7] rounded-2xl flex items-center justify-center text-[#B45309]">
              <Clock className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-400 mb-1">รอตรวจสอบ</p>
              <h3 className="text-3xl font-black text-[#2A2A2A]">
                {refunds.filter(r => r.status === "Pending").length}
              </h3>
              <p className="text-[10px] text-[#B45309] mt-1 font-semibold">ต้องจัดการทันที</p>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 shadow-sm flex items-center justify-between">
            <div className="w-14 h-14 bg-[#F0FDF4] rounded-2xl flex items-center justify-center text-[#15803D]">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-400 mb-1">อนุมัติแล้ว</p>
              <h3 className="text-3xl font-black text-[#2A2A2A]">
                {refunds.filter(r => r.status === "Approved").length}
              </h3>
              <p className="text-[10px] text-[#15803D] mt-1 font-semibold">รายการสำเร็จ</p>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 shadow-sm flex items-center justify-between">
            <div className="w-14 h-14 bg-[#FEF2F2] rounded-2xl flex items-center justify-center text-[#B91C1C]">
              <XCircle className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-400 mb-1">ปฏิเสธแล้ว</p>
              <h3 className="text-3xl font-black text-[#2A2A2A]">
                {refunds.filter(r => r.status === "Rejected").length}
              </h3>
              <p className="text-[10px] text-[#B91C1C] mt-1 font-semibold">รายการที่ยกเลิก</p>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-full p-2 shadow-sm flex items-center gap-2">
          <div className="flex-1 relative flex items-center">
            <Search className="w-5 h-5 text-gray-400 absolute left-4" />
            <input
              type="text"
              placeholder="ค้นหารหัสคำขอ, ออเดอร์, ชื่อลูกค้า..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-transparent border-none text-sm outline-none"
            />
          </div>
          <div className="w-px h-8 bg-gray-100 mx-2"></div>
          <button className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
            สถานะทั้งหมด <ChevronDown className="w-4 h-4 ml-1" />
          </button>
          <button className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-full transition-colors mr-2">
            ช่วงเวลา <ChevronDown className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden p-2">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-50">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">ID บิล</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">ลูกค้า</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">ร้านค้า / ออเดอร์</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">เหตุผล (ย่อ)</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">ยอดรับคืน</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide text-center">สถานะ</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide text-center">พิมพ์บิล/ซ่อน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRefunds.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <span className="bg-[#F3F4F6] text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold font-mono">
                        {r.id}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-[#2A2A2A]">{r.customerName}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">วันที่: {r.date}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-[#B59039]">{r.restaurantName}</p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">{r.orderId}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 max-w-[180px]">
                        <p className="text-xs text-gray-600 truncate" title={r.reason}>{r.reason}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-base font-black text-[#2A2A2A]">฿{r.amount.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      {getStatusBadge(r.status)}
                    </td>
                    <td className="px-6 py-5">
                      {r.status === "Pending" ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleAction(r.id, "Approved", r.amount, r.customerName)}
                            className="bg-[#D1FAE5] text-[#065F46] hover:bg-[#A7F3D0] w-8 h-8 rounded-full flex items-center justify-center transition-all"
                            title="อนุมัติ"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAction(r.id, "Rejected", r.amount, r.customerName)}
                            className="bg-[#FEE2E2] text-[#991B1B] hover:bg-[#FECACA] w-8 h-8 rounded-full flex items-center justify-center transition-all"
                            title="ปฏิเสธ"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center text-gray-300">
                          -
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredRefunds.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-semibold text-[#2A2A2A]">ไม่พบข้อมูลคำขอ</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
