import { useState } from "react";
import { API_URL, CLOUD_NAME, UPLOAD_PRESET } from "../constants/api";
import Field from "./catalog/Field";
import Logo from "../assets/logo.svg";

const initialForm = {
  partNo: "",
  name: "",
  category: "",
  type: "",
  customer: "",
  supplier: "",
  volumePerMonth: "",
  qtyPerBox: "",
  location: "",
  spec: {
    material: "",
    heatTreatment: "",
    surfaceTreatment: "",
    headType: "",
    driveType: "",
    threadSize: "",
    length: "",
    outerDiameter: "",
    innerDiameter: "",
    thickness: "",
    standard: "",
    grade: "",
    note: "",
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
    setSuccess(false);

    try {
      let photo = { main: "", thumbnail: "" };
      if (imageFile) photo = await uploadToCloudinary(imageFile);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          volumePerMonth: form.volumePerMonth
            ? Number(form.volumePerMonth)
            : undefined,
          qtyPerBox: form.qtyPerBox ? Number(form.qtyPerBox) : undefined,
          photo,
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-wide text-stone-100">
            Add Product
          </h1>
        </div>

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
          {/* Image */}
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
                  <p className="text-neutral-500 text-sm">
                    Click to upload image
                  </p>
                  <p className="text-neutral-600 text-xs mt-1">
                    PNG, JPG, WEBP
                  </p>
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
            <h2 className="text-xs tracking-widest text-amber-500 uppercase mb-4 border-b border-neutral-800 pb-2">
              Specifications
            </h2>
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
                placeholder="e.g. 8.8"
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
