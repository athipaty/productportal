export default function ProductCard({ product, onView }) {
  const s = product.spec || {};

  return (
    <div
      onClick={() => onView(product)}
      className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 hover:border-amber-500 transition-colors cursor-pointer"
    >
      <p className="text-amber-500 text-xs tracking-widest mb-1">{product.partNo}</p>
      <h2 className="text-stone-100 font-semibold mb-3 truncate">
        {product.name || <span className="text-neutral-600 italic text-sm">No name</span>}
      </h2>

      {/* Customer / Supplier */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {product.customer && <span className="text-xs bg-neutral-800 text-amber-400 px-2 py-1 rounded">{product.customer}</span>}
        {product.supplier && <span className="text-xs bg-neutral-800 text-stone-400 px-2 py-1 rounded">{product.supplier}</span>}
      </div>

      {/* Key specs */}
      <div className="text-xs text-stone-500 space-y-1 border-t border-neutral-800 pt-3">
        {s.threadSize && <p>Thread: <span className="text-stone-300">{s.threadSize}</span></p>}
        {s.length     && <p>Length: <span className="text-stone-300">{s.length} mm</span></p>}
        {s.material   && <p>Material: <span className="text-stone-300">{s.material}</span></p>}
        {product.volumePerMonth && <p>Vol/Month: <span className="text-stone-300">{product.volumePerMonth.toLocaleString()} pcs</span></p>}
      </div>
    </div>
  );
}