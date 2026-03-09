import { useEffect, useMemo, useState } from "react";
import ResumeTopNav from "../components/ResumeTopNav";
import ResumeDocument from "../components/ResumeDocument";
import ResumeTemplateTabs from "../components/ResumeTemplateTabs";
import TagInput from "../components/TagInput";
import {
  EMPTY_RESUME,
  SAMPLE_RESUME,
  calculateAtsV1,
  getAtsSuggestions,
  getBulletGuidance,
  getTopImprovements,
  loadColorChoice,
  loadResume,
  loadTemplateChoice,
  saveColorChoice,
  saveResume,
  saveTemplateChoice,
} from "../lib/resumeSkeleton";

function entryFieldLabels(section) {
  if (section === "education") return ["school", "degree", "period", "details"];
  if (section === "experience") return ["company", "role", "period", "details"];
  return ["name", "tech", "details"];
}

function nextEmptyEntry(section) {
  if (section === "education") return { school: "", degree: "", period: "", details: "" };
  if (section === "experience") return { company: "", role: "", period: "", details: "" };
  return { title: "", description: "", techStack: [], liveUrl: "", githubUrl: "" };
}

function ResumeBuilderPage() {
  const [resume, setResume] = useState(EMPTY_RESUME);
  const [template, setTemplate] = useState("Classic");
  const [accentColor, setAccentColor] = useState("hsl(168, 60%, 40%)");
  const [skillsOpen, setSkillsOpen] = useState(true);
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);
  const [openProjectIndexes, setOpenProjectIndexes] = useState([0]);

  useEffect(() => {
    setResume(loadResume());
    setTemplate(loadTemplateChoice());
    setAccentColor(loadColorChoice());
  }, []);

  useEffect(() => {
    saveResume(resume);
  }, [resume]);

  useEffect(() => {
    saveTemplateChoice(template);
  }, [template]);

  useEffect(() => {
    saveColorChoice(accentColor);
  }, [accentColor]);

  const previewData = useMemo(() => resume, [resume]);
  const ats = useMemo(() => calculateAtsV1(resume), [resume]);
  const suggestions = useMemo(() => getAtsSuggestions(ats.checks), [ats.checks]);
  const improvements = useMemo(() => getTopImprovements(ats.checks), [ats.checks]);

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

  const updateSkillCategory = (category, tags) => {
    setResume((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: tags,
      },
    }));
  };

  const mergeUnique = (base, incoming) => Array.from(new Set([...(base || []), ...incoming]));

  const suggestSkills = () => {
    if (isSuggestingSkills) return;
    setIsSuggestingSkills(true);
    setTimeout(() => {
      setResume((prev) => ({
        ...prev,
        skills: {
          technical: mergeUnique(prev.skills.technical, ["TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL"]),
          soft: mergeUnique(prev.skills.soft, ["Team Leadership", "Problem Solving"]),
          tools: mergeUnique(prev.skills.tools, ["Git", "Docker", "AWS"]),
        },
      }));
      setIsSuggestingSkills(false);
    }, 1000);
  };

  const addProject = () => {
    const nextIndex = resume.projects.length;
    addEntry("projects");
    setOpenProjectIndexes((prev) => Array.from(new Set([...prev, nextIndex])));
    setProjectsOpen(true);
  };

  const toggleProjectOpen = (index) => {
    setOpenProjectIndexes((prev) => (prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]));
  };

  const updateProjectField = (index, field, value) => {
    setResume((prev) => {
      const next = [...prev.projects];
      next[index] = {
        ...next[index],
        [field]: field === "description" ? value.slice(0, 200) : value,
      };
      return { ...prev, projects: next };
    });
  };

  const updateProjectTechStack = (index, tags) => {
    setResume((prev) => {
      const next = [...prev.projects];
      next[index] = { ...next[index], techStack: tags };
      return { ...prev, projects: next };
    });
  };

  const removeProject = (index) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, projectIndex) => projectIndex !== index),
    }));
    setOpenProjectIndexes((prev) => prev.filter((item) => item !== index).map((item) => (item > index ? item - 1 : item)));
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

            {["education", "experience"].map((section) => (
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
                        field === "details" ? (
                          <textarea
                            key={field}
                            rows={3}
                            value={entry[field]}
                            onChange={(e) => updateListField(section, index, field, e.target.value)}
                            placeholder={field}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-black sm:col-span-2"
                          />
                        ) : (
                          <input
                            key={field}
                            value={entry[field]}
                            onChange={(e) => updateListField(section, index, field, e.target.value)}
                            placeholder={field}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-black"
                          />
                        )
                      ))}
                    </div>
                    {section === "experience" && entry.details?.trim() ? (
                      <div className="mt-3 space-y-2">
                        {getBulletGuidance(entry.details).map((guide, i) => (
                          <div key={`${section}-${index}-guide-${i}`} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                            <p className="font-medium text-slate-800">{guide.bullet}</p>
                            {guide.needsActionVerb ? <p className="mt-1">Start with a strong action verb.</p> : null}
                            {guide.needsNumbers ? <p className="mt-1">Add measurable impact (numbers).</p> : null}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ))}

            <div className="rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setSkillsOpen((prev) => !prev)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <p className="text-sm font-semibold">Skills</p>
                <span className="text-xs text-slate-500">{skillsOpen ? "Hide" : "Show"}</span>
              </button>
              {skillsOpen ? (
                <div className="space-y-4 border-t border-slate-200 px-4 py-4">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={suggestSkills}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium transition hover:border-black"
                    >
                      {isSuggestingSkills ? "Suggesting..." : "✨ Suggest Skills"}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Technical Skills ({resume.skills.technical.length})</p>
                    <TagInput tags={resume.skills.technical} onChange={(tags) => updateSkillCategory("technical", tags)} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Soft Skills ({resume.skills.soft.length})</p>
                    <TagInput tags={resume.skills.soft} onChange={(tags) => updateSkillCategory("soft", tags)} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Tools & Technologies ({resume.skills.tools.length})</p>
                    <TagInput tags={resume.skills.tools} onChange={(tags) => updateSkillCategory("tools", tags)} />
                  </div>
                </div>
              ) : null}
            </div>

            <div className="rounded-xl border border-slate-200">
              <div className="flex items-center justify-between px-4 py-3">
                <button type="button" onClick={() => setProjectsOpen((prev) => !prev)} className="text-sm font-semibold">
                  Projects
                </button>
                <button
                  type="button"
                  onClick={addProject}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium transition hover:border-black"
                >
                  Add Project
                </button>
              </div>
              {projectsOpen ? (
                <div className="space-y-3 border-t border-slate-200 px-4 py-4">
                  {resume.projects.map((project, index) => {
                    const isOpen = openProjectIndexes.includes(index);
                    const headerTitle = project.title?.trim() || `Untitled Project ${index + 1}`;
                    return (
                      <div key={`project-${index}`} className="rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between px-3 py-2">
                          <button type="button" onClick={() => toggleProjectOpen(index)} className="text-sm font-medium">
                            {headerTitle}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeProject(index)}
                            className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:border-black"
                          >
                            Delete
                          </button>
                        </div>
                        {isOpen ? (
                          <div className="space-y-3 border-t border-slate-200 px-3 py-3">
                            <input
                              value={project.title}
                              onChange={(event) => updateProjectField(index, "title", event.target.value)}
                              placeholder="Project Title"
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-black"
                            />
                            <div>
                              <textarea
                                rows={3}
                                value={project.description}
                                onChange={(event) => updateProjectField(index, "description", event.target.value)}
                                placeholder="Description (max 200 chars)"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-black"
                              />
                              <p className="mt-1 text-right text-xs text-slate-500">{(project.description || "").length}/200</p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-slate-700">Tech Stack</p>
                              <TagInput tags={project.techStack || []} onChange={(tags) => updateProjectTechStack(index, tags)} />
                            </div>
                            <input
                              value={project.liveUrl || ""}
                              onChange={(event) => updateProjectField(index, "liveUrl", event.target.value)}
                              placeholder="Live URL (optional)"
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-black"
                            />
                            <input
                              value={project.githubUrl || ""}
                              onChange={(event) => updateProjectField(index, "githubUrl", event.target.value)}
                              placeholder="GitHub URL (optional)"
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-black"
                            />
                            {project.description?.trim() ? (
                              <div className="space-y-2">
                                {getBulletGuidance(project.description).map((guide, guideIndex) => (
                                  <div key={`project-guide-${index}-${guideIndex}`} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                                    <p className="font-medium text-slate-800">{guide.bullet}</p>
                                    {guide.needsActionVerb ? <p className="mt-1">Start with a strong action verb.</p> : null}
                                    {guide.needsNumbers ? <p className="mt-1">Add measurable impact (numbers).</p> : null}
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : null}
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
            <div className="mb-5">
              <ResumeTemplateTabs
                value={template}
                onChange={setTemplate}
                colorValue={accentColor}
                onColorChange={setAccentColor}
              />
            </div>
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

              <div className="mt-4 border-t border-slate-200 pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Top 3 Improvements</p>
                {improvements.length ? (
                  <ul className="mt-2 space-y-2 text-sm text-slate-700">
                    {improvements.map((item) => (
                      <li key={item} className="rounded-md border border-slate-200 bg-white px-3 py-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-slate-700">No critical improvements right now.</p>
                )}
              </div>
            </div>

            <h2 className="mb-4 text-lg font-semibold">Live Preview</h2>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
              <ResumeDocument data={previewData} template={template} accentColor={accentColor} />
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default ResumeBuilderPage;
