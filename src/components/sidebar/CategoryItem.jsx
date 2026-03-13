import { useEffect, useState } from "react";

export default function CategoryItem({ cat, active, activeType, types, onCategoryClick, onTypeClick, delay, isOpen, onToggle }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const hasMultipleTypes = types.length > 1;
  const expanded = isOpen && hasMultipleTypes;

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-10px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      <button
        onClick={() => {
          onCategoryClick(cat);
          if (hasMultipleTypes) onToggle();
        }}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 mb-0.5 hover:translate-x-1
          ${active && activeType === "All"
            ? "bg-amber-500 text-neutral-950 font-bold"
            : active
            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            : "text-neutral-400 hover:text-stone-200 hover:bg-neutral-800"
          }`}
      >
        <span>{cat}</span>
        {hasMultipleTypes && (
          <span style={{
            display: "inline-block",
            transition: "transform 0.3s ease",
            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
            fontSize: "12px",
          }}>
            ›
          </span>
        )}
      </button>

      <div style={{
        maxHeight: expanded ? `${types.length * 40}px` : "0px",
        overflow: "hidden",
        transition: "max-height 0.35s ease",
      }}>
        <div className="ml-3 pl-3 border-l border-neutral-800 mb-1">
          {types.map((t, j) => (
            <button
              key={t}
              onClick={() => onTypeClick(t)}
              style={{
                opacity: expanded ? 1 : 0,
                transform: expanded ? "translateX(0)" : "translateX(-6px)",
                transition: `opacity 0.25s ease ${j * 40}ms, transform 0.25s ease ${j * 40}ms`,
              }}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors duration-200 mb-0.5 hover:translate-x-1
                ${activeType === t
                  ? "bg-amber-500 text-neutral-950 font-bold"
                  : "text-neutral-500 hover:text-stone-200 hover:bg-neutral-800"
                }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}