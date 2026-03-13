import { useState } from "react";
import { API_URL, BASE_URL } from "../../constants/api";

export default function UploadExcel({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);

  // Location upload state
  const [locFile, setLocFile] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [locResult, setLocResult] = useState(null);
  const [locError, setLocError] = useState(null);

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

      const res = await fetch(`https://center-kitchen-backend.onrender.com/upload/catalog`, {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
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

  const handleLocUpload = async () => {
    if (!locFile) return;
    setLocLoading(true);
    setLocError(null);
    setLocResult(null);

    try {
      const formData = new FormData();
      formData.append("file", locFile);

      const res = await fetch(`${API_URL}/upload-location`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setLocResult(data);
      setLocFile(null);
    } catch (err) {
      setLocError(err.message);
    } finally {
      setLocLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-stone-200 p-8">
      <div className="max-w-xl mx-auto">

        {/* ── CATALOG UPLOAD ── */}
        <div className="mb-8">
          <p className="text-amber-500 text-xs tracking-widest mb-1">PRODUCT PORTAL</p>
          <h1 className="text-3xl font-bold tracking-wide text-stone-100">Upload Excel</h1>
          <p className="text-neutral-500 text-sm mt-2">
            Upload your catalog template to bulk import or update products.
          </p>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
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
              <p className="text-neutral-500 text-xs mt-1">{(file.size / 1024).toFixed(1)} KB — Click to change</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-3xl mb-2">📂</div>
              <p className="text-neutral-400 text-sm">Drag & drop or click to select</p>
              <p className="text-neutral-600 text-xs mt-1">.xlsx or .xls only</p>
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

        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className="mt-4 w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-800
                     disabled:text-neutral-600 text-neutral-950 font-bold tracking-widest
                     rounded-xl transition-colors text-sm uppercase"
        >
          {loading ? "Uploading..." : "Upload & Import"}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-950 border border-red-800 rounded-xl text-red-400 text-sm">
            ✗ {error}
          </div>
        )}

        {result && (
          <div className="mt-4 p-5 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
            <p className="text-green-400 font-bold text-sm tracking-wide">✓ Upload Complete</p>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Total Rows" value={result.total}    color="text-stone-300" />
              <Stat label="Inserted"   value={result.inserted} color="text-green-400" />
              <Stat label="Updated"    value={result.updated}  color="text-amber-400" />
              <Stat label="Skipped"    value={result.skipped}  color="text-neutral-500" />
            </div>
            {result.errors?.length > 0 && (
              <div className="mt-3 border-t border-neutral-800 pt-3">
                <p className="text-red-400 text-xs font-bold mb-2">⚠ {result.errors.length} row(s) failed:</p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {result.errors.map((e, i) => (
                    <p key={i} className="text-xs text-neutral-500">
                      <span className="text-red-400">{e.partNo}</span> — {e.error}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── LOCATION UPLOAD ── */}
        <div className="mt-10 mb-4">
          <p className="text-amber-500 text-xs tracking-widest mb-1">UPDATE LOCATIONS</p>
          <h2 className="text-xl font-bold text-stone-100">Upload Locations</h2>
          <p className="text-neutral-500 text-sm mt-1">
            Upload an Excel file with <span className="text-stone-400 font-mono">Part no.</span> and <span className="text-stone-400 font-mono">Location</span> columns to bulk update locations.
          </p>
        </div>

        <div
          onClick={() => document.getElementById("loc-input").click()}
          className={`
            w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center
            cursor-pointer transition-all duration-200
            ${locFile ? "border-green-500 bg-green-500/5" : "border-neutral-700 hover:border-amber-500 bg-neutral-900"}
          `}
        >
          {locFile ? (
            <div className="text-center">
              <p className="text-green-400 font-medium text-sm">{locFile.name}</p>
              <p className="text-neutral-500 text-xs mt-1">{(locFile.size / 1024).toFixed(1)} KB — Click to change</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-neutral-400 text-sm">Click to select file</p>
              <p className="text-neutral-600 text-xs mt-1">.xlsx or .xls only</p>
            </div>
          )}
          <input
            id="loc-input"
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => { setLocFile(e.target.files[0]); setLocResult(null); setLocError(null); }}
          />
        </div>

        <button
          onClick={handleLocUpload}
          disabled={!locFile || locLoading}
          className="mt-4 w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-800
                     disabled:text-neutral-600 text-neutral-950 font-bold tracking-widest
                     rounded-xl transition-colors text-sm uppercase"
        >
          {locLoading ? "Updating..." : "Upload Locations"}
        </button>

        {locError && (
          <div className="mt-4 p-4 bg-red-950 border border-red-800 rounded-xl text-red-400 text-sm">
            ✗ {locError}
          </div>
        )}

        {locResult && (
          <div className="mt-4 p-5 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
            <p className="text-green-400 font-bold text-sm tracking-wide">✓ Locations Updated</p>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Updated"   value={locResult.updated}  color="text-green-400" />
              <Stat label="Not Found" value={locResult.notFound} color="text-neutral-500" />
            </div>
            {locResult.errors?.length > 0 && (
              <div className="mt-3 border-t border-neutral-800 pt-3">
                <p className="text-red-400 text-xs font-bold mb-2">⚠ {locResult.errors.length} error(s):</p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {locResult.errors.map((e, i) => (
                    <p key={i} className="text-xs text-red-400">{e}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
          <p className="text-xs text-amber-500 tracking-widest font-bold mb-3">INSTRUCTIONS</p>
          <ul className="space-y-1.5 text-xs text-neutral-500">
            <li>• First row must be the header row</li>
            <li>• <span className="text-neutral-400">partNo</span> is required — rows without it are skipped</li>
            <li>• Existing part numbers will be <span className="text-amber-400">updated</span></li>
            <li>• New part numbers will be <span className="text-green-400">inserted</span></li>
            <li>• Leave cells empty if data is not available</li>
          </ul>
        </div>

        {/* Required Format */}
        <div className="mt-4 mb-8 p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
          <p className="text-xs text-amber-500 tracking-widest font-bold mb-3">REQUIRED FORMAT</p>
          <p className="text-xs text-neutral-500 mb-3">First row must use these exact column names:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-2 pr-4 text-amber-400 font-medium">Column</th>
                  <th className="text-left py-2 pr-4 text-neutral-400 font-medium">Type</th>
                  <th className="text-left py-2 text-neutral-400 font-medium">Example</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["partNo",           "text *",  "TG949046-2600"],
                  ["name",             "text",    "Hex Bolt"],
                  ["customer",         "text",    "AAA"],
                  ["supplier",         "text",    "FRJ"],
                  ["category",         "text",    "Fastener"],
                  ["type",             "text",    "Bolt"],
                  ["volumePerMonth",   "number",  "800"],
                  ["qtyPerBox",        "number",  "100"],
                  ["location",         "text",    "A1-02"],
                  ["material",         "text",    "SWCH12A"],
                  ["heatTreatment",    "text",    "QT (HRC44-53)"],
                  ["surfaceTreatment", "text",    "Zinc Plating"],
                  ["headType",         "text",    "Hex"],
                  ["driveType",        "text",    "Phillips"],
                  ["threadSize",       "text",    "M6 x 1.0"],
                  ["length",           "number",  "40"],
                  ["outerDiameter",    "text",    "Ø12"],
                  ["innerDiameter",    "text",    "Ø6"],
                  ["thickness",        "number",  "1.5"],
                  ["standard",         "text",    "ISO"],
                  ["grade",            "text",    "8.8"],
                  ["note",             "text",    "any extra info"],
                ].map(([col, type, example]) => (
                  <tr key={col} className="border-b border-neutral-800/50">
                    <td className="py-1.5 pr-4">
                      <span className={`font-mono ${col === "partNo" ? "text-amber-400" : "text-stone-400"}`}>
                        {col}
                      </span>
                      {col === "partNo" && <span className="text-red-400 ml-1">*</span>}
                    </td>
                    <td className="py-1.5 pr-4 text-neutral-600">{type}</td>
                    <td className="py-1.5 text-neutral-600">{example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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