export const RB_TOTAL_STEPS = 8;

export const RB_STEPS = [
  {
    number: 1,
    path: "/rb/01-problem",
    slug: "01-problem",
    title: "Problem",
    description: "Define the core user problem and outcome before implementation.",
  },
  {
    number: 2,
    path: "/rb/02-market",
    slug: "02-market",
    title: "Market",
    description: "Validate target users, alternatives, and differentiation.",
  },
  {
    number: 3,
    path: "/rb/03-architecture",
    slug: "03-architecture",
    title: "Architecture",
    description: "Decide the system boundaries, services, and data movement.",
  },
  {
    number: 4,
    path: "/rb/04-hld",
    slug: "04-hld",
    title: "HLD",
    description: "Draft high-level components and integration strategy.",
  },
  {
    number: 5,
    path: "/rb/05-lld",
    slug: "05-lld",
    title: "LLD",
    description: "Specify low-level contracts, models, and edge-case handling.",
  },
  {
    number: 6,
    path: "/rb/06-build",
    slug: "06-build",
    title: "Build",
    description: "Implement the approved design plan with incremental artifacts.",
  },
  {
    number: 7,
    path: "/rb/07-test",
    slug: "07-test",
    title: "Test",
    description: "Run validations and capture test proof for each requirement.",
  },
  {
    number: 8,
    path: "/rb/08-ship",
    slug: "08-ship",
    title: "Ship",
    description: "Finalize release readiness and shipping evidence.",
  },
];

export function getRbStepByNumber(stepNumber) {
  return RB_STEPS.find((step) => step.number === stepNumber) || null;
}

export function getRbArtifactKey(stepNumber) {
  return `rb_step_${stepNumber}_artifact`;
}

export function getRbArtifact(stepNumber) {
  try {
    const raw = localStorage.getItem(getRbArtifactKey(stepNumber));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveRbArtifact(stepNumber, artifact) {
  localStorage.setItem(getRbArtifactKey(stepNumber), JSON.stringify(artifact));
}

export function isRbStepComplete(stepNumber) {
  const artifact = getRbArtifact(stepNumber);
  return Boolean(artifact && artifact.uploadedAt);
}

export function getRbCompletedCount() {
  return RB_STEPS.filter((step) => isRbStepComplete(step.number)).length;
}

export function getRbFirstIncompleteStepNumber() {
  const nextIncomplete = RB_STEPS.find((step) => !isRbStepComplete(step.number));
  return nextIncomplete ? nextIncomplete.number : RB_TOTAL_STEPS + 1;
}

export function getRbStatusLabel() {
  const completed = getRbCompletedCount();
  if (completed === 0) return "Not Started";
  if (completed >= RB_TOTAL_STEPS) return "Shipped";
  return "In Progress";
}

