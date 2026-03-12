import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import {
  MdDashboard,
  MdMenuBook,
  MdAdd,
  MdPeople,
  MdSettings,
  MdStar,
  MdPlayCircle,
  MdTrendingUp,
  MdArrowForward,
  MdCheckCircle,
  MdHourglassTop,
} from "react-icons/md";
import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export const instructorNavItems = [
  { icon: <MdDashboard size={20} />, label: "Overview", path: "/instructor" },
  {
    icon: <MdMenuBook size={20} />,
    label: "My Courses",
    path: "/instructor/courses",
  },
  {
    icon: <MdAdd size={20} />,
    label: "New Course",
    path: "/instructor/courses/create",
  },
  {
    icon: <MdPeople size={20} />,
    label: "Students",
    path: "/instructor/students",
  },
  {
    icon: <MdSettings size={20} />,
    label: "Settings",
    path: "/instructor/settings",
  },
];

const StatCard = ({ label, value, color, icon, sub }) => (
  <div className="card flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted">{label}</span>
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{
          background: "rgba(108,71,255,0.1)",
          color: "var(--color-primary)",
        }}
      >
        {icon}
      </div>
    </div>
    <span className="text-4xl font-display font-bold" style={{ color }}>
      {value ?? "—"}
    </span>
    {sub && <span className="text-xs text-muted">{sub}</span>}
  </div>
);

export default function InstructorDashboard() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const h = { headers: { Authorization: `Bearer ${token}` } };

    axios
      .get("http://localhost:3000/api/instructor/courses?limit=100", h)
      .then(async (r) => {
        const cs = r.data.courses || [];
        setCourses(cs);

        // Fetch enrollments for all courses
        const allEnrollments = [];
        await Promise.all(
          cs.map((c) =>
            axios
              .get(`http://localhost:3000/api/courses/${c._id}/enrollments`, h)
              .then((res) => allEnrollments.push(...res.data))
              .catch(() => {}),
          ),
        );
        setEnrollments(allEnrollments);

        const totalEnrolled = allEnrollments.filter(
          (e) => e.status === "accepted",
        ).length;
        const pending = allEnrollments.filter(
          (e) => e.status === "pending",
        ).length;
        const avgRating = cs.length
          ? (cs.reduce((a, c) => a + (c.rating || 0), 0) / cs.length).toFixed(1)
          : "—";

        setStats({
          total: cs.length,
          published: cs.filter((c) => c.isPublished).length,
          totalEnrolled,
          pending,
          avgRating,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const topCourses = [...courses]
    .sort((a, b) => (b.enrolledCount || 0) - (a.enrolledCount || 0))
    .slice(0, 4);
  const pendingList = enrollments
    .filter((e) => e.status === "pending")
    .slice(0, 5);
  const recentStudents = enrollments
    .filter((e) => e.status === "accepted")
    .slice(0, 5);

  return (
    <DashboardLayout navItems={instructorNavItems} role="instructor">
      <div className="fade-up flex flex-col gap-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold mb-1">
              Welcome back, {user.email?.split("@")[0]} 👋
            </h1>
            <p className="text-muted">
              Here's what's happening with your courses today
            </p>
          </div>
          <button
            onClick={() => navigate("/instructor/courses/create")}
            className="btn-primary flex items-center gap-2"
          >
            <MdAdd size={18} /> New Course
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              label: "Total Courses",
              value: stats?.total,
              color: "var(--color-text)",
              icon: <MdMenuBook size={18} />,
              sub: "All time",
            },
            {
              label: "Published",
              value: stats?.published,
              color: "var(--color-accent)",
              icon: <MdCheckCircle size={18} />,
              sub: "Live courses",
            },
            {
              label: "Total Students",
              value: stats?.totalEnrolled,
              color: "var(--color-primary)",
              icon: <MdPeople size={18} />,
              sub: "Enrolled & accepted",
            },
            {
              label: "Pending",
              value: stats?.pending,
              color: "#fbbf24",
              icon: <MdHourglassTop size={18} />,
              sub: "Awaiting approval",
            },
            {
              label: "Avg Rating",
              value: stats?.avgRating,
              color: "#fbbf24",
              icon: <MdStar size={18} />,
              sub: "Across all courses",
            },
          ].map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Courses */}
          <div className="card flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg">Top Courses</h2>
              <button
                onClick={() => navigate("/instructor/courses")}
                className="text-xs text-primary flex items-center gap-1 hover:underline"
              >
                View all <MdArrowForward size={14} />
              </button>
            </div>
            {loading ? (
              <div className="flex flex-col gap-3">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-12 h-12 rounded-xl bg-surface2 shrink-0" />
                      <div className="flex-1 flex flex-col gap-2 justify-center">
                        <div className="h-3 bg-surface2 rounded w-3/4" />
                        <div className="h-2 bg-surface2 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
              </div>
            ) : topCourses.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-sm font-medium mb-1">No courses yet</p>
                <p className="text-xs text-muted mb-4">
                  Create your first course to get started
                </p>
                <button
                  onClick={() => navigate("/instructor/courses/create")}
                  className="btn-primary text-sm px-4 py-2"
                >
                  Create Course
                </button>
              </div>
            ) : (
              topCourses.map((c, i) => (
                <div
                  key={c._id}
                  onClick={() =>
                    navigate(`/instructor/courses/${c._id}/content`)
                  }
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface2 transition-colors cursor-pointer group"
                >
                  <span className="text-xs text-muted w-4 shrink-0 font-bold">
                    #{i + 1}
                  </span>
                  <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-surface2">
                    {c.thumbnail ? (
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">
                        📚
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                      {c.title}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted mt-0.5">
                      <span className="flex items-center gap-1">
                        <MdPeople size={11} />
                        {c.enrolledCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MdStar size={11} style={{ color: "#fbbf24" }} />
                        {c.rating?.toFixed(1)}
                      </span>
                      <span>${c.price}</span>
                    </div>
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

          {/* Pending Enrollment Requests */}
          <div className="card flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg">
                Pending Requests
                {stats?.pending > 0 && (
                  <span
                    className="ml-2 badge"
                    style={{
                      background: "rgba(251,191,36,0.15)",
                      color: "#fbbf24",
                    }}
                  >
                    {stats.pending}
                  </span>
                )}
              </h2>
            </div>
            {pendingList.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <MdCheckCircle
                  size={36}
                  className="mb-3"
                  style={{ color: "var(--color-accent)" }}
                />
                <p className="text-sm font-medium">All caught up!</p>
                <p className="text-xs text-muted mt-1">
                  No pending enrollment requests
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {pendingList.map((enr) => (
                  <div
                    key={enr._id}
                    onClick={() =>
                      navigate(
                        `/instructor/courses/${enr.courseId?._id || enr.courseId}/content`,
                      )
                    }
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface2 transition-colors cursor-pointer"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: "var(--color-primary)" }}
                    >
                      {enr.userId?.username?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {enr.userId?.username}
                      </p>
                      <p className="text-xs text-muted truncate">
                        {enr.userId?.email}
                      </p>
                    </div>
                    <span
                      className="badge shrink-0"
                      style={{
                        background: "rgba(251,191,36,0.12)",
                        color: "#fbbf24",
                      }}
                    >
                      Pending
                    </span>
                  </div>
                ))}
                {stats?.pending > 5 && (
                  <p className="text-xs text-muted text-center pt-2">
                    +{stats.pending - 5} more requests
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Recent Students */}
          <div className="card flex flex-col gap-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg">
                Recent Students
              </h2>
              <span className="text-xs text-muted">
                {stats?.totalEnrolled || 0} total enrolled
              </span>
            </div>
            {recentStudents.length === 0 ? (
              <p className="text-sm text-muted text-center py-6">
                No enrolled students yet
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {recentStudents.map((enr) => (
                  <div
                    key={enr._id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/20 transition-all"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                      style={{ background: "var(--color-accent)" }}
                    >
                      {enr.userId?.username?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {enr.userId?.username}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className="flex-1 h-1 rounded-full"
                          style={{ background: "var(--color-border)" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${enr.progress}%`,
                              background: "var(--color-accent)",
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted shrink-0">
                          {enr.progress}%
                        </span>
                      </div>
                    </div>
                    <MdPlayCircle
                      size={16}
                      style={{ color: "var(--color-primary)", flexShrink: 0 }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
