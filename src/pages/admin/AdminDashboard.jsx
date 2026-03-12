import DashboardLayout from "../../components/DashboardLayout";
import {
  MdDashboard,
  MdPeople,
  MdSchool,
  MdMenuBook,
  MdSettings,
  MdTrendingUp,
  MdHourglassTop,
  MdCheckCircle,
  MdArrowForward,
} from "react-icons/md";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export const navItems = [
  { icon: <MdDashboard size={20} />, label: "Overview", path: "/admin" },
  { icon: <MdPeople size={20} />, label: "Users", path: "/admin/users" },
  {
    icon: <MdSchool size={20} />,
    label: "Instructors",
    path: "/admin/instructors",
  },
  { icon: <MdMenuBook size={20} />, label: "Courses", path: "/admin/courses" },
  {
    icon: <MdSettings size={20} />,
    label: "Settings",
    path: "/admin/settings",
  },
];

// eslint-disable-next-line react-refresh/only-export-components
export { navItems as adminNavItems };

const StatCard = ({ label, value, color, icon, sub }) => (
  <div className="card flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted">{label}</span>
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{
          background: `rgba(${color === "var(--color-accent)" ? "0,229,176" : color === "var(--color-primary)" ? "108,71,255" : color === "var(--color-danger)" ? "255,107,107" : "240,240,255"},0.12)`,
          color,
        }}
      >
        {icon}
      </div>
    </div>
    <span
      className="text-3xl sm:text-4xl font-display font-bold"
      style={{ color }}
    >
      {value ?? "—"}
    </span>
    {sub && <span className="text-xs text-muted">{sub}</span>}
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecent] = useState([]);
  const [courses, setCourses] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const h = { headers: { Authorization: `Bearer ${token}` } };
    axios
      .get("http://localhost:3000/api/admin/stats", h)
      .then((r) => setStats(r.data))
      .catch(() => {});
    axios
      .get("http://localhost:3000/api/admin/users?limit=5&page=1", h)
      .then((r) => setRecent(r.data.users || []))
      .catch(() => {});
    axios
      .get("http://localhost:3000/api/courses?limit=4", h)
      .then((r) => setCourses(r.data.courses || []))
      .catch(() => {});
  }, []);

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers,
      color: "var(--color-text)",
      icon: <MdPeople size={18} />,
      sub: "All registered accounts",
    },
    {
      label: "Students",
      value: stats?.totalStudents,
      color: "var(--color-accent)",
      icon: <MdMenuBook size={18} />,
      sub: "Active learners",
    },
    {
      label: "Instructors",
      value: stats?.totalInstructors,
      color: "var(--color-primary)",
      icon: <MdSchool size={18} />,
      sub: "Approved instructors",
    },
    {
      label: "Pending Approvals",
      value: stats?.pendingInstructors,
      color: "var(--color-danger)",
      icon: <MdHourglassTop size={18} />,
      sub: "Awaiting your review",
    },
    {
      label: "Total Courses",
      value: stats?.totalCourses,
      color: "#fbbf24",
      icon: <MdTrendingUp size={18} />,
      sub: "Published courses",
    },
  ];

  return (
    <DashboardLayout navItems={navItems} role="admin">
      <div className="fade-up flex flex-col gap-8 overflow-hidden">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-4xl font-display font-bold mb-1">
            Platform Overview
          </h1>
          <p className="text-muted">
            Everything happening on StudyHub at a glance
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {statCards.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="card flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg">Recent Users</h2>
              <button
                onClick={() => navigate("/admin/users")}
                className="text-xs text-primary flex items-center gap-1 hover:underline"
              >
                View all <MdArrowForward size={14} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {recentUsers.length === 0 ? (
                <p className="text-sm text-muted py-4 text-center">
                  No users yet
                </p>
              ) : (
                recentUsers.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface2 transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{
                        background:
                          u.role === "admin"
                            ? "var(--color-danger)"
                            : u.role === "instructor"
                              ? "var(--color-primary)"
                              : "var(--color-accent)",
                      }}
                    >
                      {u.username?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {u.username}
                      </p>
                      <p className="text-xs text-muted truncate">{u.email}</p>
                    </div>
                    <span
                      className="badge capitalize shrink-0"
                      style={{
                        background:
                          u.role === "admin"
                            ? "rgba(255,107,107,0.12)"
                            : u.role === "instructor"
                              ? "rgba(108,71,255,0.12)"
                              : "rgba(0,229,176,0.12)",
                        color:
                          u.role === "admin"
                            ? "var(--color-danger)"
                            : u.role === "instructor"
                              ? "var(--color-primary)"
                              : "var(--color-accent)",
                      }}
                    >
                      {u.role}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pending Instructors */}
          <div className="card flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg">
                Pending Approvals
              </h2>
              <button
                onClick={() => navigate("/admin/instructors")}
                className="text-xs text-primary flex items-center gap-1 hover:underline"
              >
                Manage <MdArrowForward size={14} />
              </button>
            </div>
            {!stats?.pendingInstructors ? (
              <div className="flex flex-col items-center py-8 text-center">
                <MdCheckCircle
                  size={36}
                  className="mb-3"
                  style={{ color: "var(--color-accent)" }}
                />
                <p className="font-medium text-sm">All caught up!</p>
                <p className="text-xs text-muted mt-1">
                  No pending instructor approvals
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center py-6 text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3"
                  style={{ background: "rgba(255,107,107,0.12)" }}
                >
                  <span
                    className="text-3xl font-display font-bold"
                    style={{ color: "var(--color-danger)" }}
                  >
                    {stats.pendingInstructors}
                  </span>
                </div>
                <p className="font-medium text-sm mb-1">
                  Instructors waiting for approval
                </p>
                <p className="text-xs text-muted mb-4">
                  Review and approve instructor accounts
                </p>
                <button
                  onClick={() => navigate("/admin/instructors")}
                  className="btn-primary text-sm px-5 py-2"
                >
                  Review Now
                </button>
              </div>
            )}
          </div>

          {/* Recent Courses */}
          <div className="card flex flex-col gap-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg">Recent Courses</h2>
              <button
                onClick={() => navigate("/admin/courses")}
                className="text-xs text-primary flex items-center gap-1 hover:underline"
              >
                View all <MdArrowForward size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {courses.length === 0 ? (
                <p className="text-sm text-muted py-4">No courses yet</p>
              ) : (
                courses.map((c) => (
                  <div
                    key={c._id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-surface2">
                      {c.thumbnail ? (
                        <img
                          src={c.thumbnail}
                          alt={c.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">
                          📚
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{c.title}</p>
                      <p className="text-xs text-muted">
                        {c.category} · {c.level}
                      </p>
                    </div>
                    <span
                      className="badge shrink-0"
                      style={{
                        background: c.isPublished
                          ? "rgba(0,229,176,0.1)"
                          : "rgba(255,107,107,0.1)",
                        color: c.isPublished
                          ? "var(--color-accent)"
                          : "var(--color-danger)",
                      }}
                    >
                      {c.isPublished ? "Live" : "Draft"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
