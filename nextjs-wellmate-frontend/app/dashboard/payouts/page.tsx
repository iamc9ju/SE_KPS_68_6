"use client";

import React, { useState } from "react";
import { Wallet, CheckCircle, Clock, AlertCircle, ChevronRight, Search, Download, FileText, ChevronDown } from "lucide-react";
import Swal from "sweetalert2";

// Mock Data
const mockPayouts = [
  {
    id: "PO-1001",
    restaurantName: "Healthy Bowl สลัดบาร์",
    totalSales: 25000,
    platformFee: 2500, // 10%
    netPayout: 22500,
    status: "Pending",
    date: "2026-03-27",
    bankAccount: "KTB - 123-4-56789-0",
  },
  {
    id: "PO-1002",
    restaurantName: "Lean & Clean",
    totalSales: 18500,
    platformFee: 1850,
    netPayout: 16650,
    status: "Processing",
    date: "2026-03-26",
    bankAccount: "SCB - 098-7-65432-1",
  },
  {
    id: "PO-1003",
    restaurantName: "Keto Kitchen",
    totalSales: 42000,
    platformFee: 4200,
    netPayout: 37800,
    status: "Paid",
    date: "2026-03-20",
    bankAccount: "KBANK - 111-2-33344-5",
  },
  {
    id: "PO-1004",
    restaurantName: "Vegan Hub",
    totalSales: 9500,
    platformFee: 950,
    netPayout: 8550,
    status: "Pending",
    date: "2026-03-27",
    bankAccount: "BBL - 999-8-77766-5",
  },
];

export default function PayoutManagementPage() {
  const [payouts, setPayouts] = useState(mockPayouts);
  const [searchQuery, setSearchQuery] = useState("");

  const handleProcessPayout = (id: string, amount: number, restaurant: string) => {
    Swal.fire({
      title: "ยืนยันการจ่ายเงิน",
      text: `คุณต้องการจ่ายเงินยอด ฿${amount.toLocaleString()} ให้กับ ${restaurant} ใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B59039",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยันการทำรายการ",
      cancelButtonText: "ยกเลิก",
      shape: "rounded-3xl"
    }).then((result) => {
      if (result.isConfirmed) {
        setPayouts((prev) =>
          prev.map((po) => (po.id === id ? { ...po, status: "Paid" } : po))
        );
        Swal.fire({
          title: "สำเร็จ!",
          text: "รายการจ่ายเงินถูกบันทึกและกำลังดำเนินการ",
          icon: "success",
          confirmButtonColor: "#B59039",
        });
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F0FDF4] text-[#15803D]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]"></span> สำเร็จ
          </span>
        );
      case "Processing":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#1D4ED8]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8]"></span> กำลังดำเนินการ
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#B45309]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B45309]"></span> รอทำจ่าย
          </span>
        );
    }
  };

  const filteredPayouts = payouts.filter((p) =>
    p.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto w-full p-8 ml-64 bg-[#F7F5EE] min-h-screen">
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#B59039] shadow-sm">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#B59039] uppercase tracking-wider mb-0.5">Wellmate ผู้ดูแลระบบ</p>
              <h1 className="text-2xl font-black text-[#2A2A2A]">จัดการการจ่ายเงินร้านค้า</h1>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-bold shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-colors">
              ประวัติการทำจ่าย
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
              <p className="text-xs font-semibold text-gray-400 mb-1">ยอดขายรวมทั้งหมด</p>
              <h3 className="text-3xl font-black text-[#2A2A2A]">12</h3>
              <p className="text-[10px] text-gray-400 mt-1">รายการบิล</p>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 shadow-sm flex items-center justify-between">
            <div className="w-14 h-14 bg-[#FEF3C7] rounded-2xl flex items-center justify-center text-[#B45309]">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-400 mb-1">ยอดรอทำจ่าย</p>
              <h3 className="text-3xl font-black text-[#2A2A2A]">฿31,050</h3>
              <p className="text-[10px] text-[#B45309] mt-1 font-semibold">2 รายการ</p>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 shadow-sm flex items-center justify-between">
            <div className="w-14 h-14 bg-[#EFF6FF] rounded-2xl flex items-center justify-center text-[#1D4ED8]">
              <Clock className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-400 mb-1">กำลังดำเนินการ</p>
              <h3 className="text-3xl font-black text-[#2A2A2A]">฿16,650</h3>
              <p className="text-[10px] text-gray-400 mt-1">รอการอนุมัติ</p>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 shadow-sm flex items-center justify-between">
            <div className="w-14 h-14 bg-[#F0FDF4] rounded-2xl flex items-center justify-center text-[#15803D]">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-400 mb-1">จ่ายแล้วเดือนนี้</p>
              <h3 className="text-3xl font-black text-[#2A2A2A]">27%</h3>
              <p className="text-[10px] text-gray-400 mt-1">อัตราความสำเร็จ</p>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-full p-2 shadow-sm flex items-center gap-2">
          <div className="flex-1 relative flex items-center">
            <Search className="w-5 h-5 text-gray-400 absolute left-4" />
            <input
              type="text"
              placeholder="ค้นหาร้านค้า, รหัสเอกสาร..."
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
            ช่วงเวลาทั้งหมด <ChevronDown className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden p-2">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-50">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">ID เอกสาร</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">ร้านค้า</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">เลขบัญชึ</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">ค่าคอมมิชชั่น(10%)</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">ยอดที่ต้องจ่าย</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide text-center">สถานะ</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPayouts.map((po) => (
                  <tr key={po.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <span className="bg-[#F3F4F6] text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold font-mono">
                        {po.id}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-[#2A2A2A]">{po.restaurantName}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">วันที่: {po.date}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-gray-600 font-mono">{po.bankAccount}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-red-500">-฿{po.platformFee.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-base font-black text-[#2A2A2A]">฿{po.netPayout.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      {getStatusBadge(po.status)}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex justify-center gap-2">
                        {po.status === "Pending" ? (
                          <button
                            onClick={() => handleProcessPayout(po.id, po.netPayout, po.restaurantName)}
                            className="bg-[#FEF3C7] text-[#B45309] hover:bg-[#FDE68A] px-4 py-2 rounded-full text-xs font-bold transition-all"
                          >
                            ทำจ่าย
                          </button>
                        ) : (
                          <span className="px-4 py-2 text-xs font-bold text-gray-400">แล้ว</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPayouts.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-semibold text-[#2A2A2A]">ไม่พบข้อมูล</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
