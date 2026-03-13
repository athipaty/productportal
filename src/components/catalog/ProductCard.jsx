export default function ProductCard({ product, onView }) {
  const s = product.spec || {};

  const location = Array.isArray(product.location) && product.location.length > 0
    ? product.location.join(", ")
    : product.location || null;

  return (
    <div
      onClick={() => onView(product)}
      className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 hover:border-amber-500 transition-colors cursor-pointer flex gap-4"
    >
      {/* Image */}
      <div className="w-20 h-20 flex-shrink-0 bg-neutral-800 rounded-lg overflow-hidden flex items-center justify-center">
        {product.photo?.thumbnail ? (
          <img src={product.photo.thumbnail} alt={product.partNo} className="w-full h-full object-cover" />
        ) : (
          <span className="text-neutral-600 text-xs">No img</span>
        )}
      </div>

      {/* Data */}
      <div className="flex-1 min-w-0 overflow-hidden">

        {/* Top row */}
        <div className="flex justify-between items-start mb-1">
          <div className="min-w-0 flex-1">
            <p className="text-amber-500 text-xs tracking-widest truncate">{product.partNo}</p>
            <p className="text-stone-500 text-xs mt-0.5">
              {product.volumePerMonth ? `${product.volumePerMonth.toLocaleString()} / month` : "—"}
            </p>
          </div>
          <div className="text-right ml-2 flex-shrink-0">
            <p className="text-stone-400 text-xs">{s.material || "—"}</p>
            <p className="text-stone-500 text-xs mt-0.5">{s.threadSize || "—"}</p>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-neutral-800 pt-2 mt-2 flex justify-between items-start text-xs gap-2">
          <div className="space-y-1 min-w-0 flex-1">
            <p className="text-neutral-600 whitespace-nowrap">
              {s.length ? `${s.length} mm` : "—"}
            </p>
            {location && (
              <p className="text-stone-500 truncate">
                <span className="text-neutral-600 mr-1">{location}</span>
              </p>
            )}
          </div>
          <div className="text-right flex-shrink-0 space-y-1 max-w-[45%]">
            <p className="text-stone-400 truncate">{s.heatTreatment || "—"}</p>
            <p className="text-stone-500 truncate">{s.surfaceTreatment || "—"}</p>
          </div>
        </div>

      </div>
    </div>
  );
}