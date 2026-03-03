import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

function buildAssessmentPlan({ roleTrack, focusTopic, duration }) {
  const total = Number(duration);
  const split = {
    warmup: Math.round(total * 0.15),
    coding: Math.round(total * 0.45),
    review: Math.round(total * 0.2),
    reflection: total - Math.round(total * 0.15) - Math.round(total * 0.45) - Math.round(total * 0.2),
  };

  const focusLabel = focusTopic.trim() || "Core Interview Prep";

  const checkpoints = [
    `Warm-up (${split.warmup} min): recap formulas and patterns for ${focusLabel}.`,
    `Deep Work (${split.coding} min): solve timed tasks in ${focusLabel}.`,
    `Review (${split.review} min): analyze mistakes and improve approach quality.`,
    `Reflection (${split.reflection} min): note 3 weak spots and one action each.`,
  ];

  const roleNotes = {
    "SDE Track": "Prioritize algorithmic correctness, optimization, and debugging speed.",
    "Frontend Track": "Prioritize component architecture, rendering behavior, and API integration.",
    "Backend Track": "Prioritize API design, data consistency, and scalability reasoning.",
    "Data Track": "Prioritize SQL reasoning, query tuning, and data modeling clarity.",
  };

  const evaluationRubric = [
    "Accuracy: Did your final solution pass all intended cases?",
    "Speed: Were you within your target time budget?",
    "Communication: Could you explain your trade-offs clearly?",
    "Stability: Did you avoid avoidable mistakes on second pass?",
  ];

  return {
    focusLabel,
    roleTrack,
    checkpoints,
    roleNote: roleNotes[roleTrack],
    evaluationRubric,
  };
}

function AssessmentsPage() {
  const [roleTrack, setRoleTrack] = useState("SDE Track");
  const [focusTopic, setFocusTopic] = useState("");
  const [duration, setDuration] = useState("60");
  const [runMode, setRunMode] = useState("Balanced");

  const plan = useMemo(
    () => buildAssessmentPlan({ roleTrack, focusTopic, duration }),
    [roleTrack, focusTopic, duration],
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assessment Studio</CardTitle>
          <CardDescription>
            Build a focused mock-session blueprint instead of static upcoming events.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Role Track</label>
              <select
                value={roleTrack}
                onChange={(e) => setRoleTrack(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option>SDE Track</option>
                <option>Frontend Track</option>
                <option>Backend Track</option>
                <option>Data Track</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Session Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="45">45 mins</option>
                <option value="60">60 mins</option>
                <option value="90">90 mins</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Run Mode</label>
              <select
                value={runMode}
                onChange={(e) => setRunMode(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option>Balanced</option>
                <option>Speed Drill</option>
                <option>Deep Review</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Focus Topic</label>
              <input
                value={focusTopic}
                onChange={(e) => setFocusTopic(e.target.value)}
                placeholder="e.g. Graphs, React hooks"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Generated Session Plan</p>
            <p className="mt-1 text-sm text-slate-600">{plan.roleNote}</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {plan.checkpoints.map((checkpoint) => (
                <li key={checkpoint} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                  {checkpoint}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-500">Run mode: {runMode} · Topic: {plan.focusLabel}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Post-Assessment Quality Rubric</CardTitle>
          <CardDescription>Use this after each mock run to make your next session sharper.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {plan.evaluationRubric.map((item) => (
              <li key={item} className="rounded-lg border border-slate-200 p-3 text-sm text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default AssessmentsPage;
