import { useState } from "react";
import { API_URL, CLOUD_NAME, UPLOAD_PRESET } from "../constants/api";

const initialForm = {
  partNo: "",
  name: "",
  category: "",
  type: "",
  spec: {
    standard: "",
    diameter: "",
    lengthMm: "",
    threadPitch: "",
    grade: "",
    material: "",
    coating: "",
  },
};

export default function AddProductForm() {
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: data }
    );

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
    setSuccess(false);

    try {
      let photo = { main: "", thumbnail: "" };
      if (imageFile) {
        photo = await uploadToCloudinary(imageFile);
      }

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          photo,
          spec: {
            ...form.spec,
            lengthMm: form.spec.lengthMm ? Number(form.spec.lengthMm) : undefined,
            threadPitch: form.spec.threadPitch ? Number(form.spec.threadPitch) : undefined,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      setSuccess(true);
      setForm(initialForm);
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-stone-200 p-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-amber-500 text-xs tracking-widest mb-1">PRODUCT PORTAL</p>
          <h1 className="text-3xl font-bold tracking-wide text-stone-100">Add Product</h1>
        </div>

        {/* Alerts */}
        {success && (
          <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg text-green-300 text-sm">
            ✓ Product added successfully!
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg text-red-300 text-sm">
            ✗ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Image Upload */}
          <div>
            <h2 className="text-xs tracking-widest text-amber-500 uppercase mb-4 border-b border-neutral-800 pb-2">
              Photo
            </h2>
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-neutral-700 rounded-lg cursor-pointer hover:border-amber-500 transition-colors bg-neutral-900">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  className="h-full w-full object-contain rounded-lg p-2"
                />
              ) : (
                <div className="text-center">
                  <p className="text-neutral-500 text-sm">Click to upload image</p>
                  <p className="text-neutral-600 text-xs mt-1">PNG, JPG, WEBP</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Basic Info */}
          <div>
            <h2 className="text-xs tracking-widest text-amber-500 uppercase mb-4 border-b border-neutral-800 pb-2">
              Basic Info
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Part No *"  name="partNo"    value={form.partNo}    onChange={handleChange} required placeholder="e.g. BT-001" />
              <Field label="Name"       name="name"      value={form.name}      onChange={handleChange} placeholder="e.g. Hex Bolt" />
              <Field label="Category"   name="category"  value={form.category}  onChange={handleChange} placeholder="e.g. Bolt" />
              <Field label="Type"       name="type"      value={form.type}      onChange={handleChange} placeholder="e.g. Hex" />
            </div>
          </div>

          {/* Spec */}
          <div>
            <h2 className="text-xs tracking-widest text-amber-500 uppercase mb-4 border-b border-neutral-800 pb-2">
              Specifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Standard"      name="spec.standard"    value={form.spec.standard}    onChange={handleChange} placeholder="e.g. ISO, DIN" />
              <Field label="Diameter"      name="spec.diameter"    value={form.spec.diameter}    onChange={handleChange} placeholder="e.g. M8" />
              <Field label="Length (mm)"   name="spec.lengthMm"    value={form.spec.lengthMm}    onChange={handleChange} type="number" placeholder="e.g. 30" />
              <Field label="Thread Pitch"  name="spec.threadPitch" value={form.spec.threadPitch} onChange={handleChange} type="number" placeholder="e.g. 1.25" />
              <Field label="Grade"         name="spec.grade"       value={form.spec.grade}       onChange={handleChange} placeholder="e.g. 8.8" />
              <Field label="Material"      name="spec.material"    value={form.spec.material}    onChange={handleChange} placeholder="e.g. Steel" />
              <Field label="Coating"       name="spec.coating"     value={form.spec.coating}     onChange={handleChange} placeholder="e.g. Zinc" />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-700 disabled:text-neutral-500 text-neutral-950 font-bold tracking-widest rounded-lg transition-colors"
          >
            {loading ? "Uploading & Saving..." : "Add Product"}
          </button>

        </form>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text", required, placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-stone-400 tracking-wide">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="bg-neutral-900 border border-neutral-700 focus:border-amber-500 focus:outline-none rounded-lg px-4 py-2 text-stone-100 text-sm transition-colors placeholder:text-neutral-600"
      />
    </div>
  );
}