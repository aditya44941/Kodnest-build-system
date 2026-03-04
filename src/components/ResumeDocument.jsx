function hasValue(value) {
  return Boolean(value && String(value).trim());
}

function ResumeDocument({ data }) {
  const { personal, summary, education, experience, projects, skills, links } = data;
  const cleanEducation = (education || []).filter((item) => [item.school, item.degree, item.period, item.details].some(hasValue));
  const cleanExperience = (experience || []).filter((item) =>
    [item.company, item.role, item.period, item.details].some(hasValue),
  );
  const cleanProjects = (projects || []).filter((item) => [item.name, item.tech, item.details].some(hasValue));
  const cleanSkills = String(skills || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const cleanLinks = [
    { label: "GitHub", value: links.github },
    { label: "LinkedIn", value: links.linkedin },
  ].filter((item) => hasValue(item.value));
  const contactLine = [personal.email, personal.phone, personal.location].filter(hasValue).join("  |  ");

  return (
    <article className="mx-auto w-full max-w-3xl bg-white p-8 text-black [font-family:Georgia,'Times_New_Roman',serif] sm:p-12">
      <header className="border-b border-black pb-4">
        {hasValue(personal.name) ? <h1 className="text-3xl font-semibold tracking-tight">{personal.name}</h1> : null}
        {contactLine ? <p className="mt-1 text-sm">{contactLine}</p> : null}
      </header>

      {hasValue(summary) ? (
        <section className="mt-6">
          <h2 className="border-b border-black pb-1 text-xs font-semibold uppercase tracking-[0.2em]">Summary</h2>
          <p className="mt-2 text-sm leading-6">{summary}</p>
        </section>
      ) : null}

      {cleanEducation.length ? (
        <section className="mt-6">
          <h2 className="border-b border-black pb-1 text-xs font-semibold uppercase tracking-[0.2em]">Education</h2>
          <div className="mt-2 space-y-3">
            {cleanEducation.map((item, idx) => (
              <div key={`edu-${idx}`}>
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

      {cleanExperience.length ? (
        <section className="mt-6">
          <h2 className="border-b border-black pb-1 text-xs font-semibold uppercase tracking-[0.2em]">Experience</h2>
          <div className="mt-2 space-y-4">
            {cleanExperience.map((item, idx) => (
              <div key={`exp-${idx}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  {hasValue(item.role) ? <p className="text-sm font-semibold">{item.role}</p> : null}
                  {hasValue(item.period) ? <p className="text-xs">{item.period}</p> : null}
                </div>
                {hasValue(item.company) ? <p className="text-sm">{item.company}</p> : null}
                {hasValue(item.details) ? <p className="mt-1 text-sm leading-6 whitespace-pre-line">{item.details}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {cleanProjects.length ? (
        <section className="mt-6">
          <h2 className="border-b border-black pb-1 text-xs font-semibold uppercase tracking-[0.2em]">Projects</h2>
          <div className="mt-2 space-y-3">
            {cleanProjects.map((item, idx) => (
              <div key={`proj-${idx}`}>
                {hasValue(item.name) ? <p className="text-sm font-semibold">{item.name}</p> : null}
                {hasValue(item.tech) ? <p className="text-sm">{item.tech}</p> : null}
                {hasValue(item.details) ? <p className="mt-1 text-sm leading-6 whitespace-pre-line">{item.details}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {cleanSkills.length ? (
        <section className="mt-6">
          <h2 className="border-b border-black pb-1 text-xs font-semibold uppercase tracking-[0.2em]">Skills</h2>
          <p className="mt-2 text-sm leading-6">{cleanSkills.join(", ")}</p>
        </section>
      ) : null}

      {cleanLinks.length ? (
        <section className="mt-6">
          <h2 className="border-b border-black pb-1 text-xs font-semibold uppercase tracking-[0.2em]">Links</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {cleanLinks.map((item) => (
              <li key={item.label}>
                <span className="font-semibold">{item.label}:</span> {item.value}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}

export default ResumeDocument;
