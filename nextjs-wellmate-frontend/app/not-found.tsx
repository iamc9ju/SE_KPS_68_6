export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#3d3522]">404</h1>
        <p className="mt-4 text-xl text-[#3d3522]/70">ไม่พบหน้าที่คุณต้องการ</p>
        <a
          href="/"
          className="mt-6 inline-block px-6 py-3 bg-[#3d3522] text-white rounded-lg hover:bg-[#3d3522]/80 transition-colors"
        >
          กลับหน้าแรก
        </a>
      </div>
    </div>
  );
}
