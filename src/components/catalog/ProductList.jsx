import { useEffect, useState } from "react";
import { API_URL } from "../../constants/api";
import ProductCard from "./ProductCard";
import EditModal from "./EditModal";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="fixed inset-0 bg-neutral-950 flex items-center justify-center">
        <p className="text-stone-200 text-xl tracking-widest animate-pulse">
          Loading...
        </p>
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-widest text-stone-100">
          Products
        </h1>
        <p className="text-stone-500 mt-1">{products.length} items found</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onEdit={setEditProduct}
          />
        ))}
      </div>

      {editProduct && (
        <EditModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSaved={() => {
            setEditProduct(null);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
}
