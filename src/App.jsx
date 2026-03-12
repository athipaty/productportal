import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ProductList from "./components/catalog/ProductList";
import AddProductForm from "./components/AddProductForm";
import UploadExcel from "./components/catalog/UploadExcel";

function ComingSoon() {
  return (
    <div className="flex items-center justify-center h-full min-h-screen">
      <p className="text-stone-400 text-lg tracking-widest">
        Coming soon
        <span className="inline-flex gap-1 ml-1">
          <span className="animate-bounce inline-block" style={{ animationDelay: "0ms" }}>.</span>
          <span className="animate-bounce inline-block" style={{ animationDelay: "150ms" }}>.</span>
          <span className="animate-bounce inline-block" style={{ animationDelay: "300ms" }}>.</span>
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

  return (
    <div className="flex min-h-screen bg-neutral-950">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        tab={tab}
        setTab={setTab}
        category={category}
        type={type}
        onCategoryClick={handleCategoryClick}
        onTypeClick={handleTypeClick}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-4 px-4 py-3 border-b border-neutral-800 bg-neutral-900">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-neutral-400 hover:text-stone-200 text-xl"
          >
            ☰
          </button>
          <span className="text-amber-500 text-sm tracking-widest font-bold">PRODUCT PORTAL</span>
        </div>

        <div className="flex-1">
          {tab === "list"   && <ProductList category={category} type={type} />}
          {tab === "add"    && <AddProductForm />}
          {tab === "upload" && <UploadExcel onUploaded={() => setTab("list")} />}
          {tab === "sales"  && <ComingSoon />}
        </div>
      </div>

    </div>
  );
}