export default function Field({ label, name, value, onChange, type = "text", required, placeholder }) {
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
        className="bg-neutral-800 border border-neutral-700 focus:border-amber-500 focus:outline-none rounded-lg px-4 py-2 text-stone-100 text-sm transition-colors placeholder:text-neutral-600"
      />
    </div>
  );
}