import { useEffect, useState } from "react";
import { BASE_URL } from "../constants/api";
import NavItem from "./sidebar/NavItem";
import CategoryItem from "./sidebar/CategoryItem";

const NAV = [
  { key: "list",   label: "Catalog",      icon: "◈" },
  { key: "add",    label: "Add Product",  icon: "+" },
  { key: "upload", label: "Upload Excel", icon: "↑" },
  { key: "sales",  label: "Sales Report", icon: "↗" },
];

export default function Sidebar({ tab, setTab, category, type, onCategoryClick, onTypeClick, sidebarOpen, setSidebarOpen }) {
  const [categoryData, setCategoryData] = useState([]);
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [openCategory, setOpenCategory] = useState(null);

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

          {/* Category header toggle */}
          <button
            onClick={() => setCategoryOpen(o => !o)}
            className="w-full flex items-center justify-between px-2 mb-2 group"
          >
            <p className="text-neutral-600 text-xs tracking-widest group-hover:text-neutral-400 transition-colors">
              CATEGORY
            </p>
            <span style={{
              display: "inline-block",
              fontSize: "12px",
              color: "#525252",
              transition: "transform 0.3s ease",
              transform: categoryOpen ? "rotate(90deg)" : "rotate(0deg)",
            }}>
              ›
            </span>
          </button>

          {/* Collapsible list */}
          <div style={{
            maxHeight: categoryOpen ? "2000px" : "0px",
            overflow: "hidden",
            transition: "max-height 0.4s ease",
          }}>

            {/* All */}
            <CategoryItem
              cat="All"
              active={category === "All"}
              activeType={type}
              types={[]}
              onCategoryClick={() => { onCategoryClick("All"); setOpenCategory(null); }}
              onTypeClick={onTypeClick}
              delay={0}
              isOpen={false}
              onToggle={() => {}}
            />

            {/* Dynamic categories */}
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
                isOpen={openCategory === c.category}
                onToggle={() => setOpenCategory(o => o === c.category ? null : c.category)}
              />
            ))}

            {categoryData.length === 0 && (
              <p className="text-neutral-700 text-xs px-3 py-2 animate-pulse">Loading...</p>
            )}
          </div>
        </nav>
      )}
    </aside>
  );
}