import { Link } from "react-router-dom";
import ResumeTopNav from "../components/ResumeTopNav";

function ResumeHomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <ResumeTopNav />
      <main className="mx-auto flex w-full max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
        <section className="w-full rounded-3xl border border-slate-200 bg-white p-10 sm:p-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">AI Resume Builder</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">Build a Resume That Gets Read.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Structured builder workflow with a calm premium editing surface and a live preview shell.
          </p>
          <Link
            to="/builder"
            className="mt-10 inline-flex rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
          >
            Start Building
          </Link>
        </section>
      </main>
    </div>
  );
}

export default ResumeHomePage;
