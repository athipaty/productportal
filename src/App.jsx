import { useState } from "react";
import AddProductForm from "./components/AddProductForm";
import ProductList from "./components/catalog/ProductList";

export default function App() {
  const [tab, setTab] = useState("list");

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Tab Nav */}
      <div className="border-b border-neutral-800 px-8 pt-6 flex gap-6">
        <button
          onClick={() => setTab("list")}
          className={`pb-3 text-sm tracking-widest uppercase transition-colors ${
            tab === "list"
              ? "text-amber-500 border-b-2 border-amber-500"
              : "text-neutral-500 hover:text-stone-300"
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setTab("add")}
          className={`pb-3 text-sm tracking-widest uppercase transition-colors ${
            tab === "add"
              ? "text-amber-500 border-b-2 border-amber-500"
              : "text-neutral-500 hover:text-stone-300"
          }`}
        >
          Add Product
        </button>
      </div>

      {/* Content */}
      {tab === "list" ? <ProductList /> : <AddProductForm />}
    </div>
  );
}
