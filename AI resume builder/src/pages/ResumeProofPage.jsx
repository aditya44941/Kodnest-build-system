import ResumeTopNav from "../components/ResumeTopNav";

function ResumeProofPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <ResumeTopNav />
      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-8">
          <h1 className="text-2xl font-semibold tracking-tight">Proof</h1>
          <p className="mt-3 text-sm text-slate-600">Placeholder for artifacts.</p>
        </section>
      </main>
    </div>
  );
}

export default ResumeProofPage;
