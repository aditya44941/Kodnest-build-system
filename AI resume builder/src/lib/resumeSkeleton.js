export const RESUME_STORAGE_KEY = "resumeBuilderData";
const LEGACY_RESUME_STORAGE_KEY = "ai_resume_builder_skeleton_v1";
export const RESUME_TEMPLATE_KEY = "resumeBuilderTemplate";
export const RESUME_TEMPLATES = ["Classic", "Modern", "Minimal"];
export const RESUME_COLOR_KEY = "resumeBuilderColor";
export const RESUME_COLOR_THEMES = [
  { name: "Teal", value: "hsl(168, 60%, 40%)" },
  { name: "Navy", value: "hsl(220, 60%, 35%)" },
  { name: "Burgundy", value: "hsl(345, 60%, 35%)" },
  { name: "Forest", value: "hsl(150, 50%, 30%)" },
  { name: "Charcoal", value: "hsl(0, 0%, 25%)" },
];

export const EMPTY_RESUME = {
  personal: {
    name: "",
    email: "",
    phone: "",
    location: "",
  },
  summary: "",
  education: [{ school: "", degree: "", period: "", details: "" }],
  experience: [{ company: "", role: "", period: "", details: "" }],
  projects: [{ title: "", description: "", techStack: [], liveUrl: "", githubUrl: "" }],
  skills: {
    technical: [],
    soft: [],
    tools: [],
  },
  links: {
    github: "",
    linkedin: "",
  },
};

export const SAMPLE_RESUME = {
  personal: {
    name: "Aarav Sharma",
    email: "aarav.sharma@email.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, India",
  },
  summary:
    "Frontend-focused software engineer building clean, performance-oriented web interfaces with strong product sense.",
  education: [
    {
      school: "National Institute of Technology",
      degree: "B.Tech, Computer Science",
      period: "2019 - 2023",
      details: "Graduated with distinction; coursework in systems, databases, and HCI.",
    },
  ],
  experience: [
    {
      company: "Nova Labs",
      role: "Software Engineer",
      period: "2023 - Present",
      details:
        "Built internal tooling and customer-facing dashboards; improved page performance and release velocity.",
    },
  ],
  projects: [
    {
      title: "Candidate Tracker",
      techStack: ["React", "Node.js", "PostgreSQL"],
      description: "Created a pipeline tracker for hiring workflows with role-based access and reporting.",
      liveUrl: "",
      githubUrl: "https://github.com/aarav-sharma/candidate-tracker",
    },
  ],
  skills: {
    technical: ["JavaScript", "React", "Node.js", "SQL", "REST APIs"],
    soft: ["Communication"],
    tools: ["Git"],
  },
  links: {
    github: "https://github.com/aarav-sharma",
    linkedin: "https://linkedin.com/in/aarav-sharma",
  },
};

export function loadResume() {
  try {
    const raw = localStorage.getItem(RESUME_STORAGE_KEY) || localStorage.getItem(LEGACY_RESUME_STORAGE_KEY);
    if (!raw) return EMPTY_RESUME;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return EMPTY_RESUME;
    return {
      ...EMPTY_RESUME,
      ...parsed,
      personal: { ...EMPTY_RESUME.personal, ...(parsed.personal || {}) },
      links: { ...EMPTY_RESUME.links, ...(parsed.links || {}) },
      education: Array.isArray(parsed.education) && parsed.education.length ? parsed.education : EMPTY_RESUME.education,
      experience: Array.isArray(parsed.experience) && parsed.experience.length ? parsed.experience : EMPTY_RESUME.experience,
      projects: normalizeProjects(parsed.projects),
      skills: normalizeSkills(parsed.skills),
    };
  } catch {
    return EMPTY_RESUME;
  }
}

export function saveResume(resume) {
  localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resume));
}

function hasText(value) {
  return Boolean(value && String(value).trim());
}

function normalizeSkills(skills) {
  if (typeof skills === "string") {
    const list = skills
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    return { technical: list, soft: [], tools: [] };
  }
  if (!skills || typeof skills !== "object") return EMPTY_RESUME.skills;
  return {
    technical: Array.isArray(skills.technical) ? skills.technical.filter(hasText) : [],
    soft: Array.isArray(skills.soft) ? skills.soft.filter(hasText) : [],
    tools: Array.isArray(skills.tools) ? skills.tools.filter(hasText) : [],
  };
}

function normalizeProjects(projects) {
  if (!Array.isArray(projects) || !projects.length) return EMPTY_RESUME.projects;
  return projects.map((project) => ({
    title: project.title || project.name || "",
    description: project.description || project.details || "",
    techStack: Array.isArray(project.techStack)
      ? project.techStack.filter(hasText)
      : String(project.tech || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
    liveUrl: project.liveUrl || "",
    githubUrl: project.githubUrl || "",
  }));
}

function countWords(text) {
  const words = String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return words.length;
}

function startsWithActionVerb(line) {
  return /^(built|developed|designed|implemented|led|improved|created|optimized|automated)\b/i.test(line);
}

function nonEmptyEntries(entries, fields) {
  return (entries || []).filter((entry) => fields.some((field) => hasText(entry?.[field])));
}

function hasCompleteEducation(data) {
  return (data.education || []).some(
    (item) => hasText(item.school) && hasText(item.degree) && hasText(item.period) && hasText(item.details),
  );
}

function hasMeasuredImpact(data) {
  const expDetails = (data.experience || []).map((item) => item.details || "");
  const projDetails = (data.projects || []).map((item) => item.description || item.details || "");
  const impactText = [...expDetails, ...projDetails].join(" ");
  return /\b\d+(?:[.,]\d+)?\s*(?:%|x|k|m|K|M)?\b/.test(impactText);
}

function skillCount(data) {
  if (typeof data.skills === "string") {
    return data.skills
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean).length;
  }
  const technical = Array.isArray(data.skills?.technical) ? data.skills.technical : [];
  const soft = Array.isArray(data.skills?.soft) ? data.skills.soft : [];
  const tools = Array.isArray(data.skills?.tools) ? data.skills.tools : [];
  return [...technical, ...soft, ...tools].filter(hasText).length;
}

export function calculateAtsV1(data) {
  const summaryWords = countWords(data.summary);
  const hasStrongSummary = summaryWords >= 40 && summaryWords <= 120;
  const projectCount = nonEmptyEntries(data.projects, ["title", "name", "description", "details", "tech"]).length;
  const experienceCount = nonEmptyEntries(data.experience, ["company", "role", "period", "details"]).length;
  const skillsCount = skillCount(data);
  const hasLinks = hasText(data.links?.github) || hasText(data.links?.linkedin);
  const measuredImpact = hasMeasuredImpact(data);
  const completeEducation = hasCompleteEducation(data);

  const score = Math.min(
    100,
    (hasStrongSummary ? 15 : 0) +
      (projectCount >= 2 ? 10 : 0) +
      (experienceCount >= 1 ? 10 : 0) +
      (skillsCount >= 8 ? 10 : 0) +
      (hasLinks ? 10 : 0) +
      (measuredImpact ? 15 : 0) +
      (completeEducation ? 10 : 0),
  );

  return {
    score,
    checks: {
      hasStrongSummary,
      projectCount,
      experienceCount,
      skillsCount,
      summaryWords,
      hasLinks,
      measuredImpact,
      completeEducation,
    },
  };
}

export function getAtsSuggestions(checks) {
  const suggestions = [];

  if (!checks.hasStrongSummary) suggestions.push("Write a stronger summary (40–120 words).");
  if (checks.projectCount < 2) suggestions.push("Add at least 2 projects.");
  if (checks.experienceCount < 1) suggestions.push("Add at least 1 experience entry.");
  if (checks.skillsCount < 8) suggestions.push("Add more skills (target 8+).");
  if (!checks.hasLinks) suggestions.push("Add a GitHub or LinkedIn link.");
  if (!checks.measuredImpact) suggestions.push("Add measurable impact (numbers) in bullets.");
  if (!checks.completeEducation) suggestions.push("Complete education fields (school, degree, period, details).");

  return suggestions.slice(0, 3);
}

export function getTopImprovements(checks) {
  const improvements = [];

  if (checks.projectCount < 2) improvements.push("Add at least 2 projects.");
  if (!checks.measuredImpact) improvements.push("Add measurable impact (numbers).");
  if (checks.summaryWords < 40) improvements.push("Expand your summary to at least 40 words.");
  if (checks.skillsCount < 8) improvements.push("Add more skills (target 8+).");
  if (checks.experienceCount < 1) improvements.push("Add at least one experience entry (internship or project work).");

  return improvements.slice(0, 3);
}

export function getBulletGuidance(text) {
  const lines = String(text || "")
    .split("\n")
    .map((line) => line.replace(/^\s*[-*]\s*/, "").trim())
    .filter(Boolean);

  return lines.map((line) => ({
    bullet: line,
    needsActionVerb: !startsWithActionVerb(line),
    needsNumbers: !/\b\d+(?:[.,]\d+)?\s*(?:%|x|k|m|K|M)?\b/.test(line),
  }));
}

export function hasProjectOrExperience(data) {
  const hasProject = (data.projects || []).some(
    (item) =>
      hasText(item.title) || hasText(item.name) || hasText(item.description) || hasText(item.details) || (item.techStack || []).length,
  );
  const hasExperience = (data.experience || []).some(
    (item) => hasText(item.company) || hasText(item.role) || hasText(item.period) || hasText(item.details),
  );
  return hasProject || hasExperience;
}

export function hasRequiredName(data) {
  return hasText(data.personal?.name);
}

export function getResumeCompletenessWarning(data) {
  if (!hasRequiredName(data) || !hasProjectOrExperience(data)) {
    return "Your resume may look incomplete.";
  }
  return "";
}

export function resumeToPlainText(data) {
  const lines = [];
  const pushLine = (line = "") => lines.push(line);

  const contactBits = [data.personal?.email, data.personal?.phone, data.personal?.location].filter(hasText);
  const linkBits = [data.links?.github, data.links?.linkedin].filter(hasText);
  const skillsByCategory =
    typeof data.skills === "string"
      ? { technical: data.skills.split(",").map((item) => item.trim()).filter(Boolean), soft: [], tools: [] }
      : {
          technical: (data.skills?.technical || []).filter(hasText),
          soft: (data.skills?.soft || []).filter(hasText),
          tools: (data.skills?.tools || []).filter(hasText),
        };

  const education = (data.education || []).filter(
    (item) => hasText(item.school) || hasText(item.degree) || hasText(item.period) || hasText(item.details),
  );
  const experience = (data.experience || []).filter(
    (item) => hasText(item.company) || hasText(item.role) || hasText(item.period) || hasText(item.details),
  );
  const projects = (data.projects || []).filter(
    (item) => hasText(item.title) || hasText(item.name) || hasText(item.description) || hasText(item.details),
  );

  pushLine(data.personal?.name || "Name");
  pushLine(contactBits.join(" | "));
  pushLine("");

  if (hasText(data.summary)) {
    pushLine("Summary");
    pushLine(data.summary.trim());
    pushLine("");
  }

  if (education.length) {
    pushLine("Education");
    education.forEach((item) => {
      pushLine([item.school, item.degree, item.period].filter(hasText).join(" | "));
      if (hasText(item.details)) pushLine(item.details.trim());
      pushLine("");
    });
  }

  if (experience.length) {
    pushLine("Experience");
    experience.forEach((item) => {
      pushLine([item.role, item.company, item.period].filter(hasText).join(" | "));
      if (hasText(item.details)) pushLine(item.details.trim());
      pushLine("");
    });
  }

  if (projects.length) {
    pushLine("Projects");
    projects.forEach((item) => {
      pushLine([
        item.title || item.name,
        Array.isArray(item.techStack) ? item.techStack.join(", ") : item.tech,
      ].filter(hasText).join(" | "));
      if (hasText(item.description || item.details)) pushLine((item.description || item.details).trim());
      if (hasText(item.liveUrl)) pushLine(`Live: ${item.liveUrl}`);
      if (hasText(item.githubUrl)) pushLine(`GitHub: ${item.githubUrl}`);
      pushLine("");
    });
  }

  if (skillsByCategory.technical.length || skillsByCategory.soft.length || skillsByCategory.tools.length) {
    pushLine("Skills");
    if (skillsByCategory.technical.length) pushLine(`Technical Skills: ${skillsByCategory.technical.join(", ")}`);
    if (skillsByCategory.soft.length) pushLine(`Soft Skills: ${skillsByCategory.soft.join(", ")}`);
    if (skillsByCategory.tools.length) pushLine(`Tools & Technologies: ${skillsByCategory.tools.join(", ")}`);
    pushLine("");
  }

  if (linkBits.length) {
    pushLine("Links");
    linkBits.forEach((link) => pushLine(link));
    pushLine("");
  }

  return lines.join("\n").trim();
}

export function loadTemplateChoice() {
  const stored = localStorage.getItem(RESUME_TEMPLATE_KEY);
  return RESUME_TEMPLATES.includes(stored) ? stored : "Classic";
}

export function saveTemplateChoice(template) {
  const nextTemplate = RESUME_TEMPLATES.includes(template) ? template : "Classic";
  localStorage.setItem(RESUME_TEMPLATE_KEY, nextTemplate);
}

export function loadColorChoice() {
  const stored = localStorage.getItem(RESUME_COLOR_KEY);
  return RESUME_COLOR_THEMES.some((item) => item.value === stored) ? stored : "hsl(168, 60%, 40%)";
}

export function saveColorChoice(color) {
  const nextColor = RESUME_COLOR_THEMES.some((item) => item.value === color) ? color : "hsl(168, 60%, 40%)";
  localStorage.setItem(RESUME_COLOR_KEY, nextColor);
}
