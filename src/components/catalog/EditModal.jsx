import { useState } from "react";
import { API_URL, CLOUD_NAME, UPLOAD_PRESET } from "../../constants/api";
import Field from "./Field";

export default function EditModal({ product, onClose, onSaved, onDeleted }) {
  const [form, setForm] = useState({
    partNo: product.partNo || "",
    name: product.name || "",
    category: product.category || "",
    type: product.type || "",
    customer: product.customer || "",
    supplier: product.supplier || "",
    volumePerMonth: product.volumePerMonth || "",
    qtyPerBox: product.qtyPerBox || "",
    location: Array.isArray(product.location)
      ? product.location.join(", ")
      : product.location || "",
    photo: product.photo || { main: "", thumbnail: "" },
    spec: {
      material: product.spec?.material || "",
      heatTreatment: product.spec?.heatTreatment || "",
      surfaceTreatment: product.spec?.surfaceTreatment || "",
      headType: product.spec?.headType || "",
      driveType: product.spec?.driveType || "",
      threadSize: product.spec?.threadSize || "",
      length: product.spec?.length || "",
      outerDiameter: product.spec?.outerDiameter || "",
      innerDiameter: product.spec?.innerDiameter || "",
      thickness: product.spec?.thickness || "",
      standard: product.spec?.standard || "",
      grade: product.spec?.grade || "",
      note: product.spec?.note || "",
    },
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(product.photo?.main || null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("spec.")) {
      const key = name.replace("spec.", "");
      setForm((f) => ({ ...f, spec: { ...f.spec, [key]: value } }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: data },
    );
    const result = await res.json();
    if (result.error) throw new Error(result.error.message);
    return {
      main: result.secure_url,
      thumbnail: result.secure_url.replace(
        "/upload/",
        "/upload/w_200,h_200,c_fill/",
      ),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let photo = form.photo || { main: "", thumbnail: "" };
      if (imageFile) photo = await uploadToCloudinary(imageFile);

      const res = await fetch(`${API_URL}/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          photo,
          volumePerMonth: form.volumePerMonth
            ? Number(form.volumePerMonth)
            : undefined,
          qtyPerBox: form.qtyPerBox ? Number(form.qtyPerBox) : undefined,
          location: form.location
            ? form.location
                .split(",")
                .map((l) => l.trim())
                .filter(Boolean)
            : [],
          spec: {
            ...form.spec,
            length: form.spec.length ? Number(form.spec.length) : undefined,
            thickness: form.spec.thickness
              ? Number(form.spec.thickness)
              : undefined,
          },
        }),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/${product._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      onDeleted();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-xl w-full max-w-2xl max-h-screen overflow-y-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-amber-500 text-xs tracking-widest mb-1">
              PRODUCT PORTAL
            </p>
            <h2 className="text-2xl font-bold text-stone-100">Edit Product</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-stone-200 text-2xl transition-colors"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg text-red-300 text-sm">
            ✗ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Photo */}
          <div>
            <label className="text-xs text-stone-400 tracking-wide mb-2 block">
              Photo
            </label>
            <div className="relative w-32 h-32">
              {imagePreview || form.photo?.main ? (
                <>
                  <img
                    src={imagePreview || form.photo.main}
                    className="w-32 h-32 object-cover rounded-lg border border-neutral-700"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                      setForm((f) => ({
                        ...f,
                        photo: { main: "", thumbnail: "" },
                      }));
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors shadow-lg"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-neutral-700 rounded-lg cursor-pointer hover:border-amber-500 transition-colors bg-neutral-900">
                  <p className="text-neutral-500 text-xs text-center">
                    Click to upload
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            {(imagePreview || form.photo?.main) && (
              <label className="mt-2 inline-block cursor-pointer text-xs text-neutral-500 hover:text-amber-500 transition-colors">
                Change photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Basic Info */}
          <div>
            <h3 className="text-xs tracking-widest text-amber-500 uppercase mb-4 border-b border-neutral-800 pb-2">
              Basic Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Part No *"
                name="partNo"
                value={form.partNo}
                onChange={handleChange}
                required
                placeholder="e.g. TG949046-2600"
              />
              <Field
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Hex Bolt"
              />
              <Field
                label="Customer"
                name="customer"
                value={form.customer}
                onChange={handleChange}
                placeholder="e.g. AAA"
              />
              <Field
                label="Supplier"
                name="supplier"
                value={form.supplier}
                onChange={handleChange}
                placeholder="e.g. FRJ"
              />
              <Field
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Fastener"
              />
              <Field
                label="Type"
                name="type"
                value={form.type}
                onChange={handleChange}
                placeholder="e.g. Bolt"
              />
              <Field
                label="Volume / Month"
                name="volumePerMonth"
                value={form.volumePerMonth}
                onChange={handleChange}
                type="number"
                placeholder="e.g. 800"
              />
              <Field
                label="Qty Per Box"
                name="qtyPerBox"
                value={form.qtyPerBox}
                onChange={handleChange}
                type="number"
                placeholder="e.g. 100"
              />
              <Field
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. A1-02"
              />
            </div>
          </div>

          {/* Specifications */}
          <div>
            <h3 className="text-xs tracking-widest text-amber-500 uppercase mb-4 border-b border-neutral-800 pb-2">
              Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Material"
                name="spec.material"
                value={form.spec.material}
                onChange={handleChange}
                placeholder="e.g. SWCH12A"
              />
              <Field
                label="Heat Treatment"
                name="spec.heatTreatment"
                value={form.spec.heatTreatment}
                onChange={handleChange}
                placeholder="e.g. QT (HRC44-53)"
              />
              <Field
                label="Surface Treatment"
                name="spec.surfaceTreatment"
                value={form.spec.surfaceTreatment}
                onChange={handleChange}
                placeholder="e.g. Zinc Plating"
              />
              <Field
                label="Head Type"
                name="spec.headType"
                value={form.spec.headType}
                onChange={handleChange}
                placeholder="e.g. Hex, Button, Flat"
              />
              <Field
                label="Drive Type"
                name="spec.driveType"
                value={form.spec.driveType}
                onChange={handleChange}
                placeholder="e.g. Phillips, Allen"
              />
              <Field
                label="Thread Size"
                name="spec.threadSize"
                value={form.spec.threadSize}
                onChange={handleChange}
                placeholder="e.g. M6 x 1.0"
              />
              <Field
                label="Length (mm)"
                name="spec.length"
                value={form.spec.length}
                onChange={handleChange}
                type="number"
                placeholder="e.g. 40"
              />
              <Field
                label="Outer Diameter"
                name="spec.outerDiameter"
                value={form.spec.outerDiameter}
                onChange={handleChange}
                placeholder="e.g. Ø12"
              />
              <Field
                label="Inner Diameter"
                name="spec.innerDiameter"
                value={form.spec.innerDiameter}
                onChange={handleChange}
                placeholder="e.g. Ø6"
              />
              <Field
                label="Thickness (mm)"
                name="spec.thickness"
                value={form.spec.thickness}
                onChange={handleChange}
                type="number"
                placeholder="e.g. 1.5"
              />
              <Field
                label="Standard"
                name="spec.standard"
                value={form.spec.standard}
                onChange={handleChange}
                placeholder="e.g. ISO, DIN, JIS"
              />
              <Field
                label="Grade"
                name="spec.grade"
                value={form.spec.grade}
                onChange={handleChange}
                placeholder="e.g. 8.8, A2-70"
              />
              <Field
                label="Note"
                name="spec.note"
                value={form.spec.note}
                onChange={handleChange}
                placeholder="Any extra info"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-neutral-700 hover:border-stone-500 text-stone-400 hover:text-stone-200 text-sm tracking-widest uppercase rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-700 disabled:text-neutral-500 text-neutral-950 font-bold tracking-widest text-sm uppercase rounded-lg transition-colors"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>

            {confirmDelete ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-3 border border-neutral-700 text-stone-400 text-sm tracking-widest uppercase rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-3 bg-red-700 hover:bg-red-600 disabled:bg-neutral-700 text-white font-bold text-sm tracking-widest uppercase rounded-lg transition-colors"
                >
                  {deleting ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="w-full py-3 border border-neutral-800 hover:border-red-700 text-neutral-600 hover:text-red-500 text-sm tracking-widest uppercase rounded-lg transition-colors"
              >
                Delete Product
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
