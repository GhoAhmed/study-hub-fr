import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import CourseCard from "../components/CourseCard";
import {
  MdPlayCircle,
  MdSchool,
  MdVerified,
  MdTrendingUp,
  MdAccessTime,
  MdDevices,
  MdEmojiEvents,
  MdArrowForward,
} from "react-icons/md";

const features = [
  {
    icon: <MdPlayCircle size={28} />,
    title: "HD Video Lessons",
    desc: "Crystal-clear video content with subtitles and playback controls.",
  },
  {
    icon: <MdVerified size={28} />,
    title: "Certified Instructors",
    desc: "Every instructor is vetted and approved by our academic team.",
  },
  {
    icon: <MdDevices size={28} />,
    title: "Learn Anywhere",
    desc: "Access your courses on any device, anytime, even offline.",
  },
  {
    icon: <MdTrendingUp size={28} />,
    title: "Track Progress",
    desc: "Visual dashboards to keep you motivated and on track.",
  },
  {
    icon: <MdAccessTime size={28} />,
    title: "Learn at Your Pace",
    desc: "No deadlines. No pressure. Learn when it works for you.",
  },
  {
    icon: <MdEmojiEvents size={28} />,
    title: "Earn Certificates",
    desc: "Get recognized with shareable certificates on completion.",
  },
];

const stats = [
  { value: "50K+", label: "Students" },
  { value: "1,200+", label: "Courses" },
  { value: "300+", label: "Instructors" },
  { value: "4.8★", label: "Avg Rating" },
];

const categories = [
  { name: "Web Development", emoji: "🌐" },
  { name: "Data Science", emoji: "📊" },
  { name: "Design", emoji: "🎨" },
  { name: "Mobile Development", emoji: "📱" },
  { name: "Cloud Computing", emoji: "☁️" },
  { name: "Programming", emoji: "💻" },
];

export default function Home() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/courses?limit=6")
      .then((r) => setCourses(r.data.courses || []))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-6 py-28 text-center">
        <div
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none -top-32 -left-32 pulse-slow"
          style={{
            background:
              "radial-gradient(circle, rgba(108,71,255,0.15), transparent)",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full pointer-events-none -bottom-20 -right-20 pulse-slow"
          style={{
            background:
              "radial-gradient(circle, rgba(0,229,176,0.12), transparent)",
            animationDelay: "2s",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 fade-up"
            style={{
              background: "rgba(108,71,255,0.12)",
              border: "1px solid rgba(108,71,255,0.3)",
              color: "var(--color-accent)",
            }}
          >
            🎓 The platform built for serious learners
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-extrabold leading-tight mb-6 fade-up-2">
            Master skills that
            <br />
            <span className="text-primary">shape your future</span>
          </h1>

          <p className="text-lg text-muted max-w-xl mx-auto mb-10 fade-up-3 leading-relaxed">
            Learn from verified experts. Build real projects. Earn certificates
            that open doors.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-up-4">
            <Link to="/courses">
              <button className="btn-primary glow-primary text-base px-8 py-3.5 flex items-center gap-2">
                Explore Courses <MdArrowForward size={18} />
              </button>
            </Link>
            <Link to="/register">
              <button className="btn-ghost text-base px-8 py-3.5">
                Start for Free
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-border">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border">
          {stats.map(({ value, label }) => (
            <div key={label} className="py-10 text-center">
              <div className="text-4xl font-display font-bold text-accent mb-1">
                {value}
              </div>
              <div className="text-sm text-muted">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold mb-3">
            Browse by Category
          </h2>
          <p className="text-muted">
            Find the perfect course in your field of interest
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(({ name, emoji }) => (
            <Link
              key={name}
              to={`/courses?category=${encodeURIComponent(name)}`}
            >
              <div className="card p-5 text-center cursor-pointer hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center gap-3">
                <span className="text-3xl">{emoji}</span>
                <span className="text-xs font-medium leading-tight">
                  {name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED COURSES ── */}
      <section className="max-w-7xl mx-auto px-6 py-10 pb-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-display font-bold mb-2">
              Featured Courses
            </h2>
            <p className="text-muted">
              Hand-picked by our team for quality and impact
            </p>
          </div>
          <Link
            to="/courses"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            View all <MdArrowForward size={16} />
          </Link>
        </div>

        {courses.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted">
            No courses available yet.
          </div>
        )}
      </section>

      {/* ── FEATURES ── */}
      <section className="border-t border-border bg-surface" id="features">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-display font-bold mb-3">
              Why StudyHub?
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              Everything you need to learn faster, smarter, and with confidence.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="card hover:border-primary/30 transition-all duration-300 flex flex-col gap-4"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(108,71,255,0.12)",
                    color: "var(--color-primary)",
                  }}
                >
                  {icon}
                </div>
                <div>
                  <h3 className="font-display font-bold text-base mb-1">
                    {title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="card text-center py-16 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(108,71,255,0.12), transparent 70%)",
            }}
          />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Ready to start learning?
            </h2>
            <p className="text-muted mb-8 max-w-md mx-auto">
              Join 50,000+ learners already building their future on StudyHub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <button className="btn-primary glow-primary px-8 py-3.5 text-base">
                  Join for Free
                </button>
              </Link>
              <Link to="/courses">
                <button className="btn-ghost px-8 py-3.5 text-base">
                  Browse Courses
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xl font-display font-bold text-accent">
            StudyHub
          </span>
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} StudyHub. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted">
            <a href="#" className="hover:text-text transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-text transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-text transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
