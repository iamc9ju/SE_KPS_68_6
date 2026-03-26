import React from 'react';

// ─── Theme ────────────────────────────────────────────────────────────────────
const theme = {
    bg: '#f4f0e6',
    cardBg: '#ffffff',
    border: '#e5dfd0',
    gold: '#997000',
    goldLight: '#fef3c7',
    goldMid: '#d4a017',
    text: '#1c1917',
    textMuted: '#78716c',
    textLight: '#a8a29e',
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface Order {
  id: string;
  user: string;
  package: string;
  date: string;
  price: number;
  status: string;
}

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (orderId: string) => void;
  onReject?: (orderId: string) => void;
  onViewPackage?: (packageName: string) => void;
  order: Order | null;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ isOpen, onClose, onConfirm, onReject, onViewPackage, order }) => {
  const [isSlipFullView, setIsSlipFullView] = React.useState(false);
  
  // Close drawer on ESC
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!order) return null;

  const isPending = order.status === 'Pending' || order.status === 'รอตรวจสอบ';

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[100] bg-black/20 backdrop-blur-[2px] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Side Drawer Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-[480px] bg-white z-[110] shadow-[-20px_0_50px_-10px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ backgroundColor: theme.cardBg }}
      >
        {/* Drawer Header */}
        <div className="px-8 py-6 border-b flex justify-between items-center bg-white sticky top-0 z-10" style={{ borderColor: theme.border }}>
          <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: theme.gold }} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: theme.gold }}>ข้อมูลออเดอร์อัจฉริยะ</p>
            <h2 className="text-2xl font-extrabold tracking-tighter" style={{ color: theme.text }}>รายละเอียดออเดอร์</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl hover:bg-gray-100 transition-all active:scale-90"
            style={{ color: theme.textMuted }}
          >
            ✕
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-10 space-y-10 custom-scrollbar">
          
          {/* Section: Status & ID */}
          <div className="flex items-center justify-between p-6 rounded-[32px] border bg-gray-50/30" style={{ borderColor: theme.border }}>
            <div className="space-y-1">
                <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: theme.textLight }}>รหัสอ้างอิง</p>
                <p className="font-extrabold text-lg" style={{ color: theme.text }}>{order.id}</p>
            </div>
            <div className="text-right space-y-2">
                <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: theme.textLight }}>สถานะปัจจุบัน</p>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold border uppercase tracking-wider" 
                    style={{ 
                        backgroundColor: isPending ? '#fffbeb' : '#f0fdf4', 
                        color: isPending ? '#92400e' : '#166534',
                        borderColor: isPending ? '#fde68a' : '#bbf7d0'
                    }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: isPending ? '#f59e0b' : '#22c55e' }} />
                  {isPending ? 'รอตรวจสอบ' : 'เสร็จสิ้น'}
                </div>
            </div>
          </div>

          {/* Section: Customer Info */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: theme.textLight }}>ข้อมูลลูกค้า</h3>
                <span className="w-8 h-px bg-gray-100" />
             </div>
             <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner bg-gray-100">👤</div>
                <div>
                   <p className="text-xl font-extrabold" style={{ color: theme.text }}>{order.user}</p>
                   <p className="text-xs font-bold" style={{ color: theme.textLight }}>สมาชิก Wellmate พรีเมียม</p>
                </div>
             </div>
          </div>

          {/* Section: Subscription Details */}
          <div className="space-y-4">
             <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: theme.textLight }}>แผนการสมัครสมาชิก</h3>
             <div className="grid grid-cols-2 gap-4">
                <div 
                    onClick={() => onViewPackage && onViewPackage(order.package)}
                    className="p-5 rounded-[24px] border group cursor-pointer hover:border-gold transition-all bg-white"
                    style={{ borderColor: theme.border }}
                >
                    <p className="text-[9px] font-bold uppercase tracking-widest mb-1 text-gray-400 group-hover:text-gold transition-colors">แพ็กเกจ</p>
                    <p className="text-sm font-bold truncate" style={{ color: theme.text }}>📦 {order.package}</p>
                </div>
                <div className="p-5 rounded-[24px] border bg-white" style={{ borderColor: theme.border }}>
                    <p className="text-[9px] font-bold uppercase tracking-widest mb-1 text-gray-400">ทำรายการเมื่อ</p>
                    <p className="text-sm font-bold" style={{ color: theme.text }}>📅 {order.date}</p>
                </div>
             </div>
          </div>

          {/* Section: Financial Summary */}
          <div className="p-8 rounded-[40px] border-2 border-dashed flex flex-col items-center justify-center text-center relative overflow-hidden group" style={{ borderColor: theme.border, backgroundColor: '#faf9f6' }}>
             <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
             <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: theme.textLight }}>ยอดชำระ</p>
             <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold" style={{ color: theme.text }}>฿{order.price.toLocaleString()}</span>
                <span className="text-xs font-bold text-gray-400">.00</span>
             </div>
             <div className="mt-4 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
             <p className="mt-3 text-[10px] font-bold text-gray-400">ราคานี้รวมภาษีมูลค่าเพิ่มแล้ว</p>
          </div>

          {/* Section: Payment Evidence */}
          <div className="space-y-4 pb-10">
             <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: theme.textLight }}>การตรวจสอบการชำระเงิน</h3>
             <div 
                onClick={() => setIsSlipFullView(true)}
                className="w-full aspect-[3/4] rounded-[40px] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer group hover:bg-gray-50 transition-all relative overflow-hidden"
                style={{ borderColor: theme.border }}
             >
                {/* Simulated Slip */}
                <div className="w-1/2 h-2/3 bg-white rounded-2xl shadow-xl p-4 flex flex-col border border-gray-100 group-hover:scale-105 transition-transform rotate-1">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4 self-center">✓</div>
                    <div className="space-y-2">
                        <div className="h-1.5 w-full bg-gray-100 rounded-full" />
                        <div className="h-1.5 w-3/4 bg-gray-100 rounded-full" />
                        <div className="h-4 w-full bg-gray-50 rounded-lg mt-4" />
                        <div className="h-2 w-1/2 bg-gray-100 rounded-full mt-auto" />
                    </div>
                </div>
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/90 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">ดูขนาดเต็ม</span>
                </div>
                <p className="mt-6 text-[10px] font-bold uppercase tracking-widest" style={{ color: theme.gold }}>คลิกเพื่อดูรูปขนาดเต็ม</p>
             </div>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="px-8 py-8 border-t bg-gray-50/50 flex flex-col gap-3" style={{ borderColor: theme.border }}>
          {isPending ? (
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => onReject && onReject(order.id)}
                className="py-4 rounded-[20px] text-xs font-bold uppercase tracking-widest transition-all bg-white border hover:bg-red-50 hover:text-red-500 hover:border-red-200 active:scale-95"
                style={{ borderColor: theme.border, color: theme.textMuted }}
              >
                ยกเลิกออเดอร์
              </button>
              <button 
                onClick={() => onConfirm && onConfirm(order.id)}
                className="py-4 rounded-[20px] text-xs font-bold uppercase tracking-widest transition-all shadow-xl shadow-gold/20 active:scale-95"
                style={{ backgroundColor: theme.gold, color: '#fff' }}
              >
                ยืนยันการชำระเงิน
              </button>
            </div>
          ) : (
            <button 
                disabled
                className="py-4 rounded-[20px] text-xs font-bold uppercase tracking-widest bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
            >
                ออเดอร์ได้รับการประมวลผลแล้ว
            </button>
          )}
          <button 
            onClick={onClose}
            className="py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-center hover:underline opacity-50"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>

      {/* Slip Full View Overlay */}
      {isSlipFullView && (
        <div 
          className="fixed inset-0 bg-black/95 z-[200] flex flex-col items-center justify-center p-8 animate-fade-in"
          onClick={() => setIsSlipFullView(false)}
        >
          <button className="absolute top-8 right-8 text-white/50 text-5xl hover:text-white transition-colors">&times;</button>
          <div className="w-full max-w-sm aspect-[3/4] bg-white rounded-[48px] overflow-hidden shadow-2xl relative p-12 flex flex-col gap-8 transition-transform hover:scale-[1.02]">
             {/* Header */}
             <div className="flex justify-between items-start">
                <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white text-3xl shadow-lg shadow-green-200">✓</div>
                <div className="text-right">
                    <p className="text-2xl font-extrabold text-gray-900 leading-none">สำเร็จ</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">ยืนยันการชำระเงิน</p>
                </div>
             </div>

             <div className="w-full h-px border-t-2 border-dashed border-gray-100" />

             {/* Details */}
             <div className="space-y-6 flex-1">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ลูกค้า</p>
                    <p className="text-lg font-extrabold text-gray-900">{order.user}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">จำนวนเงิน</p>
                        <p className="text-base font-extrabold text-gray-900">฿{order.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">วันที่</p>
                        <p className="text-base font-extrabold text-gray-900">{order.date}</p>
                    </div>
                </div>
                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">รหัสอ้างอิง: {order.id}</span>
                </div>
             </div>

             {/* Footer deco */}
             <div className="mt-auto flex flex-col items-center gap-4">
                <div className="w-24 h-24 border-8 border-gray-50 rounded-3xl flex items-center justify-center text-gray-100 font-black">QR</div>
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-200">ตรวจสอบโดย Wellmate Pay</p>
             </div>
          </div>
          <p className="mt-8 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">คลิกที่ใดก็ได้เพื่อปิด</p>
        </div>
      )}
    </>
  );
};

export default OrderDetailModal;
