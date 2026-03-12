import { useEffect, useState } from "react";
import { BASE_URL } from "../constants/api";

const NAV = [
  { key: "list",   label: "Catalog",      icon: "◈" },
  { key: "add",    label: "Add Product",  icon: "+" },
  { key: "upload", label: "Upload Excel", icon: "↑" },
  { key: "sales",  label: "Sales Report", icon: "↗" },
];

function NavItem({ icon, label, active, onClick, delay }) {
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

function CategoryItem({ cat, active, activeType, types, onCategoryClick, onTypeClick, delay }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const expanded = active && types.length > 0;

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-10px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      <button
        onClick={() => onCategoryClick(cat)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 mb-0.5 hover:translate-x-1
          ${active && activeType === "All"
            ? "bg-amber-500 text-neutral-950 font-bold"
            : active
            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            : "text-neutral-400 hover:text-stone-200 hover:bg-neutral-800"
          }`}
      >
        <span>{cat}</span>
        {types.length > 0 && (
          <span style={{
            display: "inline-block",
            transition: "transform 0.3s ease",
            transform: active ? "rotate(90deg)" : "rotate(0deg)",
            fontSize: "12px",
          }}>
            ›
          </span>
        )}
      </button>

      {/* Types — smooth expand */}
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

export default function Sidebar({ tab, setTab, category, type, onCategoryClick, onTypeClick, sidebarOpen, setSidebarOpen }) {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/catalog/categories`)
      .then((res) => res.json())
      .then((data) => Array.isArray(data) ? setCategoryData(data) : null)
      .catch(console.error);
  }, []);

  return (
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-30
      w-56 bg-neutral-900 border-r border-neutral-800
      flex flex-col transition-transform duration-300
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    `}>

      {/* Logo */}
      <div className="px-5 py-6 border-b border-neutral-800">
        <p className="text-amber-500 text-xs tracking-widest mb-1 animate-pulse">PRODUCT</p>
        <h1 className="text-stone-100 text-xl font-bold tracking-wide">Portal</h1>
      </div>

      {/* Main Nav */}
      <nav className="px-3 py-4 border-b border-neutral-800">
        <p className="text-neutral-600 text-xs tracking-widest px-2 mb-2">MENU</p>
        {NAV.map(({ key, label, icon }, i) => (
          <NavItem
            key={key}
            icon={icon}
            label={label}
            active={tab === key}
            delay={i * 60}
            onClick={() => { setTab(key); setSidebarOpen(false); }}
          />
        ))}
      </nav>

      {/* Category Filter */}
      {tab === "list" && (
        <nav className="px-3 py-4 flex-1 overflow-y-auto">
          <p className="text-neutral-600 text-xs tracking-widest px-2 mb-2">CATEGORY</p>

          {/* All */}
          <CategoryItem
            cat="All"
            active={category === "All"}
            activeType={type}
            types={[]}
            onCategoryClick={onCategoryClick}
            onTypeClick={onTypeClick}
            delay={0}
          />

          {/* Dynamic */}
          {categoryData.map((c, i) => (
            <CategoryItem
              key={c.category}
              cat={c.category}
              active={category === c.category}
              activeType={type}
              types={c.types}
              onCategoryClick={onCategoryClick}
              onTypeClick={onTypeClick}
              delay={i * 50}
            />
          ))}

          {categoryData.length === 0 && (
            <p className="text-neutral-700 text-xs px-3 py-2 animate-pulse">Loading...</p>
          )}
        </nav>
      )}
    </aside>
  );
}