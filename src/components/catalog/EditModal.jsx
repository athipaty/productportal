import { useState } from "react";
import { API_URL, CLOUD_NAME, UPLOAD_PRESET } from "../../constants/api";
import Field from "./Field";

export default function EditModal({ product, onClose, onSaved }) {
  const [form, setForm] = useState({
    partNo: product.partNo || "",
    name: product.name || "",
    category: product.category || "",
    type: product.type || "",
    spec: {
      standard: product.spec?.standard || "",
      diameter: product.spec?.diameter || "",
      lengthMm: product.spec?.lengthMm || "",
      threadPitch: product.spec?.threadPitch || "",
      grade: product.spec?.grade || "",
      material: product.spec?.material || "",
      coating: product.spec?.coating || "",
    },
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(product.photo?.main || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("spec.")) {
      const key = name.replace("spec.", "");
      setForm(f => ({ ...f, spec: { ...f.spec, [key]: value } }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
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
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST", body: data,
    });
    const result = await res.json();
    if (result.error) throw new Error(result.error.message);
    return {
      main: result.secure_url,
      thumbnail: result.secure_url.replace("/upload/", "/upload/w_200,h_200,c_fill/"),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let photo = product.photo || { main: "", thumbnail: "" };
      if (imageFile) photo = await uploadToCloudinary(imageFile);

      const res = await fetch(`${API_URL}/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form, photo,
          spec: {
            ...form.spec,
            lengthMm: form.spec.lengthMm ? Number(form.spec.lengthMm) : undefined,
            threadPitch: form.spec.threadPitch ? Number(form.spec.threadPitch) : undefined,
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-xl w-full max-w-2xl max-h-screen overflow-y-auto p-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-amber-500 text-xs tracking-widest mb-1">PRODUCT PORTAL</p>
            <h2 className="text-2xl font-bold text-stone-100">Edit Product</h2>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-stone-200 text-2xl transition-colors">✕</button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg text-red-300 text-sm">✗ {error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h3 className="text-xs tracking-widest text-amber-500 uppercase mb-4 border-b border-neutral-800 pb-2">Photo</h3>
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-neutral-700 rounded-lg cursor-pointer hover:border-amber-500 transition-colors bg-neutral-800">
              {imagePreview
                ? <img src={imagePreview} className="h-full w-full object-contain rounded-lg p-2" />
                : <div className="text-center"><p className="text-neutral-500 text-sm">Click to change image</p></div>
              }
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          <div>
            <h3 className="text-xs tracking-widest text-amber-500 uppercase mb-4 border-b border-neutral-800 pb-2">Basic Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Part No *"  name="partNo"   value={form.partNo}   onChange={handleChange} required placeholder="e.g. BT-001" />
              <Field label="Name"       name="name"     value={form.name}     onChange={handleChange} placeholder="e.g. Hex Bolt" />
              <Field label="Category"   name="category" value={form.category} onChange={handleChange} placeholder="e.g. Bolt" />
              <Field label="Type"       name="type"     value={form.type}     onChange={handleChange} placeholder="e.g. Hex" />
            </div>
          </div>

          <div>
            <h3 className="text-xs tracking-widest text-amber-500 uppercase mb-4 border-b border-neutral-800 pb-2">Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Standard"     name="spec.standard"    value={form.spec.standard}    onChange={handleChange} placeholder="e.g. ISO, DIN" />
              <Field label="Diameter"     name="spec.diameter"    value={form.spec.diameter}    onChange={handleChange} placeholder="e.g. M8" />
              <Field label="Length (mm)"  name="spec.lengthMm"    value={form.spec.lengthMm}    onChange={handleChange} type="number" placeholder="e.g. 30" />
              <Field label="Thread Pitch" name="spec.threadPitch" value={form.spec.threadPitch} onChange={handleChange} type="number" placeholder="e.g. 1.25" />
              <Field label="Grade"        name="spec.grade"       value={form.spec.grade}       onChange={handleChange} placeholder="e.g. 8.8" />
              <Field label="Material"     name="spec.material"    value={form.spec.material}    onChange={handleChange} placeholder="e.g. Steel" />
              <Field label="Coating"      name="spec.coating"     value={form.spec.coating}     onChange={handleChange} placeholder="e.g. Zinc" />
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-neutral-700 hover:border-stone-500 text-stone-400 hover:text-stone-200 text-sm tracking-widest uppercase rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-700 disabled:text-neutral-500 text-neutral-950 font-bold tracking-widest text-sm uppercase rounded-lg transition-colors">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}