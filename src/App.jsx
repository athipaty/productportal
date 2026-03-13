import { useState, useEffect } from "react";

import Sidebar from "./components/Sidebar";
import ProductList from "./components/catalog/ProductList";
import AddProductForm from "./components/AddProductForm";
import UploadExcel from "./components/catalog/UploadExcel";
import { BASE_URL } from "./constants/api";
import Logo from "./assets/logo.svg";

function PasswordGate({ onUnlock }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // On mount — check existing token
  useEffect(() => {
    const token = localStorage.getItem("portal_token");
    if (!token) return;

    fetch(`${BASE_URL}/auth/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) onUnlock();
      })
      .catch(() => {});
  }, [onUnlock]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: input }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Incorrect password");
        setInput("");
        return;
      }

      localStorage.setItem("portal_token", data.token);
      onUnlock();
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <img src={Logo} alt="Product Portal" className="w-48 mb-4" />
          <p className="text-neutral-600 text-sm">Enter password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
            }}
            placeholder="Password"
            autoFocus
            className={`w-full px-4 py-3 bg-neutral-900 border rounded-xl text-stone-100 text-sm text-center
            focus:outline-none transition-colors placeholder:text-neutral-600
            ${error ? "border-red-500" : "border-neutral-700 focus:border-amber-500"}`}
          />
          {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-700 disabled:text-neutral-500 text-neutral-950 font-bold tracking-widest rounded-xl transition-colors text-sm uppercase"
          >
            {loading ? "Checking..." : "Unlock"}
          </button>
        </form>
      </div>
    </div>
  );
}

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
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

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
          <img src={Logo} alt="Product Portal" className="h-7" />
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
