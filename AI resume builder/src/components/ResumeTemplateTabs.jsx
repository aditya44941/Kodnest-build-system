import { Check } from "lucide-react";
import { RESUME_COLOR_THEMES, RESUME_TEMPLATES } from "../lib/resumeSkeleton";

function Thumbnail({ template }) {
  if (template === "Modern") {
    return (
      <div className="h-20 w-full overflow-hidden rounded-md border border-slate-300 bg-white">
        <div className="flex h-full">
          <div className="w-1/3 bg-slate-400" />
          <div className="w-2/3 p-2">
            <div className="h-2 w-2/3 bg-slate-300" />
            <div className="mt-2 h-1.5 w-full bg-slate-200" />
            <div className="mt-1 h-1.5 w-5/6 bg-slate-200" />
            <div className="mt-1 h-1.5 w-4/6 bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (template === "Minimal") {
    return (
      <div className="h-20 w-full rounded-md border border-slate-300 bg-white p-2">
        <div className="h-2 w-2/3 bg-slate-300" />
        <div className="mt-3 h-1.5 w-full bg-slate-200" />
        <div className="mt-2 h-1.5 w-11/12 bg-slate-200" />
        <div className="mt-2 h-1.5 w-10/12 bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="h-20 w-full rounded-md border border-slate-300 bg-white p-2">
      <div className="h-2 w-2/3 bg-slate-300" />
      <div className="mt-2 border-t border-slate-300" />
      <div className="mt-2 h-1.5 w-full bg-slate-200" />
      <div className="mt-1 h-1.5 w-5/6 bg-slate-200" />
      <div className="mt-2 border-t border-slate-300" />
      <div className="mt-2 h-1.5 w-4/6 bg-slate-200" />
    </div>
  );
}

function ResumeTemplateTabs({ value, onChange, colorValue, onColorChange }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3" role="tablist" aria-label="Resume template">
        {RESUME_TEMPLATES.map((template) => (
          <button
            key={template}
            type="button"
            role="tab"
            aria-selected={value === template}
            onClick={() => onChange(template)}
            className={`relative w-[120px] rounded-xl border-2 p-2 text-left transition ${
              value === template ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <Thumbnail template={template} />
            <p className="mt-2 text-xs font-semibold text-slate-800">{template}</p>
            {value === template ? (
              <span className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                <Check size={12} />
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {RESUME_COLOR_THEMES.map((color) => (
          <button
            key={color.name}
            type="button"
            onClick={() => onColorChange(color.value)}
            aria-label={color.name}
            title={color.name}
            className={`h-7 w-7 rounded-full border-2 transition ${
              colorValue === color.value ? "border-blue-500" : "border-slate-300"
            }`}
            style={{ backgroundColor: color.value }}
          />
        ))}
      </div>
    </div>
  );
}

export default ResumeTemplateTabs;
