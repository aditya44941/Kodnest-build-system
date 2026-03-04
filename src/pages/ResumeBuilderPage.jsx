import { useEffect, useMemo, useState } from "react";
import ResumeTopNav from "../components/ResumeTopNav";
import ResumeDocument from "../components/ResumeDocument";
import { EMPTY_RESUME, SAMPLE_RESUME, calculateAtsV1, getAtsSuggestions, loadResume, saveResume } from "../lib/resumeSkeleton";

function entryFieldLabels(section) {
  if (section === "education") return ["school", "degree", "period", "details"];
  if (section === "experience") return ["company", "role", "period", "details"];
  return ["name", "tech", "details"];
}

function nextEmptyEntry(section) {
  if (section === "education") return { school: "", degree: "", period: "", details: "" };
  if (section === "experience") return { company: "", role: "", period: "", details: "" };
  return { name: "", tech: "", details: "" };
}

function ResumeBuilderPage() {
  const [resume, setResume] = useState(EMPTY_RESUME);

  useEffect(() => {
    setResume(loadResume());
  }, []);

  useEffect(() => {
    saveResume(resume);
  }, [resume]);

  const previewData = useMemo(() => resume, [resume]);
  const ats = useMemo(() => calculateAtsV1(resume), [resume]);
  const suggestions = useMemo(() => getAtsSuggestions(ats.checks), [ats.checks]);

  const updatePersonal = (field, value) => {
    setResume((prev) => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  };

  const updateLinks = (field, value) => {
    setResume((prev) => ({ ...prev, links: { ...prev.links, [field]: value } }));
  };

  const updateListField = (section, index, field, value) => {
    setResume((prev) => {
      const next = [...prev[section]];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, [section]: next };
    });
  };

  const addEntry = (section) => {
    setResume((prev) => ({ ...prev, [section]: [...prev[section], nextEmptyEntry(section)] }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <ResumeTopNav />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Builder</h1>
          <button
            type="button"
            onClick={() => setResume(SAMPLE_RESUME)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-black"
          >
            Load Sample Data
          </button>
        </div>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold">Form Sections</h2>

            <div className="space-y-2">
              <p className="text-sm font-semibold">Personal Info</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  value={resume.personal.name}
                  onChange={(e) => updatePersonal("name", e.target.value)}
                  placeholder="name"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-black"
                />
                <input
                  value={resume.personal.email}
                  onChange={(e) => updatePersonal("email", e.target.value)}
                  placeholder="email"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-black"
                />
                <input
                  value={resume.personal.phone}
                  onChange={(e) => updatePersonal("phone", e.target.value)}
                  placeholder="phone"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-black"
                />
                <input
                  value={resume.personal.location}
                  onChange={(e) => updatePersonal("location", e.target.value)}
                  placeholder="location"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold">Summary</p>
              <textarea
                rows={4}
                value={resume.summary}
                onChange={(e) => setResume((prev) => ({ ...prev, summary: e.target.value }))}
                placeholder="Professional summary"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
            </div>

            {["education", "experience", "projects"].map((section) => (
              <div key={section} className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold capitalize">{section}</p>
                  <button
                    type="button"
                    onClick={() => addEntry(section)}
                    className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium hover:border-black"
                  >
                    Add {section.slice(0, -1)}
                  </button>
                </div>
                {resume[section].map((entry, index) => (
                  <div key={`${section}-${index}`} className="rounded-lg border border-slate-200 p-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      {entryFieldLabels(section).map((field) => (
                        <input
                          key={field}
                          value={entry[field]}
                          onChange={(e) => updateListField(section, index, field, e.target.value)}
                          placeholder={field}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-black"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <div className="space-y-2">
              <p className="text-sm font-semibold">Skills</p>
              <input
                value={resume.skills}
                onChange={(e) => setResume((prev) => ({ ...prev, skills: e.target.value }))}
                placeholder="comma-separated skills"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold">Links</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  value={resume.links.github}
                  onChange={(e) => updateLinks("github", e.target.value)}
                  placeholder="GitHub"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-black"
                />
                <input
                  value={resume.links.linkedin}
                  onChange={(e) => updateLinks("linkedin", e.target.value)}
                  placeholder="LinkedIn"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">ATS Readiness Score</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{ats.score}</p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-slate-900 transition-all duration-300"
                  style={{ width: `${ats.score}%` }}
                  role="meter"
                  aria-label="ATS Readiness Score"
                  aria-valuenow={ats.score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              {suggestions.length ? (
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {suggestions.map((suggestion) => (
                    <li key={suggestion} className="rounded-md border border-slate-200 bg-white px-3 py-2">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-slate-700">Core ATS v1 signals are covered.</p>
              )}
            </div>

            <h2 className="mb-4 text-lg font-semibold">Live Preview</h2>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
              <ResumeDocument data={previewData} />
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default ResumeBuilderPage;
