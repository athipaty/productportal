import { useState } from "react";
import AddProductForm from "./components/AddProductForm";
import ProductList from "./components/catalog/ProductList";
import UploadExcel from "./components/catalog/UploadExcel";

const CATEGORY_TYPES = {
  Fastener: ["Bolt", "Nut", "Screw", "Stud"],
  Washer: ["Washer"],
  Pin: ["Pin"],
  Ring: ["Ring"],
  Rivet: ["Rivet"],
  Insert: ["Insert"],
  Collar: ["Collar"],
  Other: [],
};

const CATEGORIES = ["All", ...Object.keys(CATEGORY_TYPES)];

const NAV = [
  { key: "list", label: "Catalog", icon: "◈" },
  { key: "add", label: "Add Product", icon: "+" },
  { key: "upload", label: "Upload Excel", icon: "↑" },
  { key: "sales", label: "Sales Report", icon: "↗" },
];

function ComingSoon() {
  return (
    <div className="flex items-center justify-center h-full min-h-screen">
      <p className="text-stone-400 text-lg tracking-widest">
        On plan
        <span className="inline-flex gap-1 ml-1">
          <span
            className="animate-bounce inline-block"
            style={{ animationDelay: "0ms" }}
          >
            .
          </span>
          <span
            className="animate-bounce inline-block"
            style={{ animationDelay: "150ms" }}
          >
            .
          </span>
          <span
            className="animate-bounce inline-block"
            style={{ animationDelay: "300ms" }}
          >
            .
          </span>
        </span>
      </p>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("list");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    setType("All");
    if (cat === "All") setSidebarOpen(false);
  };

  const handleTypeClick = (t) => {
    setType(t);
    setSidebarOpen(false);
  };

  const types = category !== "All" ? CATEGORY_TYPES[category] || [] : [];

  return (
    <div className="flex min-h-screen bg-neutral-950">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
  fixed lg:static inset-y-0 left-0 z-30
  w-56 bg-neutral-900 border-r border-neutral-800
  flex flex-col transition-transform duration-300
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
`}
      >
        {/* Logo */}
        <div className="px-5 py-6 border-b border-neutral-800">
          <p className="text-amber-500 text-xs tracking-widest mb-1 animate-pulse">
            PRODUCT
          </p>
          <h1 className="text-stone-100 text-xl font-bold tracking-wide">
            Portal
          </h1>
        </div>

        {/* Main Nav */}
        <nav className="px-3 py-4 border-b border-neutral-800">
          <p className="text-neutral-600 text-xs tracking-widest px-2 mb-2">
            MENU
          </p>
          {NAV.map(({ key, label, icon }, i) => (
            <button
              key={key}
              onClick={() => {
                setTab(key);
                setSidebarOpen(false);
              }}
              style={{ animationDelay: `${i * 60}ms` }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 mb-1
          animate-[fadeSlideIn_0.3s_ease_forwards] opacity-0
          ${
            tab === key
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 translate-x-1"
              : "text-neutral-400 hover:text-stone-200 hover:bg-neutral-800 hover:translate-x-1"
          }`}
            >
              <span
                className={`text-base w-4 text-center transition-transform duration-200 ${tab === key ? "scale-125" : ""}`}
              >
                {icon}
              </span>
              {label}
              {tab === key && (
                <span className="ml-auto w-1 h-4 bg-amber-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Category Filter */}
        {tab === "list" && (
          <nav className="px-3 py-4 flex-1 overflow-y-auto">
            <p className="text-neutral-600 text-xs tracking-widest px-2 mb-2">
              CATEGORY
            </p>
            {CATEGORIES.map((cat, i) => (
              <div key={cat}>
                <button
                  onClick={() => handleCategoryClick(cat)}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 mb-0.5
              animate-[fadeSlideIn_0.3s_ease_forwards] opacity-0
              ${
                category === cat && type === "All"
                  ? "bg-amber-500 text-neutral-950 font-bold"
                  : category === cat
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "text-neutral-400 hover:text-stone-200 hover:bg-neutral-800 hover:translate-x-1"
              }`}
                >
                  <span>{cat}</span>
                  {CATEGORY_TYPES[cat]?.length > 0 && (
                    <span
                      className={`text-xs transition-transform duration-300 ${category === cat ? "rotate-90" : ""}`}
                    >
                      ›
                    </span>
                  )}
                </button>

                {/* Expanded types */}
                {category === cat && cat !== "All" && types.length > 0 && (
                  <div className="ml-3 pl-3 border-l border-neutral-800 mb-1 overflow-hidden">
                    {types.map((t, j) => (
                      <button
                        key={t}
                        onClick={() => handleTypeClick(t)}
                        style={{ animationDelay: `${j * 50}ms` }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all duration-200 mb-0.5
                    animate-[fadeSlideIn_0.25s_ease_forwards] opacity-0
                    ${
                      type === t
                        ? "bg-amber-500 text-neutral-950 font-bold"
                        : "text-neutral-500 hover:text-stone-200 hover:bg-neutral-800 hover:translate-x-1"
                    }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        )}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-4 px-4 py-3 border-b border-neutral-800 bg-neutral-900">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-neutral-400 hover:text-stone-200 text-xl"
          >
            ☰
          </button>
          <span className="text-amber-500 text-sm tracking-widest font-bold">
            PRODUCT PORTAL
          </span>
        </div>

        <div className="flex-1">
          {tab === "list" && <ProductList category={category} type={type} />}
          {tab === "add" && <AddProductForm />}
          {tab === "upload" && (
            <UploadExcel onUploaded={() => setTab("list")} />
          )}
          {tab === "sales" && <ComingSoon />}
        </div>
      </div>
    </div>
  );
}
