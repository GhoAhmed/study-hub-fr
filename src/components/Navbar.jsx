import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdMenu, MdClose } from "react-icons/md";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [open, setOpen] = useState(false);

  const dashboardPath =
    user?.role === "instructor"
      ? "/instructor"
      : user?.role === "admin"
        ? "/admin"
        : "/student";

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-display font-bold text-accent">
          StudyHub
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/courses"
            className="text-sm text-muted hover:text-text transition-colors"
          >
            Courses
          </Link>
          <Link
            to="/#features"
            className="text-sm text-muted hover:text-text transition-colors"
          >
            Features
          </Link>
          <Link
            to="/#instructors"
            className="text-sm text-muted hover:text-text transition-colors"
          >
            Instructors
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <button
                onClick={() => navigate(dashboardPath)}
                className="btn-ghost px-4 py-2 text-sm"
              >
                Dashboard
              </button>
              <button
                onClick={logout}
                className="btn-primary px-4 py-2 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn-ghost px-4 py-2 text-sm">Login</button>
              </Link>
              <Link to="/register">
                <button className="btn-primary px-4 py-2 text-sm">
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-muted"
          onClick={() => setOpen(!open)}
        >
          {open ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-surface px-6 py-4 flex flex-col gap-4">
          <Link
            to="/courses"
            className="text-sm text-muted"
            onClick={() => setOpen(false)}
          >
            Courses
          </Link>
          {user ? (
            <>
              <button
                onClick={() => {
                  navigate(dashboardPath);
                  setOpen(false);
                }}
                className="btn-ghost text-sm"
              >
                Dashboard
              </button>
              <button onClick={logout} className="btn-primary text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>
                <button className="btn-ghost w-full text-sm">Login</button>
              </Link>
              <Link to="/register" onClick={() => setOpen(false)}>
                <button className="btn-primary w-full text-sm">
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
