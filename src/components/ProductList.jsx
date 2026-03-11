import { useEffect, useState } from "react";

const API_URL = "https://center-kitchen-backend.onrender.com/catalog";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        // API might return an object instead of array
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-widest text-stone-100">
          Products
        </h1>
        <p className="text-stone-500 mt-1">{products.length} items found</p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 hover:border-amber-500 transition-colors cursor-pointer"
          >
            {/* Thumbnail */}
            {product.photo?.thumbnail ? (
              <img
                src={product.photo.thumbnail}
                alt={product.name}
                className="w-full h-40 object-cover rounded mb-4 bg-neutral-800"
              />
            ) : (
              <div className="w-full h-40 bg-neutral-800 rounded mb-4 flex items-center justify-center">
                <span className="text-neutral-600 text-sm">No image</span>
              </div>
            )}

            {/* Part No */}
            <p className="text-amber-500 text-xs tracking-widest mb-1">
              {product.partNo}
            </p>

            {/* Name */}
            <h2 className="text-stone-100 font-semibold text-lg mb-1">
              {product.name}
            </h2>

            {/* Category & Type */}
            <div className="flex gap-2 mb-3">
              {product.category && (
                <span className="text-xs bg-neutral-800 text-stone-400 px-2 py-1 rounded">
                  {product.category}
                </span>
              )}
              {product.type && (
                <span className="text-xs bg-neutral-800 text-stone-400 px-2 py-1 rounded">
                  {product.type}
                </span>
              )}
            </div>

            {/* Spec summary */}
            <div className="text-xs text-stone-500 space-y-1 border-t border-neutral-800 pt-3">
              {product.spec?.diameter && (
                <p>
                  Diameter:{" "}
                  <span className="text-stone-300">
                    {product.spec.diameter}
                  </span>
                </p>
              )}
              {product.spec?.lengthMm && (
                <p>
                  Length:{" "}
                  <span className="text-stone-300">
                    {product.spec.lengthMm} mm
                  </span>
                </p>
              )}
              {product.spec?.material && (
                <p>
                  Material:{" "}
                  <span className="text-stone-300">
                    {product.spec.material}
                  </span>
                </p>
              )}
              {product.spec?.grade && (
                <p>
                  Grade:{" "}
                  <span className="text-stone-300">{product.spec.grade}</span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
