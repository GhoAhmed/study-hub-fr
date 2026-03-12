import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { instructorNavItems } from "./InstructorDashboard";
import axios from "axios";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdVisibility,
  MdVisibilityOff,
  MdStar,
  MdPeople,
  MdMenuBook,
} from "react-icons/md";
import toast from "react-hot-toast";

const api = (token) =>
  axios.create({
    baseURL: "http://localhost:3000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

const levelColors = {
  beginner: { bg: "rgba(0,229,176,0.12)", color: "var(--color-accent)" },
  intermediate: { bg: "rgba(108,71,255,0.12)", color: "var(--color-primary)" },
  advanced: { bg: "rgba(255,107,107,0.12)", color: "var(--color-danger)" },
};

export default function InstructorCourses() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (search) params.append("search", search);
      const res = await api(token).get(`/instructor/courses?${params}`);
      setCourses(res.data.courses || []);
      setTotal(res.data.total || 0);
    } catch {
      /* empty */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page, search]);

  const handleDelete = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium text-sm">Delete this course?</p>
          <p className="text-xs text-muted">
            All sections and lessons will be lost.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-surface border border-border text-muted"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                const toastId = toast.loading("Deleting...");
                await api(token).delete(`/courses/${id}`);
                toast.success("Course deleted", { id: toastId });
                fetchCourses();
              }}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium text-white"
              style={{ background: "var(--color-danger)" }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 8000 },
    );
  };

  const handleTogglePublish = async (course) => {
    const toastId = toast.loading(
      course.isPublished ? "Unpublishing..." : "Publishing...",
    );
    try {
      await api(token).put(`/courses/${course._id}`, {
        isPublished: !course.isPublished,
      });
      toast.success(
        course.isPublished ? "Course unpublished" : "Course published!",
        { id: toastId },
      );
      fetchCourses();
    } catch {
      toast.error("Failed to update course", { id: toastId });
    }
  };

  const totalPages = Math.ceil(total / 9);

  return (
    <DashboardLayout navItems={instructorNavItems} role="instructor">
      <div className="fade-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold">My Courses</h1>
            <p className="text-muted text-sm mt-1">{total} courses total</p>
          </div>
          <button
            onClick={() => navigate("/instructor/courses/create")}
            className="btn-primary flex items-center gap-2"
          >
            <MdAdd size={18} /> New Course
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 input max-w-sm mb-8">
          <MdSearch size={18} className="text-muted shrink-0" />
          <input
            className="bg-transparent outline-none text-sm w-full"
            placeholder="Search your courses..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="card p-0 overflow-hidden animate-pulse">
                  <div className="h-40 bg-surface2" />
                  <div className="p-4 flex flex-col gap-3">
                    <div className="h-4 bg-surface2 rounded w-3/4" />
                    <div className="h-3 bg-surface2 rounded w-1/2" />
                  </div>
                </div>
              ))}
          </div>
        ) : courses.length === 0 ? (
          <div
            className="card flex flex-col items-center justify-center py-24 text-center"
            style={{ border: "1px dashed var(--color-border)" }}
          >
            <div className="text-5xl mb-4">📭</div>
            <p className="text-lg font-display font-semibold mb-2">
              No courses yet
            </p>
            <p className="text-sm text-muted mb-6">
              Create your first course and start teaching
            </p>
            <button
              onClick={() => navigate("/instructor/courses/create")}
              className="btn-primary flex items-center gap-2"
            >
              <MdAdd size={18} /> Create Course
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => {
              const level = levelColors[course.level] || levelColors.beginner;
              return (
                <div
                  key={course._id}
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
                    {/* Published badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className="badge"
                        style={{
                          background: course.isPublished
                            ? "rgba(0,229,176,0.15)"
                            : "rgba(255,107,107,0.15)",
                          color: course.isPublished
                            ? "var(--color-accent)"
                            : "var(--color-danger)",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        {course.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span
                        className="badge"
                        style={{ background: level.bg, color: level.color }}
                      >
                        {course.level}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <h3 className="font-display font-bold text-sm leading-snug line-clamp-2">
                      {course.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <MdStar size={13} style={{ color: "#fbbf24" }} />
                        {course.rating?.toFixed(1) || "—"}
                      </span>
                      <span className="flex items-center gap-1">
                        <MdPeople size={13} />
                        {course.enrolledCount?.toLocaleString() || 0}
                      </span>
                      <span className="font-semibold text-text">
                        ${course.price}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border">
                      <button
                        onClick={() =>
                          navigate(`/instructor/courses/${course._id}/content`)
                        }
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all bg-surface2 hover:bg-accent/20 text-muted"
                        style={{ color: "var(--color-accent)" }}
                      >
                        <MdMenuBook size={14} /> Content
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/instructor/courses/edit/${course._id}`)
                        }
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all bg-surface2 hover:bg-primary/20 hover:text-primary text-muted"
                      >
                        <MdEdit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleTogglePublish(course)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all bg-surface2 text-muted"
                        style={{
                          color: course.isPublished
                            ? "var(--color-danger)"
                            : "var(--color-accent)",
                        }}
                      >
                        {course.isPublished ? (
                          <>
                            <MdVisibilityOff size={14} /> Unpublish
                          </>
                        ) : (
                          <>
                            <MdVisibility size={14} /> Publish
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="p-2 rounded-lg text-xs bg-surface2 text-muted hover:text-danger transition-colors"
                      >
                        <MdDelete size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 text-sm text-muted">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-ghost px-4 py-2 text-sm disabled:opacity-40"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-ghost px-4 py-2 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
