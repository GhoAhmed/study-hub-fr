import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/DashboardLayout";
import { studentNavItems } from "./StudentDashboard";
import {
  MdArrowBack,
  MdPlayCircle,
  MdPictureAsPdf,
  MdCheckCircle,
  MdExpandMore,
  MdExpandLess,
  MdLock,
} from "react-icons/md";

const api = (token) =>
  axios.create({
    baseURL: "http://localhost:3000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

export default function StudentCourseView() {
  const { id } = useParams(); // enrollment id
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [enrollment, setEnrollment] = useState(null);
  const [sections, setSections] = useState([]);
  const [lessons, setLessons] = useState({});
  const [activeLesson, setActiveLesson] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // get enrollment
        const enrRes = await api(token).get("/enrollments/me");
        const enr = enrRes.data.find((e) => e._id === id);
        if (!enr || enr.status !== "accepted") {
          navigate("/student");
          return;
        }
        setEnrollment(enr);

        // get sections
        const secRes = await api(token).get(
          `/courses/${enr.courseId._id}/sections`,
        );
        const secs = secRes.data.sort((a, b) => a.order - b.order);
        setSections(secs);

        // get all lessons for all sections
        const allLessons = {};
        await Promise.all(
          secs.map(async (s) => {
            const res = await api(token).get(`/sections/${s._id}/lessons`);
            allLessons[s._id] = res.data;
          }),
        );
        setLessons(allLessons);

        // expand first section and set active lesson
        if (secs.length > 0) {
          setExpanded({ [secs[0]._id]: true });
          const firstLesson = allLessons[secs[0]._id]?.[0];
          if (firstLesson) setActiveLesson(firstLesson);
        }
      } catch {
        navigate("/student");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const allLessons = sections.flatMap((s) => lessons[s._id] || []);
  const totalLessons = allLessons.length;

  const markComplete = async (lessonId) => {
    const newCompleted = new Set(completedLessons);
    newCompleted.add(lessonId);
    setCompletedLessons(newCompleted);

    const progress = Math.round((newCompleted.size / totalLessons) * 100);
    try {
      await api(token).put(`/enrollments/${id}/progress`, { progress });
      if (progress === 100)
        toast.success("🎉 Course completed! Congratulations!");
    } catch {
      /* empty */
    }
  };

  const getYouTubeEmbed = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  if (loading)
    return (
      <DashboardLayout navItems={studentNavItems} role="student">
        <div className="flex items-center justify-center h-64 text-muted animate-pulse font-display text-lg">
          Loading course...
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout navItems={studentNavItems} role="student">
      <div
        className="flex gap-6 h-full fade-up"
        style={{ minHeight: "calc(100vh - 80px)" }}
      >
        {/* Sidebar — course outline */}
        <aside className="w-72 shrink-0 flex flex-col gap-3">
          <button
            onClick={() => navigate("/student")}
            className="flex items-center gap-2 text-sm text-muted hover:text-text transition-colors mb-2"
          >
            <MdArrowBack size={16} /> Back to Dashboard
          </button>

          <div className="card p-4 mb-2">
            <h2 className="font-display font-bold text-sm line-clamp-2 mb-2">
              {enrollment?.courseId?.title}
            </h2>
            <div className="flex items-center justify-between text-xs text-muted mb-2">
              <span>
                {completedLessons.size}/{totalLessons} lessons
              </span>
              <span>{enrollment?.progress || 0}%</span>
            </div>
            <div
              className="h-1.5 rounded-full"
              style={{ background: "var(--color-border)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${enrollment?.progress || 0}%`,
                  background: "var(--color-accent)",
                }}
              />
            </div>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-2 overflow-auto">
            {sections.map((section) => (
              <div key={section._id} className="card p-0 overflow-hidden">
                <button
                  onClick={() =>
                    setExpanded((prev) => ({
                      ...prev,
                      [section._id]: !prev[section._id],
                    }))
                  }
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-surface2 transition-colors text-left"
                >
                  <span className="flex-1 line-clamp-1">{section.title}</span>
                  {expanded[section._id] ? (
                    <MdExpandLess size={16} className="text-muted shrink-0" />
                  ) : (
                    <MdExpandMore size={16} className="text-muted shrink-0" />
                  )}
                </button>

                {expanded[section._id] &&
                  (lessons[section._id] || []).map((lesson) => {
                    const isActive = activeLesson?._id === lesson._id;
                    const isDone = completedLessons.has(lesson._id);
                    return (
                      <button
                        key={lesson._id}
                        onClick={() => setActiveLesson(lesson)}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-left border-t border-border transition-colors"
                        style={{
                          background: isActive
                            ? "rgba(108,71,255,0.1)"
                            : "transparent",
                          color: isActive
                            ? "var(--color-primary)"
                            : isDone
                              ? "var(--color-accent)"
                              : "var(--color-muted)",
                        }}
                      >
                        {isDone ? (
                          <MdCheckCircle
                            size={14}
                            style={{ color: "var(--color-accent)", shrink: 0 }}
                          />
                        ) : (
                          <MdPlayCircle size={14} className="shrink-0" />
                        )}
                        <span className="line-clamp-2 flex-1">
                          {lesson.title}
                        </span>
                        {lesson.duration && (
                          <span className="shrink-0 text-muted">
                            {lesson.duration}m
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          {activeLesson ? (
            <>
              {/* Video */}
              {activeLesson.videoUrl && (
                <div
                  className="rounded-2xl overflow-hidden border border-border"
                  style={{ aspectRatio: "16/9" }}
                >
                  <iframe
                    src={getYouTubeEmbed(activeLesson.videoUrl)}
                    className="w-full h-full"
                    allowFullScreen
                    title={activeLesson.title}
                  />
                </div>
              )}

              {/* Lesson info */}
              <div className="card flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-display font-bold">
                      {activeLesson.title}
                    </h2>
                    {activeLesson.duration && (
                      <p className="text-sm text-muted mt-1">
                        {activeLesson.duration} minutes
                      </p>
                    )}
                  </div>

                  {completedLessons.has(activeLesson._id) ? (
                    <span
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium shrink-0"
                      style={{
                        background: "rgba(0,229,176,0.12)",
                        color: "var(--color-accent)",
                      }}
                    >
                      <MdCheckCircle size={16} /> Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => markComplete(activeLesson._id)}
                      className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5 shrink-0"
                    >
                      <MdCheckCircle size={16} /> Mark Complete
                    </button>
                  )}
                </div>

                {/* PDF */}
                {activeLesson.pdfUrl && (
                  <a
                    href={activeLesson.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/40 transition-all group"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: "rgba(255,107,107,0.12)",
                        color: "var(--color-danger)",
                      }}
                    >
                      <MdPictureAsPdf size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        Download PDF Resource
                      </p>
                      <p className="text-xs text-muted">
                        Supplementary material for this lesson
                      </p>
                    </div>
                  </a>
                )}
              </div>

              {/* Next lesson */}
              {(() => {
                const idx = allLessons.findIndex(
                  (l) => l._id === activeLesson._id,
                );
                const next = allLessons[idx + 1];
                return next ? (
                  <button
                    onClick={() => setActiveLesson(next)}
                    className="card flex items-center gap-4 hover:border-primary/40 transition-all group text-left"
                  >
                    <div>
                      <p className="text-xs text-muted mb-0.5">Up next</p>
                      <p className="font-medium text-sm group-hover:text-primary transition-colors">
                        {next.title}
                      </p>
                    </div>
                    <MdPlayCircle
                      size={24}
                      className="ml-auto shrink-0"
                      style={{ color: "var(--color-primary)" }}
                    />
                  </button>
                ) : null;
              })()}
            </>
          ) : (
            <div className="card flex flex-col items-center py-20 text-center">
              <MdLock size={48} className="mb-4 text-muted" />
              <p className="font-display font-bold text-lg mb-1">
                Select a lesson
              </p>
              <p className="text-sm text-muted">
                Choose a lesson from the sidebar to start learning
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
