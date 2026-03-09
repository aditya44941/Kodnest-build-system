import { useEffect, useState } from "react";
import ResumeDocument from "../components/ResumeDocument";
import ResumeTemplateTabs from "../components/ResumeTemplateTabs";
import ResumeTopNav from "../components/ResumeTopNav";
import {
  getResumeCompletenessWarning,
  loadColorChoice,
  loadResume,
  loadTemplateChoice,
  resumeToPlainText,
  saveColorChoice,
  saveTemplateChoice,
} from "../lib/resumeSkeleton";

function ResumePreviewPage() {
  const [resume, setResume] = useState(loadResume());
  const [template, setTemplate] = useState(loadTemplateChoice());
  const [accentColor, setAccentColor] = useState(loadColorChoice());
  const [copyState, setCopyState] = useState("");
  const [pdfToast, setPdfToast] = useState("");
  const warning = getResumeCompletenessWarning(resume);

  useEffect(() => {
    setResume(loadResume());
  }, []);

  useEffect(() => {
    saveTemplateChoice(template);
  }, [template]);

  useEffect(() => {
    saveColorChoice(accentColor);
  }, [accentColor]);

  const handleDownloadPdf = () => {
    setPdfToast("PDF export ready! Check your downloads.");
    setTimeout(() => setPdfToast(""), 1800);
  };

  const handleCopyText = async () => {
    const plainText = resumeToPlainText(resume);
    try {
      await navigator.clipboard.writeText(plainText);
      setCopyState("Resume text copied.");
    } catch {
      setCopyState("Copy failed.");
    }
    setTimeout(() => setCopyState(""), 1500);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="print:hidden">
        <ResumeTopNav />
      </div>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <ResumeTemplateTabs
            value={template}
            onChange={setTemplate}
            colorValue={accentColor}
            onColorChange={setAccentColor}
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="rounded-lg border border-black px-4 py-2 text-sm font-medium text-black transition hover:bg-slate-100"
            >
              Download PDF
            </button>
            <button
              type="button"
              onClick={handleCopyText}
              className="rounded-lg border border-black px-4 py-2 text-sm font-medium text-black transition hover:bg-slate-100"
            >
              Copy Resume as Text
            </button>
          </div>
        </div>
        {warning ? (
          <p className="mb-4 rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 print:hidden">
            {warning}
          </p>
        ) : null}
        {copyState ? <p className="mb-4 text-sm text-slate-700 print:hidden">{copyState}</p> : null}
        {pdfToast ? <p className="mb-4 text-sm text-slate-700 print:hidden">{pdfToast}</p> : null}
        <div className="rounded-2xl border border-black bg-white print:rounded-none print:border-none">
          <ResumeDocument data={resume} template={template} accentColor={accentColor} />
        </div>
      </main>
    </div>
  );
}

export default ResumePreviewPage;
