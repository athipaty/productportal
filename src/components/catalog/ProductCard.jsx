import { useState } from "react";

export default function ProductCard({ product, onEdit }) {
  const [lightbox, setLightbox] = useState(false);

  return (
    <>
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 hover:border-amber-500 transition-colors">

        {/* Thumbnail */}
        {product.photo?.thumbnail ? (
          <img
            src={product.photo.thumbnail}
            alt={product.name}
            onClick={() => setLightbox(true)}
            className="w-full h-40 object-cover rounded mb-4 bg-neutral-800 cursor-zoom-in hover:opacity-80 transition-opacity"
          />
        ) : (
          <div className="w-full h-40 bg-neutral-800 rounded mb-4 flex items-center justify-center">
            <span className="text-neutral-600 text-sm">No image</span>
          </div>
        )}

        <p className="text-amber-500 text-xs tracking-widest mb-1">{product.partNo}</p>
        <h2 className="text-stone-100 font-semibold text-lg mb-1">{product.name}</h2>

        <div className="flex gap-2 mb-3">
          {product.category && <span className="text-xs bg-neutral-800 text-stone-400 px-2 py-1 rounded">{product.category}</span>}
          {product.type && <span className="text-xs bg-neutral-800 text-stone-400 px-2 py-1 rounded">{product.type}</span>}
        </div>

        <div className="text-xs text-stone-500 space-y-1 border-t border-neutral-800 pt-3 mb-4">
          {product.spec?.diameter && <p>Diameter: <span className="text-stone-300">{product.spec.diameter}</span></p>}
          {product.spec?.lengthMm && <p>Length: <span className="text-stone-300">{product.spec.lengthMm} mm</span></p>}
          {product.spec?.material && <p>Material: <span className="text-stone-300">{product.spec.material}</span></p>}
          {product.spec?.grade && <p>Grade: <span className="text-stone-300">{product.spec.grade}</span></p>}
        </div>

        <button
          onClick={() => onEdit(product)}
          className="w-full py-2 text-xs tracking-widest uppercase border border-neutral-700 hover:border-amber-500 hover:text-amber-500 rounded-lg transition-colors"
        >
          Edit
        </button>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 text-neutral-400 hover:text-white text-3xl transition-colors"
            onClick={() => setLightbox(false)}
          >
            ✕
          </button>
          <img
            src={product.photo.main}
            alt={product.name}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={e => e.stopPropagation()}
          />
          <p className="absolute bottom-6 text-stone-400 text-sm tracking-widest">
            {product.name} — {product.partNo}
          </p>
        </div>
      )}
    </>
  );
}