import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  MdStar,
  MdPeople,
  MdAccessTime,
  MdPlayCircle,
  MdCheckCircle,
  MdArrowBack,
  MdLanguage,
  MdBarChart,
  MdMenuBook,
  MdPending,
} from "react-icons/md";
import { toast } from "react-hot-toast";

const levelColors = {
  beginner: { bg: "rgba(0,229,176,0.12)", color: "var(--color-accent)" },
  intermediate: { bg: "rgba(108,71,255,0.12)", color: "var(--color-primary)" },
  advanced: { bg: "rgba(255,107,107,0.12)", color: "var(--color-danger)" },
};

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [enrollStatus, setEnrollStatus] = useState(null); // null | "pending" | "accepted"
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (!user || !course) return;
    axios
      .get("http://localhost:3000/api/enrollments/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((r) => {
        const enr = r.data.find(
          (e) => e.courseId?._id === course._id || e.courseId === course._id,
        );
        if (enr) setEnrollStatus(enr.status);
      })
      .catch(() => {});
  }, [course]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await axios.post(
        "http://localhost:3000/api/enrollments",
        { courseId: course._id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      toast.success(
        "Enrollment request sent! Waiting for instructor approval.",
      );
      setEnrollStatus("pending");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to enroll");
    } finally {
      setEnrolling(false);
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/courses/${id}`)
      .then((r) => setCourse(r.data))
      .catch(() => navigate("/courses"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-muted animate-pulse text-lg font-display">
          Loading...
        </div>
      </div>
    );

  if (!course) return null;

  const level = levelColors[course.level] || levelColors.beginner;

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      {/* Hero */}
      <section className="border-b border-border bg-surface">
        <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-12">
          {/* Left — Info */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors"
            >
              <MdArrowBack size={16} /> Back to courses
            </Link>

            <div className="flex flex-wrap gap-2">
              <span
                className="badge"
                style={{ background: level.bg, color: level.color }}
              >
                {course.level}
              </span>
              <span
                className="badge"
                style={{
                  background: "var(--color-surface2)",
                  color: "var(--color-muted)",
                }}
              >
                {course.category}
              </span>
              {course.tags?.map((tag) => (
                <span
                  key={tag}
                  className="badge"
                  style={{
                    background: "var(--color-surface2)",
                    color: "var(--color-muted)",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl font-display font-extrabold leading-tight">
              {course.title}
            </h1>
            <p className="text-muted text-base leading-relaxed">
              {course.shortDescription || course.description}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-5 text-sm">
              <span className="flex items-center gap-1.5">
                <MdStar size={18} style={{ color: "#fbbf24" }} />
                <strong>{course.rating?.toFixed(1)}</strong>
                <span className="text-muted">
                  ({course.totalRatings?.toLocaleString()} ratings)
                </span>
              </span>
              <span className="flex items-center gap-1.5 text-muted">
                <MdPeople size={16} /> {course.enrolledCount?.toLocaleString()}{" "}
                students
              </span>
              <span className="flex items-center gap-1.5 text-muted">
                <MdAccessTime size={16} /> {course.totalDuration} minutes
              </span>
              <span className="flex items-center gap-1.5 text-muted">
                <MdMenuBook size={16} /> {course.totalLessons} lessons
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted">
              <span>Created by</span>
              <span className="font-semibold text-primary">
                {course.instructor?.username}
              </span>
              <span className="flex items-center gap-1">
                <MdLanguage size={14} /> {course.language}
              </span>
            </div>
          </div>

          {/* Right — Enroll card */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24 flex flex-col gap-5">
              {/* Thumbnail */}
              <div className="rounded-xl overflow-hidden h-48 bg-surface2">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    📚
                  </div>
                )}
              </div>

              <div className="text-4xl font-display font-bold">
                {course.price === 0 ? (
                  <span style={{ color: "var(--color-accent)" }}>Free</span>
                ) : (
                  `$${course.price}`
                )}
              </div>

              {!user ? (
                <Link to="/register">
                  <button className="btn-primary w-full py-3.5 text-base glow-primary">
                    Sign Up to Enroll
                  </button>
                </Link>
              ) : user.role === "student" ? (
                enrollStatus === "accepted" ? (
                  <button
                    className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2"
                    style={{ background: "var(--color-accent)" }}
                    onClick={() => navigate("/student")}
                  >
                    <MdPlayCircle size={20} /> Go to Course
                  </button>
                ) : enrollStatus === "pending" ? (
                  <div
                    className="w-full py-3.5 text-base text-center rounded-xl font-medium"
                    style={{
                      background: "rgba(251,191,36,0.12)",
                      color: "#fbbf24",
                      border: "1px solid rgba(251,191,36,0.3)",
                    }}
                  >
                    <MdPending /> Pending Approval
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="btn-primary w-full py-3.5 text-base glow-primary flex items-center justify-center gap-2"
                  >
                    <MdPlayCircle size={20} />
                    {enrolling ? "Sending request..." : "Enroll Now"}
                  </button>
                )
              ) : (
                // instructor or admin — show course owner info instead
                <div
                  className="w-full py-3.5 text-sm text-center rounded-xl"
                  style={{
                    background: "var(--color-surface2)",
                    color: "var(--color-muted)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  {user.role === "instructor"
                    ? "👨‍🏫 Welcome instructor"
                    : "🛡️ Admin view"}
                </div>
              )}

              <div className="flex flex-col gap-2 text-sm text-muted">
                <span className="flex items-center gap-2">
                  <MdBarChart size={16} /> Level:{" "}
                  <strong className="text-text capitalize">
                    {course.level}
                  </strong>
                </span>
                <span className="flex items-center gap-2">
                  <MdMenuBook size={16} /> {course.totalLessons} lessons
                </span>
                <span className="flex items-center gap-2">
                  <MdAccessTime size={16} /> {course.totalDuration} min total
                </span>
                <span className="flex items-center gap-2">
                  <MdLanguage size={16} /> {course.language}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 flex flex-col gap-10">
          {/* What you'll learn */}
          {course.whatYouWillLearn?.length > 0 && (
            <div className="card">
              <h2 className="text-2xl font-display font-bold mb-6">
                What you'll learn
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {course.whatYouWillLearn.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <MdCheckCircle
                      size={18}
                      className="shrink-0 mt-0.5"
                      style={{ color: "var(--color-accent)" }}
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          {course.requirements?.length > 0 && (
            <div>
              <h2 className="text-2xl font-display font-bold mb-4">
                Requirements
              </h2>
              <ul className="flex flex-col gap-2">
                {course.requirements.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-muted"
                  >
                    <span className="text-primary mt-0.5">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Full Description */}
          <div>
            <h2 className="text-2xl font-display font-bold mb-4">
              About this course
            </h2>
            <p className="text-muted leading-relaxed text-sm">
              {course.description}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
