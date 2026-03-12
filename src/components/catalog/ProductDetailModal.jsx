function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-2 border-b border-neutral-800">
      <span className="text-neutral-500 text-sm">{label}</span>
      <span className="text-stone-200 text-sm font-medium text-right max-w-xs">
        {value}
      </span>
    </div>
  );
}
export default function ProductDetailModal({ product, onClose, onEdit }) {
  const s = product.spec || {};

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 px-6 py-4 flex items-start justify-between">
          <div>
            <p className="text-amber-500 text-xs tracking-widest mb-1">
              {product.partNo}
            </p>
            <h2 className="text-xl font-bold text-stone-100">
              {product.name || (
                <span className="text-neutral-500 italic">No name</span>
              )}
            </h2>
            <div className="flex gap-2 mt-2 flex-wrap">
              {product.category && (
                <span className="text-xs bg-neutral-800 text-stone-400 px-2 py-1 rounded">
                  {product.category}
                </span>
              )}
              {product.type && (
                <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 rounded">
                  {product.type}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-stone-200 text-2xl ml-4 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* Photo */}
          {product.photo?.main && (
            <img
              src={product.photo.main}
              alt={product.name}
              className="w-full h-48 object-contain bg-neutral-800 rounded-lg"
            />
          )}

          {/* Specifications */}
          <div>
            <p className="text-xs tracking-widest text-amber-500 uppercase mb-2">
              Specifications
            </p>
            <Row label="Material" value={s.material} />
            <Row label="Heat Treatment" value={s.heatTreatment} />
            <Row label="Surface Treatment" value={s.surfaceTreatment} />
            <Row label="Head Type" value={s.headType} />
            <Row label="Drive Type" value={s.driveType} />
            <Row label="Thread Size" value={s.threadSize} />
            <Row label="Length" value={s.length ? `${s.length} mm` : null} />
            <Row label="Outer Diameter" value={s.outerDiameter} />
            <Row label="Inner Diameter" value={s.innerDiameter} />
            <Row
              label="Thickness"
              value={s.thickness ? `${s.thickness} mm` : null}
            />
            <Row label="Standard" value={s.standard} />
            <Row label="Grade" value={s.grade} />
            <Row label="Note" value={s.note} />
          </div>

          {/* Identity */}
          <div>
            <p className="text-xs tracking-widest text-amber-500 uppercase mb-2">
              Identity
            </p>
            <Row label="Customer" value={product.customer} />
            <Row label="Supplier" value={product.supplier} />
            <Row
              label="Vol / Month"
              value={
                product.volumePerMonth
                  ? `${product.volumePerMonth.toLocaleString()} pcs`
                  : null
              }
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-neutral-900 border-t border-neutral-800 px-6 py-4">
          <button
            onClick={() => {
              onClose();
              onEdit(product);
            }}
            className="w-full py-3 border border-neutral-700 hover:border-amber-500 hover:text-amber-500 
                       text-stone-400 text-sm tracking-widest uppercase rounded-lg transition-colors"
          >
            Edit Product
          </button>
        </div>
      </div>
    </div>
  );
}
