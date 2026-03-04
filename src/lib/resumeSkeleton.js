export const RESUME_STORAGE_KEY = "resumeBuilderData";
const LEGACY_RESUME_STORAGE_KEY = "ai_resume_builder_skeleton_v1";

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
  projects: [{ name: "", tech: "", details: "" }],
  skills: "",
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
      name: "Candidate Tracker",
      tech: "React, Node.js, PostgreSQL",
      details: "Created a pipeline tracker for hiring workflows with role-based access and reporting.",
    },
  ],
  skills: "JavaScript, React, Node.js, SQL, REST APIs, Git",
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
      projects: Array.isArray(parsed.projects) && parsed.projects.length ? parsed.projects : EMPTY_RESUME.projects,
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

function countWords(text) {
  const words = String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return words.length;
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
  const projDetails = (data.projects || []).map((item) => item.details || "");
  const impactText = [...expDetails, ...projDetails].join(" ");
  return /\b\d+(?:[.,]\d+)?\s*(?:%|x|k|m|K|M)?\b/.test(impactText);
}

function skillCount(data) {
  return String(data.skills || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean).length;
}

export function calculateAtsV1(data) {
  const summaryWords = countWords(data.summary);
  const hasStrongSummary = summaryWords >= 40 && summaryWords <= 120;
  const projectCount = nonEmptyEntries(data.projects, ["name", "tech", "details"]).length;
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
