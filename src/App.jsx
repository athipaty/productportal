import { useState } from "react";
import AddProductForm from "./components/AddProductForm";
import ProductList from "./components/catalog/ProductList";
import UploadExcel from "./components/catalog/UploadExcel";

export default function App() {
  const [tab, setTab] = useState("list");

  const tabs = [
    { key: "list", label: "Products" },
    { key: "add", label: "Add Product" },
    { key: "upload", label: "Upload Excel" },
  ];

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Tab Nav */}
      <div className="border-b border-neutral-800 px-8 pt-6 flex gap-6">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`pb-3 text-sm tracking-widest uppercase transition-colors ${
              tab === key
                ? "text-amber-500 border-b-2 border-amber-500"
                : "text-neutral-500 hover:text-stone-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "list" && <ProductList />}
      {tab === "add" && <AddProductForm />}
      {tab === "upload" && <UploadExcel onUploaded={() => setTab("list")} />}
    </div>
  );
}