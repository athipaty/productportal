import { useState } from "react";

const API_URL = "https://center-kitchen-backend.onrender.com/catalog";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
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

          {/* Basic Info */}
          <div>
            <h2 className="text-xs tracking-widest text-amber-500 uppercase mb-4 border-b border-neutral-800 pb-2">
              Basic Info
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Part No *"
                name="partNo"
                value={form.partNo}
                onChange={handleChange}
                required
                placeholder="e.g. BT-001"
              />
              <Field
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Hex Bolt"
              />
              <Field
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Bolt"
              />
              <Field
                label="Type"
                name="type"
                value={form.type}
                onChange={handleChange}
                placeholder="e.g. Hex"
              />
            </div>
          </div>

          {/* Spec */}
          <div>
            <h2 className="text-xs tracking-widest text-amber-500 uppercase mb-4 border-b border-neutral-800 pb-2">
              Specifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Standard"
                name="spec.standard"
                value={form.spec.standard}
                onChange={handleChange}
                placeholder="e.g. ISO, DIN"
              />
              <Field
                label="Diameter"
                name="spec.diameter"
                value={form.spec.diameter}
                onChange={handleChange}
                placeholder="e.g. M8"
              />
              <Field
                label="Length (mm)"
                name="spec.lengthMm"
                type="number"
                value={form.spec.lengthMm}
                onChange={handleChange}
                placeholder="e.g. 30"
              />
              <Field
                label="Thread Pitch"
                name="spec.threadPitch"
                type="number"
                value={form.spec.threadPitch}
                onChange={handleChange}
                placeholder="e.g. 1.25"
              />
              <Field
                label="Grade"
                name="spec.grade"
                value={form.spec.grade}
                onChange={handleChange}
                placeholder="e.g. 8.8"
              />
              <Field
                label="Material"
                name="spec.material"
                value={form.spec.material}
                onChange={handleChange}
                placeholder="e.g. Steel"
              />
              <Field
                label="Coating"
                name="spec.coating"
                value={form.spec.coating}
                onChange={handleChange}
                placeholder="e.g. Zinc"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-700 disabled:text-neutral-500 text-neutral-950 font-bold tracking-widest rounded-lg transition-colors"
          >
            {loading ? "Saving..." : "Add Product"}
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