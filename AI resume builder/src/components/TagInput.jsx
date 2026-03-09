import { useState } from "react";

function TagInput({ tags, onChange, placeholder = "Type and press Enter" }) {
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const clean = draft.trim();
    if (!clean) return;
    if (tags.includes(clean)) {
      setDraft("");
      return;
    }
    onChange([...tags, clean]);
    setDraft("");
  };

  return (
    <div className="rounded-lg border border-slate-300 px-3 py-2">
      <div className="mb-2 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs">
            {tag}
            <button
              type="button"
              onClick={() => onChange(tags.filter((entry) => entry !== tag))}
              className="text-slate-600 hover:text-black"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            addTag();
          }
        }}
        placeholder={placeholder}
        className="w-full text-sm outline-none"
      />
    </div>
  );
}

export default TagInput;
