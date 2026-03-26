"use client";

type Food = {
    id: number;
    name: string;
    desc: string;
    price: number;
    image: string;
};

type MenuCardProps = {
    item: Food;
    addFood: (food: Food) => void;
};

export default function MenuCard({ item, addFood }: MenuCardProps) {
    return (
        <div
            style={{
                display: "flex",
                background: "#ffffff",
                borderRadius: "14px",
                padding: "16px",
                marginBottom: "16px",
                border: "1px solid #d8e7c5",
                boxShadow: "0 6px 14px rgba(34, 48, 22, 0.08)",
                alignItems: "center",
            }}
        >
            <img
                src={item.image}
                alt={item.name}
                style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    marginRight: "20px",
                }}
            />

            <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, color: "#2f3d1d" }}>{item.name}</h3>
                <p style={{ color: "#5f6b55" }}>{item.desc}</p>
                <b style={{ color: "#d6453d" }}>{item.price} THB</b>
            </div>

            <button
                onClick={() => addFood(item)}
                style={{
                    background: "#f4c84a",
                    border: "none",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    color: "#33240a",
                    fontWeight: 600,
                }}
            >
                Add
            </button>
        </div>
    );
}
