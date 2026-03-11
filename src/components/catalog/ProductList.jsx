import { useEffect, useState } from "react";
import { API_URL } from "../../constants/api";
import ProductCard from "./ProductCard";
import EditModal from "./EditModal";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      const url = search
        ? `${API_URL}?q=${encodeURIComponent(search)}`
        : API_URL;

      fetch(url)
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
  }, [search, refreshKey]);

  if (loading)
    return (
      <div className="fixed inset-0 bg-neutral-950 flex items-center justify-center">
        <p className="text-stone-200 text-xl tracking-widest animate-pulse">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="fixed inset-0 bg-neutral-950 flex items-center justify-center">
        <p className="text-red-400 text-xl">Error: {error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-neutral-950 text-stone-200 p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-widest text-stone-100">Products</h1>
          <p className="text-stone-500 mt-1">{products.length} items found</p>
        </div>
        <input
          type="text"
          placeholder="Search part no, name, customer, type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:ml-auto w-full sm:w-80 px-4 py-2 bg-neutral-900 border border-neutral-700 
                     rounded-xl text-sm text-stone-200 placeholder-neutral-600 
                     focus:outline-none focus:border-amber-500"
        />
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-neutral-600">
          {search ? `No results for "${search}"` : "No products found"}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={setEditProduct}
              onDeleted={refresh}
            />
          ))}
        </div>
      )}

      {editProduct && (
        <EditModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSaved={() => { setEditProduct(null); refresh(); }}
          onDeleted={() => { setEditProduct(null); refresh(); }}
        />
      )}
    </div>
  );
}