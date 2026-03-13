import { useState, useEffect } from "react";

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-2 border-b border-neutral-800">
      <span className="text-neutral-500 text-sm">{label}</span>
      <span className="text-stone-200 text-sm font-medium text-right max-w-xs">{value}</span>
    </div>
  );
}

export default function ProductDetailModal({ product, onClose, onEdit }) {
  const s = product.spec || {};
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const locationValue = Array.isArray(product.location) && product.location.length > 0
    ? product.location.join(", ")
    : product.location || null;

  return (
    <div
      onClick={handleClose}
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.25s ease",
      }}
      className="fixed inset-0 bg-black bg-opacity-80 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
          transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease",
          opacity: visible ? 1 : 0,
        }}
        className="bg-neutral-900 rounded-t-2xl sm:rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 px-6 py-4 flex items-start justify-between">
          <div>
            <p className="text-amber-500 text-xs tracking-widest mb-1">{product.partNo}</p>
            <div className="flex gap-2 mt-1 flex-wrap">
              {product.category && (
                <span className="text-xs bg-neutral-800 text-stone-400 px-2 py-1 rounded">{product.category}</span>
              )}
              {product.type && (
                <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 rounded">{product.type}</span>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
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
              alt={product.partNo}
              className="w-full h-48 object-contain bg-neutral-800 rounded-lg"
            />
          )}

          {/* Identity */}
          <div>
            <p className="text-xs tracking-widest text-amber-500 uppercase mb-2">Identity</p>
            <Row label="Customer"    value={product.customer} />
            <Row label="Supplier"    value={product.supplier} />
            <Row label="Vol / Month" value={product.volumePerMonth ? `${product.volumePerMonth.toLocaleString()} pcs` : null} />
            <Row label="Qty Per Box" value={product.qtyPerBox ? `${product.qtyPerBox.toLocaleString()} pcs` : null} />
            <Row label="Location"    value={locationValue} />
          </div>

          {/* Specifications */}
          <div>
            <p className="text-xs tracking-widest text-amber-500 uppercase mb-2">Specifications</p>
            <Row label="Material"          value={s.material} />
            <Row label="Heat Treatment"    value={s.heatTreatment} />
            <Row label="Surface Treatment" value={s.surfaceTreatment} />
            <Row label="Head Type"         value={s.headType} />
            <Row label="Drive Type"        value={s.driveType} />
            <Row label="Thread Size"       value={s.threadSize} />
            <Row label="Length"            value={s.length ? `${s.length} mm` : null} />
            <Row label="Outer Diameter"    value={s.outerDiameter} />
            <Row label="Inner Diameter"    value={s.innerDiameter} />
            <Row label="Thickness"         value={s.thickness ? `${s.thickness} mm` : null} />
            <Row label="Standard"          value={s.standard} />
            <Row label="Grade"             value={s.grade} />
            <Row label="Note"              value={s.note} />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-neutral-900 border-t border-neutral-800 px-6 py-4">
          <button
            onClick={() => { handleClose(); setTimeout(() => onEdit(product), 250); }}
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