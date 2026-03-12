import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  MdDashboard,
  MdMenuBook,
  MdSearch,
  MdSettings,
  MdPlayCircle,
  MdHourglassTop,
  MdCancel,
  MdStar,
  MdAccessTime,
  MdCheckCircle,
  MdTrendingUp,
  MdArrowForward,
} from "react-icons/md";

// eslint-disable-next-line react-refresh/only-export-components
export const studentNavItems = [
  { icon: <MdDashboard size={20} />, label: "Dashboard", path: "/student" },
  {
    icon: <MdMenuBook size={20} />,
    label: "My Courses",
    path: "/student/courses",
  },
  { icon: <MdSearch size={20} />, label: "Browse", path: "/courses" },
  {
    icon: <MdSettings size={20} />,
    label: "Settings",
    path: "/student/settings",
  },
];

const statusStyle = {
  pending: {
    bg: "rgba(251,191,36,0.12)",
    color: "#fbbf24",
    icon: <MdHourglassTop size={14} />,
    label: "Pending",
  },
  accepted: {
    bg: "rgba(0,229,176,0.12)",
    color: "var(--color-accent)",
    icon: <MdPlayCircle size={14} />,
    label: "Enrolled",
  },
  rejected: {
    bg: "rgba(255,107,107,0.12)",
    color: "var(--color-danger)",
    icon: <MdCancel size={14} />,
    label: "Rejected",
  },
};

export default function StudentDashboard() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleUnenroll = (enrollmentId) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium text-sm">Unenroll from this course?</p>
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

  const accepted = enrollments.filter((e) => e.status === "accepted");
  const pending = enrollments.filter((e) => e.status === "pending");
  const completed = accepted.filter((e) => e.progress === 100);
  const inProgress = accepted.filter((e) => e.progress > 0 && e.progress < 100);
  const recentCourses = accepted.slice(0, 4);

  const overallProgress = accepted.length
    ? Math.round(
        accepted.reduce((a, e) => a + (e.progress || 0), 0) / accepted.length,
      )
    : 0;

  return (
    <DashboardLayout navItems={studentNavItems} role="student">
      <div className="fade-up flex flex-col gap-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-display font-bold mb-1">
              Welcome back, {user.email?.split("@")[0]} 👋
            </h1>
            <p className="text-muted">Keep learning — you're doing great!</p>
          </div>
          <Link to="/courses">
            <button className="btn-primary flex items-center gap-2">
              <MdSearch size={18} /> Browse Courses
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Enrolled",
              value: accepted.length,
              color: "var(--color-accent)",
              icon: <MdMenuBook size={18} />,
              sub: "Active courses",
            },
            {
              label: "Completed",
              value: completed.length,
              color: "var(--color-primary)",
              icon: <MdCheckCircle size={18} />,
              sub: "Finished courses",
            },
            {
              label: "In Progress",
              value: inProgress.length,
              color: "#fbbf24",
              icon: <MdTrendingUp size={18} />,
              sub: "Keep going!",
            },
            {
              label: "Pending",
              value: pending.length,
              color: "var(--color-muted)",
              icon: <MdHourglassTop size={18} />,
              sub: "Awaiting approval",
            },
          ].map(({ label, value, color, icon, sub }) => (
            <div key={label} className="card flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">{label}</span>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(0,229,176,0.1)",
                    color: "var(--color-accent)",
                  }}
                >
                  {icon}
                </div>
              </div>
              <span
                className="text-3xl sm:text-4xl font-display font-bold"
                style={{ color }}
              >
                {value}
              </span>
              <span className="text-xs text-muted">{sub}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Progress */}
          <div className="card flex flex-col gap-4">
            <h2 className="font-display font-bold text-lg">Overall Progress</h2>
            <div className="flex flex-col items-center py-4">
              {/* Circle progress */}
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="var(--color-border)"
                    strokeWidth="10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - overallProgress / 100)}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-display font-bold">
                    {overallProgress}%
                  </span>
                  <span className="text-xs text-muted">complete</span>
                </div>
              </div>
              <p className="text-sm text-muted text-center">
                {completed.length} of {accepted.length} courses completed
              </p>
            </div>

            {/* Mini progress list */}
            <div className="flex flex-col gap-2 mt-auto">
              {inProgress.slice(0, 3).map((enr) => (
                <div key={enr._id}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="truncate text-muted max-w-[120px] sm:max-w-[160px]">
                      {enr.courseId?.title}
                    </span>
                    <span className="shrink-0 ml-2">{enr.progress}%</span>
                  </div>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ background: "var(--color-border)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${enr.progress}%`,
                        background: "var(--color-accent)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Continue Learning */}
          <div className="card flex flex-col gap-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg">
                Continue Learning
              </h2>
              <button
                onClick={() => navigate("/student/courses")}
                className="text-xs text-primary flex items-center gap-1 hover:underline"
              >
                All courses <MdArrowForward size={14} />
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse flex gap-3 p-3 rounded-xl border border-border"
                    >
                      <div className="w-14 h-14 rounded-xl bg-surface2 shrink-0" />
                      <div className="flex-1 flex flex-col gap-2 justify-center">
                        <div className="h-3 bg-surface2 rounded w-3/4" />
                        <div className="h-2 bg-surface2 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
              </div>
            ) : recentCourses.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center flex-1">
                <div className="text-4xl mb-3">📚</div>
                <p className="text-sm font-medium mb-1">No courses yet</p>
                <p className="text-xs text-muted mb-4">
                  Find something to learn today
                </p>
                <Link to="/courses">
                  <button className="btn-primary text-sm px-4 py-2">
                    Browse Courses
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recentCourses.map((enr) => {
                  const c = enr.courseId;
                  const st = statusStyle[enr.status];
                  if (!c) return null;
                  return (
                    <div
                      key={enr._id}
                      className="flex flex-col gap-3 p-3 rounded-xl border border-border hover:border-primary/30 transition-all cursor-pointer group"
                      onClick={() =>
                        enr.status === "accepted" &&
                        navigate(`/student/courses/${enr._id}`)
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-surface2">
                          {c.thumbnail ? (
                            <img
                              src={c.thumbnail}
                              alt={c.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">
                              📚
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                            {c.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
                            <span className="flex items-center gap-1">
                              <MdStar size={11} style={{ color: "#fbbf24" }} />
                              {c.rating?.toFixed(1)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MdAccessTime size={11} />
                              {c.totalDuration}m
                            </span>
                          </div>
                        </div>
                      </div>

                      {enr.status === "accepted" ? (
                        <div>
                          <div className="flex justify-between text-xs text-muted mb-1">
                            <span>Progress</span>
                            <span>{enr.progress}%</span>
                          </div>
                          <div
                            className="h-1.5 rounded-full"
                            style={{ background: "var(--color-border)" }}
                          >
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${enr.progress}%`,
                                background:
                                  enr.progress === 100
                                    ? "var(--color-accent)"
                                    : "var(--color-primary)",
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span
                          className="badge flex items-center gap-1 w-fit"
                          style={{ background: st.bg, color: st.color }}
                        >
                          {st.icon}
                          {st.label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pending enrollments */}
          {pending.length > 0 && (
            <div className="card flex flex-col gap-4 lg:col-span-3">
              <h2 className="font-display font-bold text-lg flex items-center gap-2">
                Pending Approvals
                <span
                  className="badge"
                  style={{
                    background: "rgba(251,191,36,0.15)",
                    color: "#fbbf24",
                  }}
                >
                  {pending.length}
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {pending.map((enr) => {
                  const c = enr.courseId;
                  if (!c) return null;
                  return (
                    <div
                      key={enr._id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border"
                    >
                      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-surface2">
                        {c.thumbnail ? (
                          <img
                            src={c.thumbnail}
                            alt={c.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            📚
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {c.title}
                        </p>
                        <p className="text-xs text-muted italic">
                          Waiting for approval...
                        </p>
                      </div>
                      <button
                        onClick={() => handleUnenroll(enr._id)}
                        className="p-1.5 rounded-lg text-muted hover:text-danger transition-colors shrink-0"
                      >
                        <MdCancel size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
