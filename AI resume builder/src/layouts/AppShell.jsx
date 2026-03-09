import { LayoutDashboard, BookOpenCheck, ClipboardCheck, Library, UserCircle } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/app/dashboard", icon: LayoutDashboard },
  { label: "Practice", to: "/app/practice", icon: BookOpenCheck },
  { label: "Assessments", to: "/app/assessments", icon: ClipboardCheck },
  { label: "Resources", to: "/app/resources", icon: Library },
  { label: "Profile", to: "/app/profile", icon: UserCircle },
];

function AppShell() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="hidden w-64 shrink-0 rounded-2xl border border-slate-200 bg-white p-4 md:block">
          <p className="px-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Navigation</p>
          <nav className="mt-4 space-y-1">
            {navItems.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex-1">
          <header className="mb-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-4">
            <h1 className="text-2xl font-bold text-primary">Placement Prep</h1>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              U
            </div>
          </header>

          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppShell;
