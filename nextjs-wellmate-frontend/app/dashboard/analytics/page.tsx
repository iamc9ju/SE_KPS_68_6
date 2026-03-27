"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Users,
  Utensils,
  DollarSign,
  Calendar,
  Download,
  Filter,
  PieChart as PieChartIcon,
  ChevronDown
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

// Mock Data
const revenueData = [
  { name: "Jan", revenue: 45000, orders: 120 },
  { name: "Feb", revenue: 52000, orders: 140 },
  { name: "Mar", revenue: 48000, orders: 130 },
  { name: "Apr", revenue: 61000, orders: 170 },
  { name: "May", revenue: 59000, orders: 160 },
  { name: "Jun", revenue: 75000, orders: 200 },
];

const topRestaurantsData = [
  { name: "Healthy Bowl สลัดบาร์", sales: 150000 },
  { name: "Keto Kitchen", sales: 120000 },
  { name: "Lean & Clean", sales: 95000 },
  { name: "Vegan Hub", sales: 65000 },
];

const userRolesData = [
  { name: "Patients", value: 450 },
  { name: "Nutritionists", value: 30 },
  { name: "Food Partners", value: 85 },
];

const COLORS = ["#B59039", "#2A2A2A", "#E2E8F0", "#94A3B8"];
const PIE_COLORS = ["#B59039", "#2A2A2A", "#F59E0B"];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6m");

  return (
    <div className="flex-1 overflow-y-auto w-full p-8 ml-64 bg-[#F7F5EE] min-h-screen">
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#B59039] shadow-sm">
              <PieChartIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#B59039] uppercase tracking-wider mb-0.5">Wellmate ผู้ดูแลระบบ</p>
              <h1 className="text-2xl font-black text-[#2A2A2A]">รายงานสถิติเชิงธุรกิจ</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-white rounded-full p-1 shadow-sm">
              <button 
                onClick={() => setTimeRange("7d")}
                className={`px-5 py-2 text-xs font-bold rounded-full transition-colors ${timeRange === "7d" ? "bg-[#3d3522] text-white" : "text-gray-500 hover:bg-gray-50"}`}
              >
                7 วัน
              </button>
              <button 
                onClick={() => setTimeRange("1m")}
                className={`px-5 py-2 text-xs font-bold rounded-full transition-colors ${timeRange === "1m" ? "bg-[#3d3522] text-white" : "text-gray-500 hover:bg-gray-50"}`}
              >
                1 เดือน
              </button>
              <button 
                onClick={() => setTimeRange("6m")}
                className={`px-5 py-2 text-xs font-bold rounded-full transition-colors ${timeRange === "6m" ? "bg-[#3d3522] text-white" : "text-gray-500 hover:bg-gray-50"}`}
              >
                6 เดือน
              </button>
            </div>
            
            <button className="flex items-center gap-2 bg-[#966E00] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-[#7D5C00] transition-colors">
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">ส่งออกรายงาน</span>
            </button>
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FEF3C7] flex items-center justify-center text-[#B45309]">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-[#15803D] bg-[#F0FDF4] px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" /> +12.5%
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-400 mb-1">รายได้รวม (Platform Fee)</p>
            <h3 className="text-3xl font-black text-[#2A2A2A]">฿340,500</h3>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-14 h-14 rounded-2xl bg-[#eff5d9] flex items-center justify-center text-[#4A6707]">
                <Utensils className="w-6 h-6" />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-[#15803D] bg-[#F0FDF4] px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" /> +8.2%
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-400 mb-1">ยอดสั่งซื้อทั้งหมด</p>
            <h3 className="text-3xl font-black text-[#2A2A2A]">1,245</h3>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] flex items-center justify-center text-[#1D4ED8]">
                <Users className="w-6 h-6" />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-[#15803D] bg-[#F0FDF4] px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" /> +24%
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-400 mb-1">ผู้ใช้งานใหม่</p>
            <h3 className="text-3xl font-black text-[#2A2A2A]">565</h3>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F3E8FF] flex items-center justify-center text-[#7E22CE]">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-400 mb-1">การนัดหมายโภชนากร</p>
            <h3 className="text-3xl font-black text-[#2A2A2A]">128</h3>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart - Revenue Trend */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm lg:col-span-2 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-black text-[#2A2A2A]">แนวโน้มรายได้ (บาท)</h3>
                <p className="text-xs text-gray-400 mt-1">เปรียบเทียบจากยอดเติบโตย้อนหลัง 6 เดือน</p>
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: '#2A2A2A', fontWeight: 800 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#B59039" 
                    strokeWidth={4}
                    dot={{ fill: '#B59039', strokeWidth: 2, r: 6, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Distribution Pie Chart */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm flex flex-col">
            <h3 className="text-lg font-black text-[#2A2A2A] mb-1">สัดส่วนผู้ใช้งาน</h3>
            <p className="text-xs text-gray-400 mb-6">แบ่งตามประเภทบัญชี</p>
            
            <div className="h-64 w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userRolesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userRolesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-center gap-4 mt-4">
              {userRolesData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index] }} />
                  <span className="text-xs font-semibold text-gray-500">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Restaurants Bar Chart */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-black text-[#2A2A2A]">ร้านอาหารที่มียอดขายสูงสุด</h3>
                <p className="text-xs text-gray-400 mt-1">4 อันดับแรกที่มีรายได้สูงสุด (บาท)</p>
              </div>
            </div>
            <div className="h-72 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topRestaurantsData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis 
                    type="number" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#2A2A2A', fontSize: 13, fontWeight: 600 }}
                    width={150}
                  />
                  <Tooltip 
                    cursor={{ fill: '#F7F5EE' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar 
                    dataKey="sales" 
                    fill="#2A2A2A" 
                    radius={[0, 8, 8, 0]}
                    barSize={32}
                  >
                    {topRestaurantsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "#B59039" : "#2A2A2A"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
