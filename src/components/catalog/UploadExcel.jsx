import { useState } from "react";
import { API_URL } from "../../constants/api";

export default function UploadExcel({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (f) => {
    if (!f) return;
    const ext = f.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls"].includes(ext)) {
      setError("Please upload an Excel file (.xlsx or .xls)");
      return;
    }
    setFile(f);
    setResult(null);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const url = `https://center-kitchen-backend.onrender.com/upload/catalog`;
      console.log("Posting to:", url); // ← check this in browser console

      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

      console.log("Status:", res.status);
      console.log("Content-Type:", res.headers.get("content-type"));

      // Read as text first to see what's actually coming back
      const text = await res.text();
      console.log("Raw response:", text);

      const data = JSON.parse(text);
      if (!res.ok) throw new Error(data.message);
      setResult(data);
      setFile(null);
      if (onUploaded) onUploaded();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-stone-200 p-8">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <p className="text-amber-500 text-xs tracking-widest mb-1">
            PRODUCT PORTAL
          </p>
          <h1 className="text-3xl font-bold tracking-wide text-stone-100">
            Upload Excel
          </h1>
          <p className="text-neutral-500 text-sm mt-2">
            Upload your catalog template to bulk import or update products.
          </p>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("excel-input").click()}
          className={`
            w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center 
            cursor-pointer transition-all duration-200
            ${dragging ? "border-amber-500 bg-amber-500/5" : "border-neutral-700 hover:border-amber-500 bg-neutral-900"}
            ${file ? "border-green-500 bg-green-500/5" : ""}
          `}
        >
          {file ? (
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-green-400 font-medium text-sm">{file.name}</p>
              <p className="text-neutral-500 text-xs mt-1">
                {(file.size / 1024).toFixed(1)} KB — Click to change
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-3xl mb-2">📂</div>
              <p className="text-neutral-400 text-sm">
                Drag & drop or click to select
              </p>
              <p className="text-neutral-600 text-xs mt-1">
                .xlsx or .xls only
              </p>
            </div>
          )}
          <input
            id="excel-input"
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>

        {/* Upload Button */}
        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className="mt-4 w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-800 
                     disabled:text-neutral-600 text-neutral-950 font-bold tracking-widest 
                     rounded-xl transition-colors text-sm uppercase"
        >
          {loading ? "Uploading..." : "Upload & Import"}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-950 border border-red-800 rounded-xl text-red-400 text-sm">
            ✗ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-4 p-5 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
            <p className="text-green-400 font-bold text-sm tracking-wide">
              ✓ Upload Complete
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Stat
                label="Total Rows"
                value={result.total}
                color="text-stone-300"
              />
              <Stat
                label="Inserted"
                value={result.inserted}
                color="text-green-400"
              />
              <Stat
                label="Updated"
                value={result.updated}
                color="text-amber-400"
              />
              <Stat
                label="Skipped"
                value={result.skipped}
                color="text-neutral-500"
              />
            </div>

            {result.errors?.length > 0 && (
              <div className="mt-3 border-t border-neutral-800 pt-3">
                <p className="text-red-400 text-xs font-bold mb-2">
                  ⚠ {result.errors.length} row(s) failed:
                </p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {result.errors.map((e, i) => (
                    <p key={i} className="text-xs text-neutral-500">
                      <span className="text-red-400">{e.partNo}</span> —{" "}
                      {e.error}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
          <p className="text-xs text-amber-500 tracking-widest font-bold mb-3">
            INSTRUCTIONS
          </p>
          <ul className="space-y-1.5 text-xs text-neutral-500">
            <li>• First row must be the header row</li>
            <li>
              • <span className="text-neutral-400">partNo</span> is required —
              rows without it are skipped
            </li>
            <li>
              • Existing part numbers will be{" "}
              <span className="text-amber-400">updated</span>
            </li>
            <li>
              • New part numbers will be{" "}
              <span className="text-green-400">inserted</span>
            </li>
            <li>• Leave cells empty if data is not available</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="bg-neutral-950 rounded-lg p-3 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-neutral-600 mt-0.5">{label}</p>
    </div>
  );
}
