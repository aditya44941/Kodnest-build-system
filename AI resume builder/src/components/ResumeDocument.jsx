import { ExternalLink, Github } from "lucide-react";

function hasValue(value) {
  return Boolean(value && String(value).trim());
}

function normalizeData(data) {
  const { personal, summary, education, experience, projects, skills, links } = data;
  const cleanEducation = (education || []).filter((item) => [item.school, item.degree, item.period, item.details].some(hasValue));
  const cleanExperience = (experience || []).filter((item) => [item.company, item.role, item.period, item.details].some(hasValue));
  const cleanProjects = (projects || [])
    .map((item) => ({
      title: item.title || item.name || "",
      description: item.description || item.details || "",
      techStack: Array.isArray(item.techStack)
        ? item.techStack.filter(hasValue)
        : String(item.tech || "")
            .split(",")
            .map((entry) => entry.trim())
            .filter(Boolean),
      liveUrl: item.liveUrl || "",
      githubUrl: item.githubUrl || "",
    }))
    .filter((item) => [item.title, item.description, item.liveUrl, item.githubUrl, ...item.techStack].some(hasValue));

  const cleanSkills =
    typeof skills === "string"
      ? { technical: skills.split(",").map((item) => item.trim()).filter(Boolean), soft: [], tools: [] }
      : {
          technical: (skills?.technical || []).filter(hasValue),
          soft: (skills?.soft || []).filter(hasValue),
          tools: (skills?.tools || []).filter(hasValue),
        };

  const cleanLinks = [
    { label: "GitHub", value: links.github },
    { label: "LinkedIn", value: links.linkedin },
  ].filter((item) => hasValue(item.value));

  return {
    personal,
    summary,
    cleanEducation,
    cleanExperience,
    cleanProjects,
    cleanSkills,
    cleanLinks,
    contactLine: [personal.email, personal.phone, personal.location].filter(hasValue).join("  |  "),
  };
}

function SectionTitle({ title, color, withRule = false }) {
  if (withRule) {
    return (
      <h2 className="border-b pb-1 text-xs font-semibold uppercase tracking-[0.2em]" style={{ borderColor: color, color }}>
        {title}
      </h2>
    );
  }
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color }}>
      {title}
    </h2>
  );
}

function SkillsGrouped({ data }) {
  if (!data.cleanSkills.technical.length && !data.cleanSkills.soft.length && !data.cleanSkills.tools.length) return null;
  return (
    <div className="space-y-3">
      {data.cleanSkills.technical.length ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/70">Technical Skills</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {data.cleanSkills.technical.map((tag) => (
              <span key={`tech-${tag}`} className="rounded-full border border-black/20 px-2 py-0.5 text-xs">{tag}</span>
            ))}
          </div>
        </div>
      ) : null}
      {data.cleanSkills.soft.length ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/70">Soft Skills</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {data.cleanSkills.soft.map((tag) => (
              <span key={`soft-${tag}`} className="rounded-full border border-black/20 px-2 py-0.5 text-xs">{tag}</span>
            ))}
          </div>
        </div>
      ) : null}
      {data.cleanSkills.tools.length ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/70">Tools & Technologies</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {data.cleanSkills.tools.map((tag) => (
              <span key={`tools-${tag}`} className="rounded-full border border-black/20 px-2 py-0.5 text-xs">{tag}</span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ProjectsCards({ data }) {
  if (!data.cleanProjects.length) return null;
  return (
    <div className="grid gap-3">
      {data.cleanProjects.map((item, idx) => (
        <div key={`proj-${idx}`} className="rounded-lg border border-black/20 p-3 [break-inside:avoid]">
          {hasValue(item.title) ? <p className="text-sm font-semibold">{item.title}</p> : null}
          {hasValue(item.description) ? <p className="mt-1 break-words text-sm leading-6 whitespace-pre-line">{item.description}</p> : null}
          {item.techStack.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {item.techStack.map((tag) => (
                <span key={`${item.title}-${tag}`} className="rounded-full border border-black/20 px-2 py-0.5 text-xs">{tag}</span>
              ))}
            </div>
          ) : null}
          {item.liveUrl || item.githubUrl ? (
            <div className="mt-2 flex items-center gap-3">
              {item.liveUrl ? <span className="inline-flex items-center gap-1 text-xs"><ExternalLink size={12} /> {item.liveUrl}</span> : null}
              {item.githubUrl ? <span className="inline-flex items-center gap-1 text-xs"><Github size={12} /> {item.githubUrl}</span> : null}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function ResumeDocument({ data, template = "Classic", accentColor = "hsl(168, 60%, 40%)" }) {
  const d = normalizeData(data);

  if (template === "Modern") {
    return (
      <article className="resume-print mx-auto w-full max-w-3xl overflow-hidden bg-white text-black [font-family:'Helvetica_Neue',Helvetica,Arial,sans-serif]">
        <div className="grid md:grid-cols-[0.36fr_0.64fr]">
          <aside className="space-y-5 px-5 py-6 text-white" style={{ backgroundColor: accentColor }}>
            {hasValue(d.personal.name) ? <h1 className="text-2xl font-semibold tracking-tight">{d.personal.name}</h1> : null}
            {d.contactLine ? <p className="text-xs leading-5 text-white/90">{d.contactLine}</p> : null}
            {d.cleanLinks.length ? (
              <div className="space-y-1 text-xs text-white/90">
                {d.cleanLinks.map((item) => (
                  <p key={item.label}><span className="font-semibold">{item.label}:</span> {item.value}</p>
                ))}
              </div>
            ) : null}
            <section className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">Skills</h2>
              <div className="space-y-1 text-xs text-white/90">
                {d.cleanSkills.technical.length ? <p>Technical: {d.cleanSkills.technical.join(", ")}</p> : null}
                {d.cleanSkills.soft.length ? <p>Soft: {d.cleanSkills.soft.join(", ")}</p> : null}
                {d.cleanSkills.tools.length ? <p>Tools: {d.cleanSkills.tools.join(", ")}</p> : null}
              </div>
            </section>
          </aside>
          <main className="space-y-6 px-6 py-6">
            {hasValue(d.summary) ? (
              <section className="space-y-2 [break-inside:avoid]">
                <SectionTitle title="Summary" color={accentColor} />
                <p className="text-sm leading-6">{d.summary}</p>
              </section>
            ) : null}
            {d.cleanExperience.length ? (
              <section className="space-y-2 [break-inside:avoid]">
                <SectionTitle title="Experience" color={accentColor} />
                <div className="space-y-3">
                  {d.cleanExperience.map((item, idx) => (
                    <div key={`exp-${idx}`} className="[break-inside:avoid]">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        {hasValue(item.role) ? <p className="text-sm font-semibold">{item.role}</p> : null}
                        {hasValue(item.period) ? <p className="text-xs">{item.period}</p> : null}
                      </div>
                      {hasValue(item.company) ? <p className="text-sm">{item.company}</p> : null}
                      {hasValue(item.details) ? <p className="mt-1 break-words text-sm leading-6 whitespace-pre-line">{item.details}</p> : null}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
            {d.cleanProjects.length ? <section className="space-y-2 [break-inside:avoid]"><SectionTitle title="Projects" color={accentColor} /><ProjectsCards data={d} /></section> : null}
            {d.cleanEducation.length ? (
              <section className="space-y-2 [break-inside:avoid]">
                <SectionTitle title="Education" color={accentColor} />
                <div className="space-y-3">
                  {d.cleanEducation.map((item, idx) => (
                    <div key={`edu-${idx}`} className="[break-inside:avoid]">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-sm font-semibold">{item.school}</p>
                        {hasValue(item.period) ? <p className="text-xs">{item.period}</p> : null}
                      </div>
                      {hasValue(item.degree) ? <p className="text-sm">{item.degree}</p> : null}
                      {hasValue(item.details) ? <p className="mt-1 text-sm leading-6">{item.details}</p> : null}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </main>
        </div>
      </article>
    );
  }

  if (template === "Minimal") {
    return (
      <article className="resume-print mx-auto w-full max-w-3xl bg-white px-10 py-12 text-black [font-family:Arial,'Helvetica_Neue',sans-serif] sm:px-14 sm:py-16">
        <header className="space-y-1 [break-inside:avoid]">
          {hasValue(d.personal.name) ? <h1 className="text-3xl font-semibold tracking-tight">{d.personal.name}</h1> : null}
          {d.contactLine ? <p className="text-sm">{d.contactLine}</p> : null}
        </header>
        <div className="mt-10 space-y-10">
          {hasValue(d.summary) ? <section className="space-y-3 [break-inside:avoid]"><SectionTitle title="Summary" color={accentColor} /><p className="text-sm leading-7">{d.summary}</p></section> : null}
          {d.cleanProjects.length ? <section className="space-y-3 [break-inside:avoid]"><SectionTitle title="Projects" color={accentColor} /><ProjectsCards data={d} /></section> : null}
          {d.cleanSkills.technical.length || d.cleanSkills.soft.length || d.cleanSkills.tools.length ? <section className="space-y-3 [break-inside:avoid]"><SectionTitle title="Skills" color={accentColor} /><SkillsGrouped data={d} /></section> : null}
          {d.cleanExperience.length ? (
            <section className="space-y-3 [break-inside:avoid]"><SectionTitle title="Experience" color={accentColor} />
              <div className="space-y-4">{d.cleanExperience.map((item, idx) => (<div key={`exp-${idx}`} className="[break-inside:avoid]"><div className="flex flex-wrap items-baseline justify-between gap-2">{hasValue(item.role) ? <p className="text-sm font-semibold">{item.role}</p> : null}{hasValue(item.period) ? <p className="text-xs">{item.period}</p> : null}</div>{hasValue(item.company) ? <p className="text-sm">{item.company}</p> : null}{hasValue(item.details) ? <p className="mt-1 break-words text-sm leading-7 whitespace-pre-line">{item.details}</p> : null}</div>))}</div>
            </section>
          ) : null}
          {d.cleanEducation.length ? (
            <section className="space-y-3 [break-inside:avoid]"><SectionTitle title="Education" color={accentColor} />
              <div className="space-y-4">{d.cleanEducation.map((item, idx) => (<div key={`edu-${idx}`} className="[break-inside:avoid]"><div className="flex flex-wrap items-baseline justify-between gap-2"><p className="text-sm font-semibold">{item.school}</p>{hasValue(item.period) ? <p className="text-xs">{item.period}</p> : null}</div>{hasValue(item.degree) ? <p className="text-sm">{item.degree}</p> : null}{hasValue(item.details) ? <p className="mt-1 text-sm leading-7">{item.details}</p> : null}</div>))}</div>
            </section>
          ) : null}
          {d.cleanLinks.length ? <section className="space-y-3 [break-inside:avoid]"><SectionTitle title="Links" color={accentColor} /><ul className="space-y-1 text-sm">{d.cleanLinks.map((item) => (<li key={item.label}><span className="font-semibold">{item.label}:</span> {item.value}</li>))}</ul></section> : null}
        </div>
      </article>
    );
  }

  return (
    <article className="resume-print mx-auto w-full max-w-3xl bg-white p-8 text-black [font-family:Georgia,'Times_New_Roman',serif] sm:p-12">
      <header className="border-b pb-4 [break-inside:avoid]" style={{ borderColor: accentColor }}>
        {hasValue(d.personal.name) ? <h1 className="text-3xl font-semibold tracking-tight" style={{ color: accentColor }}>{d.personal.name}</h1> : null}
        {d.contactLine ? <p className="mt-1 text-sm">{d.contactLine}</p> : null}
      </header>
      <div className="mt-6 space-y-6">
        {hasValue(d.summary) ? <section className="space-y-2 [break-inside:avoid]"><SectionTitle title="Summary" color={accentColor} withRule /><p className="text-sm leading-6">{d.summary}</p></section> : null}
        {d.cleanEducation.length ? <section className="space-y-2 [break-inside:avoid]"><SectionTitle title="Education" color={accentColor} withRule /><div className="space-y-3">{d.cleanEducation.map((item, idx) => (<div key={`edu-${idx}`} className="[break-inside:avoid]"><div className="flex flex-wrap items-baseline justify-between gap-2"><p className="text-sm font-semibold">{item.school}</p>{hasValue(item.period) ? <p className="text-xs">{item.period}</p> : null}</div>{hasValue(item.degree) ? <p className="text-sm">{item.degree}</p> : null}{hasValue(item.details) ? <p className="mt-1 text-sm leading-6">{item.details}</p> : null}</div>))}</div></section> : null}
        {d.cleanExperience.length ? <section className="space-y-2 [break-inside:avoid]"><SectionTitle title="Experience" color={accentColor} withRule /><div className="space-y-4">{d.cleanExperience.map((item, idx) => (<div key={`exp-${idx}`} className="[break-inside:avoid]"><div className="flex flex-wrap items-baseline justify-between gap-2">{hasValue(item.role) ? <p className="text-sm font-semibold">{item.role}</p> : null}{hasValue(item.period) ? <p className="text-xs">{item.period}</p> : null}</div>{hasValue(item.company) ? <p className="text-sm">{item.company}</p> : null}{hasValue(item.details) ? <p className="mt-1 break-words text-sm leading-6 whitespace-pre-line">{item.details}</p> : null}</div>))}</div></section> : null}
        {d.cleanProjects.length ? <section className="space-y-2 [break-inside:avoid]"><SectionTitle title="Projects" color={accentColor} withRule /><ProjectsCards data={d} /></section> : null}
        {d.cleanSkills.technical.length || d.cleanSkills.soft.length || d.cleanSkills.tools.length ? <section className="space-y-2 [break-inside:avoid]"><SectionTitle title="Skills" color={accentColor} withRule /><SkillsGrouped data={d} /></section> : null}
        {d.cleanLinks.length ? <section className="space-y-2 [break-inside:avoid]"><SectionTitle title="Links" color={accentColor} withRule /><ul className="space-y-1 text-sm">{d.cleanLinks.map((item) => (<li key={item.label}><span className="font-semibold">{item.label}:</span> {item.value}</li>))}</ul></section> : null}
      </div>
    </article>
  );
}

export default ResumeDocument;
