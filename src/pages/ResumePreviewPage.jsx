import ResumeDocument from "../components/ResumeDocument";
import ResumeTopNav from "../components/ResumeTopNav";
import { loadResume } from "../lib/resumeSkeleton";

function ResumePreviewPage() {
  const resume = loadResume();

  return (
    <div className="min-h-screen bg-white text-black">
      <ResumeTopNav />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-black bg-white">
          <ResumeDocument data={resume} />
        </div>
      </main>
    </div>
  );
}

export default ResumePreviewPage;
