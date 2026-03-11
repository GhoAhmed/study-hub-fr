import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { instructorNavItems } from "./InstructorDashboard";
import axios from "axios";
import { MdAdd, MdClose, MdArrowBack, MdSave } from "react-icons/md";

const api = (token) =>
  axios.create({
    baseURL: "http://localhost:3000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

const EMPTY = {
  title: "",
  shortDescription: "",
  description: "",
  price: "",
  thumbnail: "",
  previewVideo: "",
  category: "",
  level: "beginner",
  language: "English",
  tags: [],
  whatYouWillLearn: [],
  requirements: [],
  isPublished: false,
};

const categories = [
  "Web Development",
  "Data Science",
  "Design",
  "Mobile Development",
  "Cloud Computing",
  "Programming",
];

// Reusable tag-style list input
function ListInput({ label, items, onChange, placeholder }) {
  const [val, setVal] = useState("");
  const add = () => {
    const trimmed = val.trim();
    if (trimmed && !items.includes(trimmed)) {
      onChange([...items, trimmed]);
      setVal("");
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-muted">{label}</label>
      <div className="flex gap-2">
        <input
          className="input flex-1"
          value={val}
          placeholder={placeholder}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
        />
        <button type="button" onClick={add} className="btn-ghost px-3 py-2">
          <MdAdd size={18} />
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {items.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: "var(--color-surface2)",
                border: "1px solid var(--color-border)",
              }}
            >
              {item}
              <button
                type="button"
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              >
                <MdClose size={12} className="text-muted hover:text-danger" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function InstructorCourseForm() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { id } = useParams(); // edit mode if id exists
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    api(token)
      .get(`/courses/${id}`)
      .then((r) => {
        const c = r.data;
        setForm({
          title: c.title || "",
          shortDescription: c.shortDescription || "",
          description: c.description || "",
          price: c.price ?? "",
          thumbnail: c.thumbnail || "",
          previewVideo: c.previewVideo || "",
          category: c.category || "",
          level: c.level || "beginner",
          language: c.language || "English",
          tags: c.tags || [],
          whatYouWillLearn: c.whatYouWillLearn || [],
          requirements: c.requirements || [],
          isPublished: c.isPublished || false,
        });
      })
      .catch(() => navigate("/instructor/courses"))
      .finally(() => setFetching(false));
  }, [id]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = { ...form, price: Number(form.price) };
      if (isEdit) await api(token).put(`/courses/${id}`, payload);
      else await api(token).post("/courses", payload);
      navigate("/instructor/courses");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <DashboardLayout navItems={instructorNavItems} role="instructor">
        <div className="flex items-center justify-center h-64 text-muted animate-pulse font-display text-lg">
          Loading...
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout navItems={instructorNavItems} role="instructor">
      <div className="fade-up max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/instructor/courses")}
            className="p-2 rounded-lg bg-surface2 text-muted hover:text-text transition-colors"
          >
            <MdArrowBack size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-display font-bold">
              {isEdit ? "Edit Course" : "Create New Course"}
            </h1>
            <p className="text-sm text-muted mt-0.5">
              {isEdit
                ? "Update your course details"
                : "Fill in the details to publish your course"}
            </p>
          </div>
        </div>

        {error && (
          <div
            className="p-4 rounded-xl text-sm mb-6"
            style={{
              background: "rgba(255,107,107,0.1)",
              border: "1px solid rgba(255,107,107,0.3)",
              color: "var(--color-danger)",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Basic Info */}
          <div className="card flex flex-col gap-5">
            <h2 className="text-lg font-display font-bold border-b border-border pb-3">
              Basic Information
            </h2>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted">Course Title *</label>
              <input
                className="input"
                placeholder="e.g. Complete React Developer 2025"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted">
                Short Description{" "}
                <span className="text-xs">(max 160 chars)</span>
              </label>
              <input
                className="input"
                placeholder="One-line hook to attract students"
                maxLength={160}
                value={form.shortDescription}
                onChange={(e) => set("shortDescription", e.target.value)}
              />
              <span className="text-xs text-muted text-right">
                {form.shortDescription.length}/160
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted">Full Description *</label>
              <textarea
                className="input min-h-[140px] resize-y"
                placeholder="Describe what students will get from this course..."
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted">Category *</label>
                <select
                  className="input"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted">Level *</label>
                <select
                  className="input"
                  value={form.level}
                  onChange={(e) => set("level", e.target.value)}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted">Price ($) *</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="49.99"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted">Language</label>
                <input
                  className="input"
                  placeholder="English"
                  value={form.language}
                  onChange={(e) => set("language", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="card flex flex-col gap-5">
            <h2 className="text-lg font-display font-bold border-b border-border pb-3">
              Media
            </h2>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted">Thumbnail URL</label>
              <input
                className="input"
                placeholder="https://..."
                value={form.thumbnail}
                onChange={(e) => set("thumbnail", e.target.value)}
              />
              {form.thumbnail && (
                <img
                  src={form.thumbnail}
                  alt="preview"
                  className="w-full h-40 object-cover rounded-xl mt-1 border border-border"
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted">Preview Video URL</label>
              <input
                className="input"
                placeholder="https://youtube.com/..."
                value={form.previewVideo}
                onChange={(e) => set("previewVideo", e.target.value)}
              />
            </div>
          </div>

          {/* Content */}
          <div className="card flex flex-col gap-5">
            <h2 className="text-lg font-display font-bold border-b border-border pb-3">
              Course Content
            </h2>
            <ListInput
              label="Tags"
              items={form.tags}
              onChange={(v) => set("tags", v)}
              placeholder="e.g. react, javascript..."
            />
            <ListInput
              label="What students will learn"
              items={form.whatYouWillLearn}
              onChange={(v) => set("whatYouWillLearn", v)}
              placeholder="e.g. Build REST APIs with Node.js"
            />
            <ListInput
              label="Requirements"
              items={form.requirements}
              onChange={(v) => set("requirements", v)}
              placeholder="e.g. Basic JavaScript knowledge"
            />
          </div>

          {/* Publish toggle */}
          <div className="card flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Publish Course</p>
              <p className="text-xs text-muted mt-0.5">
                Make this course visible to all students
              </p>
            </div>
            <button
              type="button"
              onClick={() => set("isPublished", !form.isPublished)}
              className="relative w-12 h-6 rounded-full transition-all duration-300 shrink-0"
              style={{
                background: form.isPublished
                  ? "var(--color-primary)"
                  : "var(--color-border)",
              }}
            >
              <span
                className="absolute top-1 transition-all duration-300 w-4 h-4 rounded-full bg-white"
                style={{ left: form.isPublished ? "28px" : "4px" }}
              />
            </button>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/instructor/courses")}
              className="btn-ghost flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <MdSave size={18} />
              {loading
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
