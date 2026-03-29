"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "sans-serif" }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "2rem", color: "#3d3522" }}>เกิดข้อผิดพลาด</h1>
            <p style={{ marginTop: "1rem", color: "#3d3522aa" }}>{error.message || "Something went wrong"}</p>
            <button
              onClick={() => reset()}
              style={{
                marginTop: "1.5rem",
                padding: "0.75rem 1.5rem",
                backgroundColor: "#3d3522",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              ลองอีกครั้ง
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
