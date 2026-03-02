import { Code2, Video, ChartNoAxesColumn } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Practice Problems",
    description: "Sharpen your coding skills with structured problem sets.",
    icon: Code2,
  },
  {
    title: "Mock Interviews",
    description: "Simulate real interview rounds and improve communication.",
    icon: Video,
  },
  {
    title: "Track Progress",
    description: "Measure readiness with clear performance insights.",
    icon: ChartNoAxesColumn,
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center sm:p-14">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Ace Your Placement
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Practice, assess, and prepare for your dream job
          </p>
          <Link
            to="/app/dashboard"
            className="mt-8 inline-flex items-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white transition hover:bg-primary/90"
          >
            Get Started
          </Link>
        </section>

        <section className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, description, icon: Icon }) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                <Icon size={20} />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
              <p className="mt-2 text-slate-600">{description}</p>
            </article>
          ))}
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <p className="text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Placement Readiness Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
