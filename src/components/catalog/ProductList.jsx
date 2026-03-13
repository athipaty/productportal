import { useEffect, useState } from "react";
import { API_URL } from "../../constants/api";
import ProductCard from "./ProductCard";
import ProductDetailModal from "./ProductDetailModal";
import EditModal from "./EditModal";

export default function ProductList({ category = "All", type = "All" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((k) => k + 1);
  const imageCount = products.filter((p) => p.photo?.thumbnail).length;
  const imagePercent =
    products.length > 0 ? Math.round((imageCount / products.length) * 100) : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (category && category !== "All") params.set("category", category);
      if (type && type !== "All") params.set("type", type);

      fetch(`${API_URL}?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          setProducts(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category, type, refreshKey]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-stone-400 tracking-widest animate-pulse text-sm">
          Loading...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );

  return (
    <div className="p-6 text-stone-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-stone-100 tracking-wide">
            {type !== "All"
              ? type
              : category === "All"
                ? "All Products"
                : category}
          </h2>
          <div className="flex gap-2">
            <p className="text-stone-500 text-sm mt-0.5">
              {products.length} items
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-24 h-1 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${imagePercent}%` }}
                />
              </div>
              <p className="text-neutral-600 text-xs">
                <span className="text-amber-500">{imagePercent}%</span> with
                photo
              </p>
            </div>
          </div>
        </div>
        <input
          type="text"
          placeholder="Search part no, name, customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:ml-auto w-full sm:w-72 px-4 py-2 bg-neutral-900 border border-neutral-700
                     rounded-xl text-sm text-stone-200 placeholder-neutral-600
                     focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="text-center py-24 text-neutral-600">
          {search ? `No results for "${search}"` : `No products in ${category}`}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onView={setViewProduct}
              onEdit={setEditProduct}
            />
          ))}
        </div>
      )}

      {viewProduct && (
        <ProductDetailModal
          product={viewProduct}
          onClose={() => setViewProduct(null)}
          onEdit={(p) => {
            setViewProduct(null);
            setEditProduct(p);
          }}
        />
      )}

      {editProduct && (
        <EditModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSaved={() => {
            setEditProduct(null);
            refresh();
          }}
          onDeleted={() => {
            setEditProduct(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}
