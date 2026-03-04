import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RB_STEPS, getRbArtifact, getRbCompletedCount, getRbStatusLabel, saveRbArtifact } from "../lib/rbBuildTrack";

function getBadgeClasses(label) {
  if (label === "Shipped") return "border-emerald-300 bg-emerald-50 text-emerald-700";
  if (label === "In Progress") return "border-amber-300 bg-amber-50 text-amber-700";
  return "border-slate-300 bg-white text-slate-700";
}

function RBStepPage({ stepNumber }) {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const step = useMemo(() => RB_STEPS.find((entry) => entry.number === stepNumber), [stepNumber]);
  const completedCount = getRbCompletedCount();
  const statusLabel = getRbStatusLabel();

  const existingArtifact = useMemo(() => getRbArtifact(stepNumber), [stepNumber]);
  const [promptText, setPromptText] = useState(existingArtifact?.promptText || "");
  const [artifactInput, setArtifactInput] = useState(existingArtifact?.artifactInput || "");
  const [screenshotName, setScreenshotName] = useState(existingArtifact?.screenshotName || "");
  const [buildStatus, setBuildStatus] = useState(existingArtifact?.buildStatus || "");
  const [uploadedAt, setUploadedAt] = useState(existingArtifact?.uploadedAt || "");
  const [copyState, setCopyState] = useState("");

  useEffect(() => {
    if (!step) {
      navigate("/rb/01-problem", { replace: true });
      return;
    }

    const blocked = RB_STEPS.some((entry) => entry.number < step.number && !getRbArtifact(entry.number)?.uploadedAt);
    if (blocked) {
      const firstMissing = RB_STEPS.find((entry) => !getRbArtifact(entry.number)?.uploadedAt);
      if (firstMissing) navigate(firstMissing.path, { replace: true });
    }
  }, [navigate, step]);

  useEffect(() => {
    if (!step) return;
    const artifact = getRbArtifact(step.number);
    setPromptText(artifact?.promptText || "");
    setArtifactInput(artifact?.artifactInput || "");
    setScreenshotName(artifact?.screenshotName || "");
    setBuildStatus(artifact?.buildStatus || "");
    setUploadedAt(artifact?.uploadedAt || "");
  }, [step]);

  if (!step) return null;

  const nextStep = RB_STEPS.find((entry) => entry.number === step.number + 1) || null;
  const canProceed = Boolean(uploadedAt);
  const progressText = `Project 3 — Step ${step.number} of 8`;

  const persistArtifact = (updates) => {
    const merged = {
      promptText,
      artifactInput,
      screenshotName,
      buildStatus,
      uploadedAt,
      updatedAt: new Date().toISOString(),
      ...updates,
    };
    saveRbArtifact(step.number, merged);
    if (Object.prototype.hasOwnProperty.call(updates, "uploadedAt")) setUploadedAt(updates.uploadedAt || "");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopyState("Copied");
    } catch {
      setCopyState("Copy failed");
    }
    setTimeout(() => setCopyState(""), 1400);
  };

  const handleBuildStatus = (status) => {
    setBuildStatus(status);
    persistArtifact({ buildStatus: status });
  };

  const handleScreenshot = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setScreenshotName(file.name);
    persistArtifact({ screenshotName: file.name });
  };

  const handleUploadArtifact = () => {
    const stamp = new Date().toISOString();
    persistArtifact({
      promptText,
      artifactInput,
      screenshotName,
      buildStatus,
      uploadedAt: stamp,
    });
    setUploadedAt(stamp);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-3 px-4 py-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold tracking-wide text-slate-900">AI Resume Builder</p>
          <p className="text-center text-sm font-medium text-slate-700">{progressText}</p>
          <div className="flex justify-start sm:justify-end">
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getBadgeClasses(statusLabel)}`}>
              {statusLabel}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h1 className="text-3xl font-semibold text-slate-900">{step.title}</h1>
          <p className="mt-2 text-sm text-slate-600">{step.description}</p>
        </section>

        <section className="grid gap-6 lg:grid-cols-10">
          <div className="space-y-6 lg:col-span-7">
            <article className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900">Main Workspace</h2>
              <p className="mt-2 text-sm text-slate-600">
                Build track rail only. Complete this step and upload a proof artifact to unlock the next route.
              </p>
              <div className="mt-5 space-y-2">
                {RB_STEPS.map((entry) => {
                  const complete = Boolean(getRbArtifact(entry.number)?.uploadedAt);
                  return (
                    <div
                      key={entry.path}
                      className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                        entry.number === step.number ? "border-primary bg-primary/5" : "border-slate-200"
                      }`}
                    >
                      <span className="font-medium text-slate-800">{entry.path}</span>
                      <span className={complete ? "text-emerald-700" : "text-slate-500"}>
                        {complete ? "Artifact Uploaded" : "Pending"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>

          <aside className="space-y-6 lg:col-span-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-base font-semibold text-slate-900">Secondary Build Panel</h2>

              <label htmlFor="lovablePrompt" className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Copy This Into Lovable
              </label>
              <textarea
                id="lovablePrompt"
                rows={8}
                value={promptText}
                onChange={(event) => {
                  setPromptText(event.target.value);
                  persistArtifact({ promptText: event.target.value });
                }}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="Paste your Lovable build prompt for this step..."
              />

              <div className="mt-3 grid gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-primary hover:text-primary"
                >
                  Copy
                </button>
                <a
                  href="https://lovable.dev"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-white hover:bg-primary/90"
                >
                  Build in Lovable
                </a>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleBuildStatus("It Worked")}
                    className="rounded-lg border border-emerald-300 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                  >
                    It Worked
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBuildStatus("Error")}
                    className="rounded-lg border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                  >
                    Error
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-primary hover:text-primary"
                >
                  Add Screenshot
                </button>
                <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={handleScreenshot} />
              </div>

              <label htmlFor="artifactInput" className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Artifact Upload
              </label>
              <input
                id="artifactInput"
                value={artifactInput}
                onChange={(event) => {
                  setArtifactInput(event.target.value);
                  persistArtifact({ artifactInput: event.target.value });
                }}
                placeholder="Paste proof text/link or commit reference..."
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
              />

              <button
                type="button"
                onClick={handleUploadArtifact}
                disabled={!artifactInput.trim() && !screenshotName}
                className="mt-3 w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Upload Artifact
              </button>

              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                <p>Build status: {buildStatus || "Not set"}</p>
                <p>Screenshot: {screenshotName || "Not added"}</p>
                <p>Artifact key: rb_step_{step.number}_artifact</p>
                <p>{copyState ? copyState : uploadedAt ? "Artifact uploaded." : "Upload required to unlock next step."}</p>
              </div>
            </article>
          </aside>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-sm text-slate-600">Proof Footer: Completed Steps {completedCount} / 8</p>
          <div className="flex items-center gap-2">
            {nextStep ? (
              <button
                type="button"
                onClick={() => navigate(nextStep.path)}
                disabled={!canProceed}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            ) : (
              <Link
                to="/rb/proof"
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${canProceed ? "bg-primary" : "pointer-events-none bg-slate-400"}`}
              >
                Go to Proof
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default RBStepPage;

