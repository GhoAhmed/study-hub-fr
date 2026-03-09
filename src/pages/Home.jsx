import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-border">
        <span className="text-2xl font-display font-bold text-accent">
          StudyHub
        </span>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <button className="btn-ghost px-5 py-2 text-sm">Login</button>
          </Link>
          <Link to="/register">
            <button className="btn-primary px-5 py-2 text-sm">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        <div
          className="absolute w-[500px] h-[500px] rounded-full pointer-events-none top-[5%] left-[-5%] pulse-slow"
          style={{
            background:
              "radial-gradient(circle, rgba(108,71,255,0.18), transparent)",
          }}
        />
        <div
          className="absolute w-[360px] h-[360px] rounded-full pointer-events-none bottom-[10%] right-[0%] pulse-slow"
          style={{
            background:
              "radial-gradient(circle, rgba(0,229,176,0.13), transparent)",
            animationDelay: "2s",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-8 fade-up"
            style={{
              background: "rgba(108,71,255,0.12)",
              border: "1px solid rgba(108,71,255,0.35)",
              color: "var(--color-accent)",
            }}
          >
            🚀 The modern learning platform
          </div>

          <h1 className="text-6xl font-display font-extrabold leading-tight mb-6 fade-up-2">
            Learn without
            <br />
            <span className="text-primary"> limits</span>
          </h1>

          <p className="text-lg text-muted mb-10 max-w-lg mx-auto fade-up-3 leading-relaxed">
            Join thousands of students and instructors building skills that
            matter — anytime, anywhere.
          </p>

          <div className="flex gap-4 justify-center fade-up-4">
            <Link to="/register">
              <button className="btn-primary glow-primary text-base px-8 py-3">
                Start Learning Free
              </button>
            </Link>
            <Link to="/login">
              <button className="btn-ghost text-base px-8 py-3">Sign In</button>
            </Link>
          </div>
        </div>
      </main>

      {/* Stats */}
      <section className="grid grid-cols-3 divide-x divide-border border-t border-border">
        {[
          ["10K+", "Students"],
          ["500+", "Courses"],
          ["200+", "Instructors"],
        ].map(([num, label]) => (
          <div key={label} className="text-center py-10">
            <div className="text-4xl font-display font-bold text-accent mb-1">
              {num}
            </div>
            <div className="text-sm text-muted">{label}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
