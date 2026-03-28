import React from "react";
import { X, Flame, ShoppingBag, Info, ShieldAlert } from "lucide-react";
import { useCartStore, MenuItem as StoreMenuItem } from "@/store/cart-store";

type LocalMenuItem = StoreMenuItem & {
    restaurantName?: string;
};

interface FoodDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: LocalMenuItem | null;
}

const FALLBACK_FOOD_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80";

export default function FoodDetailModal({ isOpen, onClose, item }: FoodDetailModalProps) {
    const addItem = useCartStore(state => state.addItem);

    if (!isOpen || !item) return null;

    const handleAddToCart = () => {
        addItem(item, 1);
        onClose();
    };

    // Calculate calories with a default if not fully provided, 
    // or fallback to 0 if we really don't have it
    const calories = item.caloriesKcal || 0;
    const protein = item.proteinG || 0;
    const carbs = item.carbsG || 0;
    const fat = item.fatG || 0;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-[#FDF9F3] rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-slideUp z-10 border border-[#f0e6cc] max-h-[90vh]">
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/80 hover:bg-white backdrop-blur-md rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors shadow-sm"
                >
                    <X size={20} className="font-bold" />
                </button>

                {/* Left Side: Image */}
                <div className="w-full md:w-2/5 h-[250px] md:h-auto relative bg-gray-100 flex-shrink-0">
                    <img 
                        src={item.imageUrl || FALLBACK_FOOD_IMAGE} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_FOOD_IMAGE;
                        }}
                    />
                    {item.category && (
                        <span className="absolute top-4 left-4 rounded-full bg-[#C6E065] text-[#1a1a1a] text-[12px] font-black px-4 py-1.5 shadow-md uppercase tracking-wider">
                            {item.category}
                        </span>
                    )}
                </div>

                {/* Right Side: Details */}
                <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col overflow-y-auto custom-scrollbar">
                    
                    <div className="mb-4">
                        {item.restaurantName && (
                            <p className="text-[#8a7550] text-xs font-bold mb-1 uppercase tracking-wide flex items-center gap-1">
                                <StoreIcon size={12} /> {item.restaurantName}
                            </p>
                        )}
                        <h2 className="text-2xl font-black text-[#1a1a1a] leading-tight mb-2">
                            {item.name}
                        </h2>
                        <div className="flex items-baseline gap-3">
                            <p className="text-3xl font-black text-[#FF6A2C]">฿{item.price}</p>
                            <span className="text-sm font-bold text-gray-400 line-through">฿{Math.round(item.price * 1.2)}</span>
                            <span className="text-xs font-black text-red-500 bg-red-100 px-2 py-0.5 rounded-md">-20%</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-[#f0e6cc] mb-6 shadow-sm">
                        <h3 className="text-sm font-black text-[#1a1a1a] mb-2 flex items-center gap-2">
                            <Info size={16} className="text-[#C6E065]" />
                            ข้อมูลทางโภชนาการ
                        </h3>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                            <div className="bg-[#fff5f0] p-3 rounded-xl flex flex-col items-center justify-center text-center">
                                <Flame size={18} className="text-[#FF6A2C] mb-1" />
                                <span className="text-[10px] font-bold text-gray-500">แคลอรี่</span>
                                <span className="text-sm font-black text-[#FF6A2C]">{calories} <span className="text-[10px]">kcal</span></span>
                            </div>
                            <div className="bg-[#f0f9ff] p-3 rounded-xl flex flex-col items-center justify-center text-center">
                                <div className="w-4 h-4 rounded-full bg-blue-400 mb-1.5 opacity-80"></div>
                                <span className="text-[10px] font-bold text-gray-500">โปรตีน</span>
                                <span className="text-sm font-black text-blue-600">{protein} <span className="text-[10px]">g</span></span>
                            </div>
                            <div className="bg-[#f0fdf4] p-3 rounded-xl flex flex-col items-center justify-center text-center">
                                <div className="w-4 h-4 rounded-full bg-green-400 mb-1.5 opacity-80"></div>
                                <span className="text-[10px] font-bold text-gray-500">คาร์โบไฮเดรต</span>
                                <span className="text-sm font-black text-green-600">{carbs} <span className="text-[10px]">g</span></span>
                            </div>
                            <div className="bg-[#fcf8f0] p-3 rounded-xl flex flex-col items-center justify-center text-center">
                                <div className="w-4 h-4 rounded-full bg-yellow-400 mb-1.5 opacity-80"></div>
                                <span className="text-[10px] font-bold text-gray-500">ไขมัน</span>
                                <span className="text-sm font-black text-yellow-600">{fat} <span className="text-[10px]">g</span></span>
                            </div>
                        </div>

                        {/* Optional allergen or text */}
                        <div className="flex items-start gap-2 text-[11px] text-gray-500 font-medium bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                            <ShieldAlert size={14} className="text-orange-400 shrink-0 mt-0.5" />
                            <p>ข้อมูลโภชนาการนี้เป็นการประมาณการเพื่อเป็นแนวทางอ้างอิงเท่านั้น ปริมาณที่แท้จริงอาจแตกต่างไปตามวัตถุดิบแต่ละวัน</p>
                        </div>
                    </div>

                    <div className="mb-6 flex-1">
                        <h3 className="text-sm font-black text-[#1a1a1a] mb-2">รายละเอียดอาหาร</h3>
                        <p className="text-sm text-gray-600 leading-relaxed font-medium">
                            {item.description || "เมนูเพื่อสุขภาพ คัดสรรวัตถุดิบคุณภาพสูง ปรุงรสอย่างพิถีพิถันเพื่อรสชาติที่ดีที่สุดและรักษาสารอาหารไว้อย่างครบถ้วน ให้คุณได้อิ่มอร่อยและสุขภาพดีไปพร้อมกัน"}
                        </p>
                    </div>

                    {/* Action */}
                    <button 
                        onClick={handleAddToCart}
                        className="w-full mt-auto rounded-2xl bg-[#C6E065] text-[#3d3522] py-4 text-[15px] font-black hover:bg-[#b5d154] transition-all flex items-center justify-center gap-2 group/btn shadow-[0_8px_20px_-6px_rgba(198,224,101,0.6)]"
                    >
                        <ShoppingBag size={20} className="group-hover/btn:scale-110 transition-transform" />
                        เพิ่มลงตะกร้า • ฿{item.price}
                    </button>
                    
                </div>
            </div>
            
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                .animate-slideUp {
                    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
}

// Just a small helper icon for the store
function StoreIcon({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
    );
}
