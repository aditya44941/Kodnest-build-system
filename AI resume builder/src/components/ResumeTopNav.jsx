import { Link, NavLink } from "react-router-dom";

function navClasses({ isActive }) {
  return `rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-black text-white" : "text-slate-700 hover:bg-slate-100"
  }`;
}

function ResumeTopNav() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-base font-semibold tracking-tight text-slate-900">
          AI Resume Builder
        </Link>
        <nav className="flex items-center gap-2" aria-label="Main">
          <NavLink to="/builder" className={navClasses}>
            Builder
          </NavLink>
          <NavLink to="/preview" className={navClasses}>
            Preview
          </NavLink>
          <NavLink to="/proof" className={navClasses}>
            Proof
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default ResumeTopNav;
