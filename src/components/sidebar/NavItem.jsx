import { useEffect, useState } from "react";

export default function NavItem({ icon, label, active, onClick, delay }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <button
      onClick={onClick}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-10px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1
        hover:translate-x-1 transition-colors duration-200
        ${active
          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          : "text-neutral-400 hover:text-stone-200 hover:bg-neutral-800"
        }`}
    >
      <span className={`text-base w-4 text-center transition-transform duration-200 ${active ? "scale-125" : ""}`}>
        {icon}
      </span>
      {label}
      {active && <span className="ml-auto w-1 h-4 bg-amber-500 rounded-full" />}
    </button>
  );
}