import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { instructorNavItems } from "./InstructorDashboard";
import axios from "axios";
import toast from "react-hot-toast";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdArrowBack,
  MdExpandMore,
  MdExpandLess,
  MdCheckCircle,
  MdCancel,
  MdPeople,
  MdMenuBook,
  MdPlayCircle,
  MdPictureAsPdf,
  MdDragIndicator,
} from "react-icons/md";
import BlockEditor from "../../components/BlockEditor";

const api = (token) =>
  axios.create({
    baseURL: "http://localhost:3000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

const EMPTY_SECTION = { title: "", order: 0 };
const EMPTY_LESSON = {
  title: "",
  videoUrl: "",
  pdfUrl: "",
  duration: "",
  content: [],
};

export default function InstructorCourseDetail() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [lessons, setLessons] = useState({});
  const [enrollments, setEnrollments] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [tab, setTab] = useState("content");
  const [loading, setLoading] = useState(true);

  // Section modal state
  const [sectionModal, setSectionModal] = useState(false);
  const [sectionForm, setSectionForm] = useState(EMPTY_SECTION);
  const [editingSection, setEditingSection] = useState(null);
  const [sectionLoading, setSectionLoading] = useState(false);

  // Lesson modal state
  const [lessonModal, setLessonModal] = useState(false);
  const [lessonSectionId, setLessonSectionId] = useState(null);
  const [lessonForm, setLessonForm] = useState(EMPTY_LESSON);
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonLoading, setLessonLoading] = useState(false);

  // ── FETCH ──────────────────────────────────────────
  const fetchCourse = async () => {
    try {
      const res = await api(token).get(`/courses/${courseId}`);
      setCourse(res.data);
    } catch {
      navigate("/instructor/courses");
    }
  };

  const fetchSections = async () => {
    try {
      const res = await api(token).get(`/courses/${courseId}/sections`);
      const sorted = [...res.data].sort((a, b) => a.order - b.order);
      setSections(sorted);
    } catch {
      /* empty */
    }
  };

  const fetchLessons = async (sectionId) => {
    try {
      const res = await api(token).get(`/sections/${sectionId}/lessons`);
      setLessons((prev) => ({ ...prev, [sectionId]: res.data }));
    } catch {
      /* empty */
    }
  };

  const fetchEnrollments = async () => {
    try {
      const res = await api(token).get(`/courses/${courseId}/enrollments`);
      setEnrollments(res.data);
    } catch {
      /* empty */
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchCourse(), fetchSections(), fetchEnrollments()]);
      setLoading(false);
    };
    init();
  }, [courseId]);

  // Auto-fetch lessons when section expands
  const toggleSection = (sectionId) => {
    setExpanded((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
    if (!lessons[sectionId]) fetchLessons(sectionId);
  };

  // ── SECTION HANDLERS ───────────────────────────────
  const openCreateSection = () => {
    setEditingSection(null);
    setSectionForm({ title: "", order: sections.length });
    setSectionModal(true);
  };

  const openEditSection = (e, section) => {
    e.stopPropagation();
    setEditingSection(section);
    setSectionForm({ title: section.title, order: section.order });
    setSectionModal(true);
  };

  const handleSectionSubmit = async (e) => {
    e.preventDefault();
    setSectionLoading(true);
    const toastId = toast.loading(
      editingSection ? "Updating section..." : "Creating section...",
    );
    try {
      if (editingSection) {
        await api(token).put(`/sections/${editingSection._id}`, sectionForm);
        toast.success("Section updated", { id: toastId });
      } else {
        await api(token).post("/sections", { ...sectionForm, courseId });
        toast.success("Section created", { id: toastId });
      }
      setSectionModal(false);
      setEditingSection(null);
      await fetchSections();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save section", {
        id: toastId,
      });
    } finally {
      setSectionLoading(false);
    }
  };

  const handleDeleteSection = (e, sectionId) => {
    e.stopPropagation();
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium text-sm">
            Delete section and all its lessons?
          </p>
          <p className="text-xs" style={{ color: "var(--color-muted)" }}>
            This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium border"
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
                const tid = toast.loading("Deleting...");
                try {
                  await api(token).delete(`/sections/${sectionId}`);
                  toast.success("Section deleted", { id: tid });
                  await fetchSections();
                  setLessons((prev) => {
                    const n = { ...prev };
                    delete n[sectionId];
                    return n;
                  });
                } catch {
                  toast.error("Failed to delete", { id: tid });
                }
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

  // ── LESSON HANDLERS ────────────────────────────────
  const openCreateLesson = (e, sectionId) => {
    e.stopPropagation();
    setEditingLesson(null);
    setLessonSectionId(sectionId);
    setLessonForm(EMPTY_LESSON);
    setLessonModal(true);
    // Make sure section is expanded
    setExpanded((prev) => ({ ...prev, [sectionId]: true }));
    if (!lessons[sectionId]) fetchLessons(sectionId);
  };

  const openEditLesson = (lesson, sectionId) => {
    setEditingLesson(lesson);
    setLessonSectionId(sectionId);
    setLessonForm({
      title: lesson.title,
      videoUrl: lesson.videoUrl || "",
      pdfUrl: lesson.pdfUrl || "",
      duration: lesson.duration || "",
      content: lesson.content || [], // ← add this
    });
    setLessonModal(true);
  };

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    setLessonLoading(true);
    const toastId = toast.loading(
      editingLesson ? "Updating lesson..." : "Creating lesson...",
    );
    try {
      const payload = {
        ...lessonForm,
        duration: lessonForm.duration ? Number(lessonForm.duration) : undefined,
      };
      if (editingLesson) {
        await api(token).put(`/lessons/${editingLesson._id}`, payload);
        toast.success("Lesson updated", { id: toastId });
      } else {
        await api(token).post("/lessons", {
          ...payload,
          sectionId: lessonSectionId,
        });
        toast.success("Lesson created", { id: toastId });
      }
      setLessonModal(false);
      setEditingLesson(null);
      await fetchLessons(lessonSectionId);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save lesson", {
        id: toastId,
      });
    } finally {
      setLessonLoading(false);
    }
  };

  const handleDeleteLesson = (lesson, sectionId) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium text-sm">Delete "{lesson.title}"?</p>
          <div className="flex gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium border"
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
                const tid = toast.loading("Deleting...");
                try {
                  await api(token).delete(`/lessons/${lesson._id}`);
                  toast.success("Lesson deleted", { id: tid });
                  await fetchLessons(sectionId);
                } catch {
                  toast.error("Failed to delete", { id: tid });
                }
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

  // ── ENROLLMENT HANDLERS ────────────────────────────
  const handleEnrollmentStatus = async (enrollmentId, status) => {
    const toastId = toast.loading(
      status === "accepted" ? "Approving student..." : "Rejecting...",
    );
    try {
      await api(token).patch(`/enrollments/${enrollmentId}/status`, { status });
      toast.success(
        status === "accepted"
          ? "Student approved and enrolled!"
          : "Student request rejected",
        { id: toastId },
      );
      await fetchEnrollments();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed", { id: toastId });
    }
  };

  // ── DERIVED DATA ───────────────────────────────────
  const pending = enrollments.filter((e) => e.status === "pending");
  const accepted = enrollments.filter((e) => e.status === "accepted");
  const rejected = enrollments.filter((e) => e.status === "rejected");
  const totalLessons = Object.values(lessons).reduce((a, l) => a + l.length, 0);

  if (loading)
    return (
      <DashboardLayout navItems={instructorNavItems} role="instructor">
        <div className="flex items-center justify-center h-64 text-muted animate-pulse font-display text-lg">
          Loading course...
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout navItems={instructorNavItems} role="instructor">
      <div className="fade-up max-w-4xl">
        {/* ── HEADER ── */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/instructor/courses")}
            className="p-2 rounded-lg bg-surface2 text-muted hover:text-text transition-colors shrink-0"
          >
            <MdArrowBack size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-display font-bold truncate">
                {course?.title}
              </h1>
              <span
                className="badge shrink-0"
                style={{
                  background: course?.isPublished
                    ? "rgba(0,229,176,0.12)"
                    : "rgba(255,107,107,0.12)",
                  color: course?.isPublished
                    ? "var(--color-accent)"
                    : "var(--color-danger)",
                }}
              >
                {course?.isPublished ? "Published" : "Draft"}
              </span>
            </div>
            <p className="text-sm text-muted mt-1">
              {sections.length} sections · {totalLessons} lessons ·{" "}
              {enrollments.length} students
            </p>
          </div>
        </div>

        {/* ── TABS ── */}
        <div
          className="flex gap-1 p-1 rounded-xl mb-8 w-fit"
          style={{ background: "var(--color-surface2)" }}
        >
          {[
            ["content", <MdMenuBook size={16} />, "Course Content"],
            [
              "students",
              <MdPeople size={16} />,
              `Students${pending.length > 0 ? ` (${pending.length} pending)` : ""}`,
            ],
          ].map(([key, icon, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background:
                  tab === key ? "var(--color-surface)" : "transparent",
                color: tab === key ? "var(--color-text)" : "var(--color-muted)",
                boxShadow: tab === key ? "0 1px 4px rgba(0,0,0,0.2)" : "none",
              }}
            >
              {icon}
              <span>{label}</span>
              {key === "students" &&
                pending.length > 0 &&
                tab !== "students" && (
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: "#fbbf24" }}
                  />
                )}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════
            CONTENT TAB
        ══════════════════════════════════════════ */}
        {tab === "content" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-display font-bold">
                  Sections & Lessons
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Build your course structure
                </p>
              </div>
              <button
                onClick={openCreateSection}
                className="btn-primary flex items-center gap-2 text-sm px-4 py-2"
              >
                <MdAdd size={16} /> Add Section
              </button>
            </div>

            {sections.length === 0 ? (
              <div
                className="card flex flex-col items-center py-20 text-center"
                style={{ border: "1px dashed var(--color-border)" }}
              >
                <div className="text-5xl mb-4">📂</div>
                <p className="text-lg font-display font-semibold mb-2">
                  No sections yet
                </p>
                <p className="text-sm text-muted mb-6">
                  Start by creating your first section, then add lessons inside
                  it.
                </p>
                <button
                  onClick={openCreateSection}
                  className="btn-primary flex items-center gap-2"
                >
                  <MdAdd size={16} /> Create First Section
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {sections.map((section, sIdx) => (
                  <div
                    key={section._id}
                    className="card p-0 overflow-hidden transition-all duration-200"
                    style={{
                      borderColor: expanded[section._id]
                        ? "rgba(108,71,255,0.3)"
                        : "var(--color-border)",
                    }}
                  >
                    {/* Section Row */}
                    <div
                      className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-surface2 transition-colors select-none"
                      onClick={() => toggleSection(section._id)}
                    >
                      <MdDragIndicator
                        size={16}
                        className="text-muted shrink-0"
                      />

                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                        style={{
                          background: "rgba(108,71,255,0.12)",
                          color: "var(--color-primary)",
                        }}
                      >
                        {sIdx + 1}
                      </div>

                      <span className="flex-1 font-medium text-sm">
                        {section.title}
                      </span>

                      <span className="text-xs text-muted shrink-0">
                        {(lessons[section._id] || []).length} lessons
                      </span>

                      {/* Section actions */}
                      <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={(e) => openEditSection(e, section)}
                          className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-surface transition-colors"
                          title="Edit section"
                        >
                          <MdEdit size={15} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteSection(e, section._id)}
                          className="p-1.5 rounded-lg text-muted hover:text-danger transition-colors"
                          title="Delete section"
                        >
                          <MdDelete size={15} />
                        </button>
                        <button
                          onClick={(e) => openCreateLesson(e, section._id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ml-1"
                          style={{
                            background: "rgba(108,71,255,0.1)",
                            color: "var(--color-primary)",
                          }}
                          title="Add lesson"
                        >
                          <MdAdd size={13} /> Lesson
                        </button>
                      </div>

                      {expanded[section._id] ? (
                        <MdExpandLess
                          size={18}
                          className="text-muted shrink-0"
                        />
                      ) : (
                        <MdExpandMore
                          size={18}
                          className="text-muted shrink-0"
                        />
                      )}
                    </div>

                    {/* Lessons List */}
                    {expanded[section._id] && (
                      <div className="border-t border-border">
                        {!lessons[section._id] ? (
                          <div className="px-5 py-4 text-sm text-muted animate-pulse">
                            Loading lessons...
                          </div>
                        ) : lessons[section._id].length === 0 ? (
                          <div className="px-5 py-6 text-center">
                            <p className="text-sm text-muted mb-3">
                              No lessons in this section yet
                            </p>
                            <button
                              onClick={(e) => openCreateLesson(e, section._id)}
                              className="flex items-center gap-1.5 text-xs font-medium mx-auto transition-colors"
                              style={{ color: "var(--color-primary)" }}
                            >
                              <MdAdd size={14} /> Add first lesson
                            </button>
                          </div>
                        ) : (
                          lessons[section._id].map((lesson, lIdx) => (
                            <div
                              key={lesson._id}
                              className="flex items-center gap-3 px-5 py-3 border-b border-border last:border-b-0 hover:bg-surface2 transition-colors group"
                            >
                              <span className="text-xs text-muted w-5 shrink-0">
                                {lIdx + 1}.
                              </span>

                              <MdPlayCircle
                                size={16}
                                className="shrink-0"
                                style={{ color: "var(--color-primary)" }}
                              />

                              <span className="flex-1 text-sm">
                                {lesson.title}
                              </span>

                              <div className="flex items-center gap-2 shrink-0">
                                {lesson.videoUrl && (
                                  <span
                                    className="badge"
                                    style={{
                                      background: "rgba(108,71,255,0.1)",
                                      color: "var(--color-primary)",
                                    }}
                                  >
                                    Video
                                  </span>
                                )}
                                {lesson.pdfUrl && (
                                  <span
                                    className="badge"
                                    style={{
                                      background: "rgba(255,107,107,0.1)",
                                      color: "var(--color-danger)",
                                    }}
                                  >
                                    PDF
                                  </span>
                                )}
                                {lesson.duration && (
                                  <span className="text-xs text-muted">
                                    {lesson.duration}min
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() =>
                                    openEditLesson(lesson, section._id)
                                  }
                                  className="p-1.5 rounded-lg text-muted hover:text-text transition-colors"
                                >
                                  <MdEdit size={14} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteLesson(lesson, section._id)
                                  }
                                  className="p-1.5 rounded-lg text-muted hover:text-danger transition-colors"
                                >
                                  <MdDelete size={14} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}

                        {/* Add lesson button at bottom */}
                        {lessons[section._id]?.length > 0 && (
                          <div className="px-5 py-3 border-t border-border">
                            <button
                              onClick={(e) => openCreateLesson(e, section._id)}
                              className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                              style={{ color: "var(--color-primary)" }}
                            >
                              <MdAdd size={14} /> Add another lesson
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════
            STUDENTS TAB
        ══════════════════════════════════════════ */}
        {tab === "students" && (
          <div className="flex flex-col gap-8">
            {/* Pending requests */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-display font-bold">
                  Pending Requests
                </h2>
                {pending.length > 0 && (
                  <span
                    className="badge"
                    style={{
                      background: "rgba(251,191,36,0.15)",
                      color: "#fbbf24",
                    }}
                  >
                    {pending.length} waiting
                  </span>
                )}
              </div>

              {pending.length === 0 ? (
                <div
                  className="card py-10 text-center text-muted text-sm"
                  style={{ border: "1px dashed var(--color-border)" }}
                >
                  No pending requests
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {pending.map((enr) => (
                    <div
                      key={enr._id}
                      className="card flex items-center gap-4 py-3.5"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                        style={{ background: "var(--color-primary)" }}
                      >
                        {enr.userId?.username?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">
                          {enr.userId?.username}
                        </p>
                        <p className="text-xs text-muted truncate">
                          {enr.userId?.email}
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          Requested{" "}
                          {new Date(enr.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() =>
                            handleEnrollmentStatus(enr._id, "rejected")
                          }
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all hover:text-danger"
                          style={{
                            borderColor: "var(--color-border)",
                            color: "var(--color-muted)",
                          }}
                        >
                          <MdCancel size={15} /> Reject
                        </button>
                        <button
                          onClick={() =>
                            handleEnrollmentStatus(enr._id, "accepted")
                          }
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white transition-all"
                          style={{ background: "var(--color-primary)" }}
                        >
                          <MdCheckCircle size={15} /> Accept
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Enrolled students */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-display font-bold">
                  Enrolled Students
                </h2>
                <span className="text-muted font-normal text-sm">
                  ({accepted.length})
                </span>
              </div>

              {accepted.length === 0 ? (
                <div className="card py-10 text-center text-muted text-sm">
                  No enrolled students yet
                </div>
              ) : (
                <div className="card p-0 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr
                        className="border-b border-border text-xs uppercase tracking-wider"
                        style={{ color: "var(--color-muted)" }}
                      >
                        <th className="text-left px-5 py-3">Student</th>
                        <th className="text-left px-5 py-3">Progress</th>
                        <th className="text-left px-5 py-3">Enrolled</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {accepted.map((enr) => (
                        <tr
                          key={enr._id}
                          className="hover:bg-surface2 transition-colors"
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                                style={{ background: "var(--color-accent)" }}
                              >
                                {enr.userId?.username?.[0]?.toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {enr.userId?.username}
                                </p>
                                <p className="text-xs text-muted">
                                  {enr.userId?.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div
                                className="flex-1 h-1.5 rounded-full"
                                style={{
                                  background: "var(--color-border)",
                                  maxWidth: "120px",
                                }}
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
                              <span className="text-xs text-muted">
                                {enr.progress}%
                              </span>
                              {enr.progress === 100 && (
                                <MdCheckCircle
                                  size={14}
                                  style={{ color: "var(--color-accent)" }}
                                />
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-muted">
                            {new Date(enr.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Rejected */}
            {rejected.length > 0 && (
              <div>
                <h2 className="text-lg font-display font-bold mb-4 text-muted">
                  Rejected ({rejected.length})
                </h2>
                <div className="card p-0 overflow-hidden opacity-60">
                  {rejected.map((enr) => (
                    <div
                      key={enr._id}
                      className="flex items-center gap-3 px-5 py-3 border-b border-border last:border-b-0"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: "var(--color-danger)" }}
                      >
                        {enr.userId?.username?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {enr.userId?.username}
                        </p>
                        <p className="text-xs text-muted">
                          {enr.userId?.email}
                        </p>
                      </div>
                      <span
                        className="badge"
                        style={{
                          background: "rgba(255,107,107,0.1)",
                          color: "var(--color-danger)",
                        }}
                      >
                        Rejected
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          SECTION MODAL
      ══════════════════════════════════════════ */}
      {sectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-sm fade-up">
            <h2 className="text-lg font-display font-bold mb-5">
              {editingSection ? "Edit Section" : "New Section"}
            </h2>
            <form
              onSubmit={handleSectionSubmit}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-muted">Title *</label>
                <input
                  className="input"
                  value={sectionForm.title}
                  required
                  placeholder="e.g. Introduction to React"
                  onChange={(e) =>
                    setSectionForm({ ...sectionForm, title: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-muted">Order</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  value={sectionForm.order}
                  onChange={(e) =>
                    setSectionForm({
                      ...sectionForm,
                      order: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSectionModal(false);
                    setEditingSection(null);
                  }}
                  className="btn-ghost flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sectionLoading}
                  className="btn-primary flex-1"
                >
                  {sectionLoading
                    ? "Saving..."
                    : editingSection
                      ? "Save Changes"
                      : "Create Section"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          LESSON MODAL
      ══════════════════════════════════════════ */}
      {lessonModal && (
        <div className="fixed inset-0 z-50 flex bg-bg overflow-hidden">
          {/* Left panel — lesson settings */}
          <div
            className="w-80 shrink-0 flex flex-col border-r border-border overflow-y-auto"
            style={{ background: "var(--color-surface)" }}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <button
                onClick={() => {
                  setLessonModal(false);
                  setEditingLesson(null);
                }}
                className="p-2 rounded-lg bg-surface2 text-muted hover:text-text transition-colors"
              >
                <MdArrowBack size={18} />
              </button>
              <div>
                <p className="font-display font-bold text-sm">
                  {editingLesson ? "Edit Lesson" : "New Lesson"}
                </p>
                <p className="text-xs text-muted">
                  Fill details then build content →
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5 p-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted uppercase tracking-wider">
                  Title *
                </label>
                <input
                  className="input text-sm"
                  value={lessonForm.title}
                  required
                  placeholder="e.g. Introduction to Hooks"
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, title: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted uppercase tracking-wider">
                  Video URL
                </label>
                <input
                  className="input text-sm"
                  value={lessonForm.videoUrl}
                  placeholder="https://youtube.com/watch?v=..."
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, videoUrl: e.target.value })
                  }
                />
                <p className="text-xs text-muted">YouTube links supported</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted uppercase tracking-wider">
                  PDF Resource
                </label>
                <input
                  className="input text-sm"
                  value={lessonForm.pdfUrl}
                  placeholder="https://..."
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, pdfUrl: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted uppercase tracking-wider">
                  Duration (min)
                </label>
                <input
                  className="input text-sm"
                  type="number"
                  min="0"
                  value={lessonForm.duration}
                  placeholder="15"
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, duration: e.target.value })
                  }
                />
              </div>

              {/* Content summary */}
              <div
                className="rounded-xl p-4 flex flex-col gap-1"
                style={{ background: "var(--color-surface2)" }}
              >
                <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">
                  Content Blocks
                </p>
                <p className="text-2xl font-display font-bold">
                  {lessonForm.content.length}
                </p>
                <p className="text-xs text-muted">
                  {lessonForm.content.length === 0
                    ? "No blocks yet — add them on the right"
                    : lessonForm.content.map((b) => b.type).join(", ")}
                </p>
              </div>
            </div>

            <div className="mt-auto p-5 border-t border-border">
              <button
                onClick={handleLessonSubmit}
                disabled={lessonLoading || !lessonForm.title}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
              >
                {lessonLoading
                  ? "Saving..."
                  : editingLesson
                    ? "Save Changes"
                    : "Create Lesson"}
              </button>
            </div>
          </div>

          {/* Right panel — block editor */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div
              className="flex items-center justify-between px-8 py-4 border-b border-border shrink-0"
              style={{ background: "var(--color-surface)" }}
            >
              <div>
                <h2 className="font-display font-bold">
                  {lessonForm.title || "Untitled Lesson"}
                </h2>
                <p className="text-xs text-muted">
                  Build lesson content with blocks — students will see this
                  below the video
                </p>
              </div>
              <div className="flex items-center gap-2">
                {[
                  "heading",
                  "paragraph",
                  "code",
                  "callout",
                  "bulletList",
                  "divider",
                ]
                  .map((type) => (
                    <span
                      key={type}
                      className="badge text-xs"
                      style={{
                        background: "var(--color-surface2)",
                        color: "var(--color-muted)",
                      }}
                    >
                      {lessonForm.content.filter((b) => b.type === type)
                        .length > 0
                        ? `${lessonForm.content.filter((b) => b.type === type).length} ${type}`
                        : null}
                    </span>
                  ))
                  .filter(Boolean)}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="max-w-2xl mx-auto">
                <BlockEditor
                  blocks={lessonForm.content}
                  onChange={(content) =>
                    setLessonForm({ ...lessonForm, content })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
