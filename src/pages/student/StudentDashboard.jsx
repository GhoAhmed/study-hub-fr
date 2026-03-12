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
              className="flex-1 py-1.5 rounded-lg text-xs bg-surface border border-border text-muted"
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

  return (
    <DashboardLayout navItems={studentNavItems} role="student">
      <div className="fade-up">
        <h1 className="text-4xl font-display font-bold mb-1">My Learning</h1>
        <p className="text-muted mb-8">
          Track your progress and continue where you left off
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {[
            {
              label: "Enrolled",
              value: accepted.length,
              color: "var(--color-accent)",
            },
            { label: "Pending", value: pending.length, color: "#fbbf24" },
            {
              label: "Completed",
              value: accepted.filter((e) => e.progress === 100).length,
              color: "var(--color-primary)",
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="card flex flex-col gap-1">
              <span className="text-sm text-muted">{label}</span>
              <span
                className="text-4xl font-display font-bold"
                style={{ color }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-36 bg-surface2 rounded-xl mb-4" />
                  <div className="h-4 bg-surface2 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-surface2 rounded w-1/2" />
                </div>
              ))}
          </div>
        ) : enrollments.length === 0 ? (
          <div
            className="card flex flex-col items-center py-20 text-center"
            style={{ border: "1px dashed var(--color-border)" }}
          >
            <div className="text-5xl mb-4">📚</div>
            <p className="text-lg font-display font-semibold mb-2">
              No courses yet
            </p>
            <p className="text-sm text-muted mb-6">
              Browse our catalog and enroll in your first course
            </p>
            <Link to="/courses">
              <button className="btn-primary">Browse Courses</button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrollments.map((enr) => {
              const course = enr.courseId;
              if (!course) return null;
              const st = statusStyle[enr.status] || statusStyle.pending;
              return (
                <div
                  key={enr._id}
                  className="card p-0 overflow-hidden flex flex-col group"
                >
                  {/* Thumbnail */}
                  <div className="relative h-40 bg-surface2 overflow-hidden">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        📚
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
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
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <h3 className="font-display font-bold text-sm leading-snug line-clamp-2">
                      {course.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <MdStar size={13} style={{ color: "#fbbf24" }} />
                        {course.rating?.toFixed(1)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MdAccessTime size={13} />
                        {course.totalDuration}m
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

                    {/* Progress bar (only for accepted) */}
                    {enr.status === "accepted" && (
                      <div>
                        <div className="flex items-center justify-between text-xs text-muted mb-1.5">
                          <span>Progress</span>
                          <span>{enr.progress}%</span>
                        </div>
                        <div
                          className="h-1.5 rounded-full"
                          style={{ background: "var(--color-border)" }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${enr.progress}%`,
                              background: "var(--color-accent)",
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {enr.status === "pending" && (
                      <p className="text-xs text-muted italic">
                        Waiting for instructor approval...
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto pt-3 border-t border-border">
                      {enr.status === "accepted" && (
                        <button
                          onClick={() =>
                            navigate(`/student/courses/${enr._id}`)
                          }
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-white transition-all"
                          style={{ background: "var(--color-primary)" }}
                        >
                          <MdPlayCircle size={14} />
                          {enr.progress > 0 ? "Continue" : "Start Learning"}
                        </button>
                      )}
                      <button
                        onClick={() => handleUnenroll(enr._id)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium border border-border text-muted hover:text-danger hover:border-danger/40 transition-all"
                      >
                        <MdCancel size={14} />
                      </button>
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
