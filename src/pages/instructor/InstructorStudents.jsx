import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { instructorNavItems } from "./InstructorDashboard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MdPeople,
  MdSearch,
  MdCheckCircle,
  MdHourglassTop,
  MdArrowForward,
  MdMenuBook,
  MdTrendingUp,
  MdFilterList,
} from "react-icons/md";

export default function InstructorStudents() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState({}); // { courseId: [...] }
  const [loading, setLoading] = useState(true);
  const [activeCourse, setActiveCourse] = useState("all");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | accepted | pending

  useEffect(() => {
    const h = { headers: { Authorization: `Bearer ${token}` } };

    axios
      .get("http://localhost:3000/api/instructor/courses?limit=100", h)
      .then(async (r) => {
        const cs = r.data.courses || [];
        setCourses(cs);

        const map = {};
        await Promise.all(
          cs.map((c) =>
            axios
              .get(`http://localhost:3000/api/courses/${c._id}/enrollments`, h)
              .then((res) => {
                map[c._id] = res.data;
              })
              .catch(() => {
                map[c._id] = [];
              }),
          ),
        );
        setEnrollments(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ── Flat list for "all" view ──────────────────────
  const allEnrollments = Object.entries(enrollments).flatMap(
    ([courseId, list]) =>
      list.map((enr) => ({
        ...enr,
        _course: courses.find((c) => c._id === courseId),
      })),
  );

  const displayed = (
    activeCourse === "all"
      ? allEnrollments
      : (enrollments[activeCourse] || []).map((e) => ({
          ...e,
          _course: courses.find((c) => c._id === activeCourse),
        }))
  )
    .filter((e) => filter === "all" || e.status === filter)
    .filter((e) => {
      const q = search.toLowerCase();
      return (
        !q ||
        e.userId?.username?.toLowerCase().includes(q) ||
        e.userId?.email?.toLowerCase().includes(q)
      );
    });

  const totalStudents = new Set(
    allEnrollments
      .filter((e) => e.status === "accepted")
      .map((e) => e.userId?._id),
  ).size;
  const totalPending = allEnrollments.filter(
    (e) => e.status === "pending",
  ).length;
  const avgProgress = allEnrollments.filter((e) => e.status === "accepted")
    .length
    ? Math.round(
        allEnrollments
          .filter((e) => e.status === "accepted")
          .reduce((a, e) => a + (e.progress || 0), 0) /
          allEnrollments.filter((e) => e.status === "accepted").length,
      )
    : 0;

  return (
    <DashboardLayout navItems={instructorNavItems} role="instructor">
      <div className="fade-up flex flex-col gap-8 max-w-5xl">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-display font-bold mb-1">Students</h1>
          <p className="text-muted">
            Track enrollment and progress across all your courses
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Courses",
              value: courses.length,
              color: "var(--color-text)",
              icon: <MdMenuBook size={18} />,
            },
            {
              label: "Enrolled Students",
              value: totalStudents,
              color: "var(--color-accent)",
              icon: <MdPeople size={18} />,
            },
            {
              label: "Pending Requests",
              value: totalPending,
              color: "#fbbf24",
              icon: <MdHourglassTop size={18} />,
            },
            {
              label: "Avg Progress",
              value: `${avgProgress}%`,
              color: "var(--color-primary)",
              icon: <MdTrendingUp size={18} />,
            },
          ].map(({ label, value, color, icon }) => (
            <div key={label} className="card flex flex-col gap-3">
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
              <span
                className="text-3xl font-display font-bold"
                style={{ color }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Course tabs */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveCourse("all")}
              className="shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background:
                  activeCourse === "all"
                    ? "var(--color-primary)"
                    : "var(--color-surface2)",
                color: activeCourse === "all" ? "#fff" : "var(--color-muted)",
              }}
            >
              All Courses
            </button>
            {courses.map((c) => {
              const count = (enrollments[c._id] || []).filter(
                (e) => e.status === "accepted",
              ).length;
              const hasPending = (enrollments[c._id] || []).some(
                (e) => e.status === "pending",
              );
              return (
                <button
                  key={c._id}
                  onClick={() => setActiveCourse(c._id)}
                  className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background:
                      activeCourse === c._id
                        ? "var(--color-primary)"
                        : "var(--color-surface2)",
                    color:
                      activeCourse === c._id ? "#fff" : "var(--color-muted)",
                  }}
                >
                  <span className="max-w-[120px] truncate">{c.title}</span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-md"
                    style={{ background: "rgba(255,255,255,0.15)" }}
                  >
                    {count}
                  </span>
                  {hasPending && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: "#fbbf24" }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Search + Filter bar */}
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <MdSearch
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                className="input pl-9 text-sm w-full"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {["all", "accepted", "pending"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize"
                  style={{
                    background:
                      filter === f
                        ? f === "accepted"
                          ? "rgba(0,229,176,0.15)"
                          : f === "pending"
                            ? "rgba(251,191,36,0.15)"
                            : "var(--color-surface)"
                        : "var(--color-surface2)",
                    color:
                      filter === f
                        ? f === "accepted"
                          ? "var(--color-accent)"
                          : f === "pending"
                            ? "#fbbf24"
                            : "var(--color-text)"
                        : "var(--color-muted)",
                    border:
                      filter === f
                        ? `1px solid ${f === "accepted" ? "rgba(0,229,176,0.3)" : f === "pending" ? "rgba(251,191,36,0.3)" : "var(--color-border)"}`
                        : "1px solid transparent",
                  }}
                >
                  <MdFilterList size={13} /> {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Students table */}
        {loading ? (
          <div className="card p-0 overflow-hidden">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-5 py-4 border-b border-border animate-pulse last:border-b-0"
                >
                  <div className="w-9 h-9 rounded-full bg-surface2 shrink-0" />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="h-3 bg-surface2 rounded w-1/3" />
                    <div className="h-2 bg-surface2 rounded w-1/4" />
                  </div>
                  <div className="h-2 bg-surface2 rounded w-24" />
                  <div className="h-6 bg-surface2 rounded-lg w-16" />
                </div>
              ))}
          </div>
        ) : displayed.length === 0 ? (
          <div
            className="card flex flex-col items-center py-16 text-center"
            style={{ border: "1px dashed var(--color-border)" }}
          >
            <div className="text-5xl mb-4">👥</div>
            <p className="text-lg font-display font-semibold mb-2">
              No students found
            </p>
            <p className="text-sm text-muted">
              {search
                ? "Try a different search term"
                : "No enrollments match this filter"}
            </p>
          </div>
        ) : (
          <div className="card p-0 overflow-hidden">
            {/* Table header */}
            <div
              className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 px-5 py-3 border-b border-border text-xs uppercase tracking-wider"
              style={{ color: "var(--color-muted)" }}
            >
              <span>Student</span>
              <span>Course</span>
              <span>Progress</span>
              <span>Status</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-border">
              {displayed.map((enr, i) => {
                const c = enr._course;
                return (
                  <div
                    key={`${enr._id}-${i}`}
                    className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 items-center px-5 py-3.5 hover:bg-surface2 transition-colors cursor-pointer group"
                    onClick={() =>
                      c && navigate(`/instructor/courses/${c._id}/content`)
                    }
                  >
                    {/* Student */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: "var(--color-primary)" }}
                      >
                        {enr.userId?.username?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                          {enr.userId?.username}
                        </p>
                        <p className="text-xs text-muted truncate">
                          {enr.userId?.email}
                        </p>
                      </div>
                    </div>

                    {/* Course */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 bg-surface2">
                        {c?.thumbnail ? (
                          <img
                            src={c.thumbnail}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs">
                            📚
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted truncate">
                        {c?.title || "—"}
                      </p>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-2">
                      {enr.status === "accepted" ? (
                        <>
                          <div
                            className="flex-1 h-1.5 rounded-full"
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
                          <span className="text-xs text-muted shrink-0 w-8 text-right">
                            {enr.progress}%
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-muted">—</span>
                      )}
                    </div>

                    {/* Status */}
                    <div>
                      <span
                        className="badge"
                        style={{
                          background:
                            enr.status === "accepted"
                              ? "rgba(0,229,176,0.12)"
                              : enr.status === "pending"
                                ? "rgba(251,191,36,0.12)"
                                : "rgba(255,107,107,0.12)",
                          color:
                            enr.status === "accepted"
                              ? "var(--color-accent)"
                              : enr.status === "pending"
                                ? "#fbbf24"
                                : "var(--color-danger)",
                        }}
                      >
                        {enr.status === "accepted" && enr.progress === 100 ? (
                          <span className="flex items-center gap-1">
                            <MdCheckCircle size={12} /> Done
                          </span>
                        ) : (
                          enr.status
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer count */}
            <div className="px-5 py-3 border-t border-border text-xs text-muted">
              Showing {displayed.length} result
              {displayed.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
