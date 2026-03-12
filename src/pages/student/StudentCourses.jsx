import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { studentNavItems } from "./StudentDashboard";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  MdPlayCircle,
  MdHourglassTop,
  MdCancel,
  MdStar,
  MdAccessTime,
  MdSearch,
  MdFilterList,
  MdCheckCircle,
} from "react-icons/md";

const statusStyle = {
  pending: {
    bg: "rgba(251,191,36,0.12)",
    color: "#fbbf24",
    icon: <MdHourglassTop size={13} />,
    label: "Pending",
  },
  accepted: {
    bg: "rgba(0,229,176,0.12)",
    color: "var(--color-accent)",
    icon: <MdPlayCircle size={13} />,
    label: "Enrolled",
  },
  rejected: {
    bg: "rgba(255,107,107,0.12)",
    color: "var(--color-danger)",
    icon: <MdCancel size={13} />,
    label: "Rejected",
  },
};

export default function StudentCourses() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent"); // recent | progress | title

  const fetchEnrollments = () => {
    axios
      .get("http://localhost:3000/api/enrollments/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setEnrollments(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleUnenroll = (e, enrollmentId, title) => {
    e.stopPropagation();
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium text-sm">Unenroll from "{title}"?</p>
          <div className="flex gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 py-1.5 rounded-lg text-xs border"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-muted)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                await axios.delete(
                  `http://localhost:3000/api/enrollments/${enrollmentId}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  },
                );
                toast.success("Unenrolled successfully");
                fetchEnrollments();
              }}
              className="flex-1 py-1.5 rounded-lg text-xs text-white"
              style={{ background: "var(--color-danger)" }}
            >
              Unenroll
            </button>
          </div>
        </div>
      ),
      { duration: 8000 },
    );
  };

  // ── Derive filtered + sorted list ──────────────────
  const processed = enrollments
    .filter((enr) => filter === "all" || enr.status === filter)
    .filter((enr) => {
      const q = search.toLowerCase();
      return !q || enr.courseId?.title?.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sort === "progress") return (b.progress || 0) - (a.progress || 0);
      if (sort === "title")
        return (a.courseId?.title || "").localeCompare(b.courseId?.title || "");
      return 0; // recent = API order
    });

  const counts = {
    all: enrollments.length,
    accepted: enrollments.filter((e) => e.status === "accepted").length,
    pending: enrollments.filter((e) => e.status === "pending").length,
    rejected: enrollments.filter((e) => e.status === "rejected").length,
  };

  return (
    <DashboardLayout navItems={studentNavItems} role="student">
      <div className="fade-up flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-display font-bold mb-1">My Courses</h1>
          <p className="text-muted">All your enrollments in one place</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {[
            ["all", "All", "var(--color-text)"],
            ["accepted", "Enrolled", "var(--color-accent)"],
            ["pending", "Pending", "#fbbf24"],
            ["rejected", "Rejected", "var(--color-danger)"],
          ].map(([key, label, color]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background:
                  filter === key
                    ? "var(--color-surface)"
                    : "var(--color-surface2)",
                color: filter === key ? color : "var(--color-muted)",
                border: `1px solid ${filter === key ? "var(--color-border)" : "transparent"}`,
                boxShadow:
                  filter === key ? "0 1px 4px rgba(0,0,0,0.15)" : "none",
              }}
            >
              {label}
              <span
                className="text-xs px-1.5 py-0.5 rounded-md"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  color: "var(--color-muted)",
                }}
              >
                {counts[key]}
              </span>
            </button>
          ))}
        </div>

        {/* Search + Sort */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <MdSearch
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              className="input pl-9 text-sm w-full"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <MdFilterList size={16} className="text-muted" />
            <select
              className="input text-sm pr-8 py-2"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ minWidth: "140px" }}
            >
              <option value="recent">Most Recent</option>
              <option value="progress">By Progress</option>
              <option value="title">By Title</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-40 bg-surface2 rounded-xl mb-4" />
                  <div className="h-4 bg-surface2 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-surface2 rounded w-1/2" />
                </div>
              ))}
          </div>
        ) : processed.length === 0 ? (
          <div
            className="card flex flex-col items-center py-20 text-center"
            style={{ border: "1px dashed var(--color-border)" }}
          >
            <div className="text-5xl mb-4">📭</div>
            <p className="text-lg font-display font-semibold mb-2">
              {search ? "No courses match your search" : "No courses here"}
            </p>
            <p className="text-sm text-muted mb-6">
              {filter === "all"
                ? "Browse our catalog and start learning"
                : `No ${filter} enrollments`}
            </p>
            {filter === "all" && !search && (
              <Link to="/courses">
                <button className="btn-primary">Browse Courses</button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {processed.map((enr) => {
              const course = enr.courseId;
              if (!course) return null;
              const st = statusStyle[enr.status] || statusStyle.pending;
              const isComplete =
                enr.status === "accepted" && enr.progress === 100;

              return (
                <div
                  key={enr._id}
                  className="card p-0 overflow-hidden flex flex-col group cursor-pointer"
                  onClick={() =>
                    enr.status === "accepted" &&
                    navigate(`/student/courses/${enr._id}`)
                  }
                  style={{ opacity: enr.status === "rejected" ? 0.6 : 1 }}
                >
                  {/* Thumbnail */}
                  <div className="relative h-44 bg-surface2 overflow-hidden shrink-0">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">
                        📚
                      </div>
                    )}

                    {/* Overlay on hover for accepted */}
                    {enr.status === "accepted" && (
                      <div
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: "rgba(0,0,0,0.5)" }}
                      >
                        <div
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                          style={{ background: "var(--color-primary)" }}
                        >
                          <MdPlayCircle size={18} />
                          {enr.progress > 0 ? "Continue" : "Start"}
                        </div>
                      </div>
                    )}

                    {/* Status badge */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      {isComplete && (
                        <span
                          className="badge flex items-center gap-1"
                          style={{
                            background: "rgba(0,229,176,0.9)",
                            color: "#000",
                            backdropFilter: "blur(4px)",
                          }}
                        >
                          <MdCheckCircle size={12} /> Complete
                        </span>
                      )}
                      {!isComplete && (
                        <span
                          className="badge flex items-center gap-1"
                          style={{
                            background: st.bg,
                            color: st.color,
                            backdropFilter: "blur(4px)",
                          }}
                        >
                          {st.icon} {st.label}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <h3 className="font-display font-bold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <MdStar size={13} style={{ color: "#fbbf24" }} />
                        {course.rating?.toFixed(1) || "—"}
                      </span>
                      <span className="flex items-center gap-1">
                        <MdAccessTime size={13} />
                        {course.totalDuration || 0}m
                      </span>
                      <span
                        className="badge capitalize"
                        style={{
                          background: "var(--color-surface2)",
                          color: "var(--color-muted)",
                        }}
                      >
                        {course.level}
                      </span>
                    </div>

                    {/* Progress bar for accepted */}
                    {enr.status === "accepted" && (
                      <div>
                        <div className="flex items-center justify-between text-xs text-muted mb-1.5">
                          <span>Progress</span>
                          <span
                            className="font-medium"
                            style={{
                              color: isComplete
                                ? "var(--color-accent)"
                                : "var(--color-text)",
                            }}
                          >
                            {enr.progress}%
                          </span>
                        </div>
                        <div
                          className="h-1.5 rounded-full"
                          style={{ background: "var(--color-border)" }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${enr.progress}%`,
                              background: isComplete
                                ? "var(--color-accent)"
                                : "var(--color-primary)",
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {enr.status === "pending" && (
                      <p
                        className="text-xs italic"
                        style={{ color: "#fbbf24" }}
                      >
                        ⏳ Waiting for instructor approval...
                      </p>
                    )}

                    {enr.status === "rejected" && (
                      <p
                        className="text-xs italic"
                        style={{ color: "var(--color-danger)" }}
                      >
                        ✕ Your request was rejected
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto pt-3 border-t border-border">
                      {enr.status === "accepted" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/student/courses/${enr._id}`);
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90"
                          style={{ background: "var(--color-primary)" }}
                        >
                          <MdPlayCircle size={14} />
                          {enr.progress === 100
                            ? "Review"
                            : enr.progress > 0
                              ? "Continue"
                              : "Start Learning"}
                        </button>
                      )}
                      {enr.status !== "rejected" && (
                        <button
                          onClick={(e) =>
                            handleUnenroll(e, enr._id, course.title)
                          }
                          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium border border-border text-muted hover:text-danger hover:border-danger/40 transition-all"
                          title="Unenroll"
                        >
                          <MdCancel size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
