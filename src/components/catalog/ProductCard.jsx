export default function ProductCard({ product, onView }) {
  const s = product.spec || {};

  return (
    <div
      onClick={() => onView(product)}
      className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 hover:border-amber-500 transition-colors cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-amber-500 text-xs tracking-widest">{product.partNo}</p>
          <p className="text-stone-500 text-xs mt-0.5">
            {product.volumePerMonth ? `${product.volumePerMonth.toLocaleString()} pcs/month` : "— pcs/month"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-stone-400 text-xs">{s.material || "—"}</p>
          <p className="text-stone-500 text-xs mt-0.5">{s.threadSize || "—"}</p>
        </div>
      </div>

      <div className="text-xs border-t border-neutral-800 pt-3">
        <p className="text-neutral-600 mb-0.5">Length</p>
        <p className="text-stone-300">{s.length ? `${s.length} mm` : "—"}</p>
      </div>
    </div>
  );
}