import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RB_STEPS, getRbArtifact, getRbStatusLabel } from "../lib/rbBuildTrack";

function getBadgeClasses(label) {
  if (label === "Shipped") return "border-emerald-300 bg-emerald-50 text-emerald-700";
  if (label === "In Progress") return "border-amber-300 bg-amber-50 text-amber-700";
  return "border-slate-300 bg-white text-slate-700";
}

function RBProofPage() {
  const navigate = useNavigate();
  const statusLabel = getRbStatusLabel();
  const [lovableLink, setLovableLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [deployLink, setDeployLink] = useState("");
  const [copyState, setCopyState] = useState("");

  useEffect(() => {
    const firstIncomplete = RB_STEPS.find((step) => !getRbArtifact(step.number)?.uploadedAt);
    if (firstIncomplete) navigate(firstIncomplete.path, { replace: true });
  }, [navigate]);

  const stepStatus = useMemo(
    () =>
      RB_STEPS.map((step) => ({
        ...step,
        complete: Boolean(getRbArtifact(step.number)?.uploadedAt),
      })),
    [],
  );

  const handleCopy = async () => {
    const lines = [
      "AI Resume Builder — Build Track",
      ...stepStatus.map((step) => `${step.path}: ${step.complete ? "Done" : "Pending"}`),
      "",
      `Lovable: ${lovableLink || "-"}`,
      `GitHub: ${githubLink || "-"}`,
      `Deploy: ${deployLink || "-"}`,
    ];

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopyState("Final submission copied");
    } catch {
      setCopyState("Copy failed");
    }
    setTimeout(() => setCopyState(""), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-3 px-4 py-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold tracking-wide text-slate-900">AI Resume Builder</p>
          <p className="text-center text-sm font-medium text-slate-700">Project 3 — Step 8 of 8</p>
          <div className="flex justify-start sm:justify-end">
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getBadgeClasses(statusLabel)}`}>
              {statusLabel}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h1 className="text-3xl font-semibold text-slate-900">Proof</h1>
          <p className="mt-2 text-sm text-slate-600">Final status and submission links for all 8 build-track steps.</p>
        </section>

        <section className="grid gap-6 lg:grid-cols-10">
          <div className="space-y-6 lg:col-span-7">
            <article className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900">8 Step Status</h2>
              <div className="mt-4 space-y-2">
                {stepStatus.map((step) => (
                  <div key={step.path} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
                    <span className="font-medium text-slate-800">{step.path}</span>
                    <span className={step.complete ? "text-emerald-700" : "text-rose-700"}>
                      {step.complete ? "Complete" : "Missing"}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <aside className="space-y-6 lg:col-span-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-base font-semibold text-slate-900">Submission Links</h2>
              <div className="mt-3 space-y-3">
                <input
                  value={lovableLink}
                  onChange={(event) => setLovableLink(event.target.value)}
                  placeholder="Lovable link"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <input
                  value={githubLink}
                  onChange={(event) => setGithubLink(event.target.value)}
                  placeholder="GitHub link"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <input
                  value={deployLink}
                  onChange={(event) => setDeployLink(event.target.value)}
                  placeholder="Deploy link"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                >
                  Copy Final Submission
                </button>
                {copyState ? <p className="text-xs text-slate-600">{copyState}</p> : null}
              </div>
            </article>
          </aside>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-sm text-slate-600">Proof Footer</p>
          <Link to="/rb/08-ship" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
            Back to Step 8
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default RBProofPage;

