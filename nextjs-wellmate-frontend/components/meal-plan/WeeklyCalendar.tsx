"use client";

import React from "react";
import { Plus, CheckCircle2, Circle, Utensils, Coffee, Sun, Moon, Candy } from "lucide-react";

export type MealEntry = {
    mealPlanItemId: number;
    planDate: string;
    mealType: string;
    isDone: boolean;
    menuItem?: {
        name: string;
        imageUrl?: string;
        caloriesKcal?: number;
    };
};

type WeeklyCalendarProps = {
    selectedDate: Date;
    meals: MealEntry[];
    onToggleDone: (itemId: number, isDone: boolean) => void;
    onAddMeal?: (date: Date, mealType: string) => void;
    isEditable?: boolean;
};

const MEAL_TYPES = [
    { key: "breakfast", label: "มื้อเช้า", icon: Coffee, color: "text-orange-400", bg: "bg-orange-50" },
    { key: "lunch", label: "มื้อเที่ยง", icon: Sun, color: "text-yellow-500", bg: "bg-yellow-50" },
    { key: "dinner", label: "มื้อเย็น", icon: Moon, color: "text-indigo-400", bg: "bg-indigo-50" },
    { key: "snack", label: "ของว่าง", icon: Candy, color: "text-pink-400", bg: "bg-pink-50" },
];

export default function WeeklyCalendar({
    selectedDate,
    meals,
    onToggleDone,
    onAddMeal,
    isEditable = false,
}: WeeklyCalendarProps) {
    // Generate 7 days starting from Monday of the selected week
    const getWeekDays = (date: Date) => {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
        start.setDate(diff);

        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            return d;
        });
    };

    const weekDays = getWeekDays(selectedDate);

    const getMealForDay = (date: Date, type: string) => {
        return meals.find(m => {
            const mealDate = new Date(m.planDate);
            return mealDate.toDateString() === date.toDateString() && m.mealType === type;
        });
    };

    return (
        <div className="overflow-x-auto pb-4">
            <div className="min-w-[1000px]">
                <div className="grid grid-cols-8 border-b border-gray-300 pb-4 mb-6">
                    <div className="col-span-1"></div>
                    {weekDays.map((day, i) => (
                        <div key={i} className="text-center">
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                                {day.toLocaleDateString("th-TH", { weekday: "short" })}
                            </p>
                            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-[15px] font-black transition-all ${day.toDateString() === new Date().toDateString() ? "bg-[#3d3522] text-white shadow-lg" : "text-[#3d3522]"}`}>
                                {day.getDate()}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    {MEAL_TYPES.map((type) => (
                        <div key={type.key} className="grid grid-cols-8 items-center gap-4">
                            <div className="col-span-1 flex items-center gap-3 pr-4">
                                <div className={`w-10 h-10 rounded-2xl ${type.bg} flex items-center justify-center`}>
                                    <type.icon size={20} className={type.color} />
                                </div>
                                <span className="text-[13px] font-black text-[#3d3522] whitespace-nowrap">{type.label}</span>
                            </div>

                            {weekDays.map((day, i) => {
                                const meal = getMealForDay(day, type.key);
                                return (
                                    <div key={i} className="relative group min-h-[120px]">
                                        {meal ? (
                                            <div className={`h-full p-3 rounded-3xl border-2 transition-all duration-300 ${meal.isDone ? "bg-[#fafcf2] border-[#C6E065]" : "bg-white border-gray-300 group-hover:border-[#3d3522]/20"}`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                                        {meal.menuItem?.caloriesKcal || 0} kcal
                                                    </span>
                                                    <button 
                                                        onClick={() => onToggleDone(meal.mealPlanItemId, !meal.isDone)}
                                                        className="transition-all"
                                                    >
                                                        {meal.isDone 
                                                            ? <CheckCircle2 size={22} className="text-[#C6E065]" /> 
                                                            : <Circle size={22} className="text-gray-300 hover:text-gray-400" />
                                                        }
                                                    </button>
                                                </div>
                                                <p className={`text-[12px] font-black leading-tight line-clamp-2 ${meal.isDone ? "text-[#3d3522]/50 line-through" : "text-[#3d3522]"}`}>
                                                    {meal.menuItem?.name || "รายการอาหาร"}
                                                </p>
                                                {meal.menuItem?.imageUrl && (
                                                    <div className="mt-2 h-10 w-full rounded-xl overflow-hidden opacity-80">
                                                        <img src={meal.menuItem.imageUrl} className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            isEditable ? (
                                                <button 
                                                    onClick={() => onAddMeal && onAddMeal(day, type.key)}
                                                    className="w-full h-full border-2 border-dashed border-gray-300 rounded-3xl flex items-center justify-center text-gray-400 hover:border-[#3d3522]/20 hover:text-[#3d3522] transition-all group/add"
                                                >
                                                    <Plus size={24} className="group-hover/add:scale-125 transition-transform" />
                                                </button>
                                            ) : (
                                                <div className="w-full h-full bg-gray-50/50 border-2 border-dashed border-gray-300 rounded-3xl"></div>
                                            )
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
