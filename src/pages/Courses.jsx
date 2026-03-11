import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import CourseCard from "../components/CourseCard";
import { MdSearch, MdFilterList, MdClose } from "react-icons/md";

const categories = [
  "Web Development",
  "Data Science",
  "Design",
  "Mobile Development",
  "Cloud Computing",
  "Programming",
];
const levels = ["beginner", "intermediate", "advanced"];

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const level = searchParams.get("level") || "";
  const page = Number(searchParams.get("page") || 1);

  const set = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val);
    else p.delete(key);
    p.delete("page");
    setSearchParams(p);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 9 });
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (level) params.append("level", level);

    axios
      .get(`http://localhost:3000/api/courses?${params}`)
      .then((r) => {
        setCourses(r.data.courses || []);
        setTotal(r.data.total || 0);
        setTotalPages(r.data.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [search, category, level, page]);

  const clearFilters = () => setSearchParams({});
  const hasFilters = search || category || level;

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-display font-bold mb-2">All Courses</h1>
          <p className="text-muted">{total} courses available</p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="flex items-center gap-2 input flex-1 max-w-md">
            <MdSearch size={18} className="text-muted shrink-0" />
            <input
              className="bg-transparent outline-none text-sm w-full"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => set("search", e.target.value)}
            />
            {search && (
              <MdClose
                size={16}
                className="text-muted cursor-pointer"
                onClick={() => set("search", "")}
              />
            )}
          </div>

          <select
            value={category}
            onChange={(e) => set("category", e.target.value)}
            className="input max-w-[200px]"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={level}
            onChange={(e) => set("level", e.target.value)}
            className="input max-w-[160px]"
          >
            <option value="">All Levels</option>
            {levels.map((l) => (
              <option key={l} value={l} className="capitalize">
                {l}
              </option>
            ))}
          </select>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="btn-ghost flex items-center gap-2 text-sm px-4"
            >
              <MdFilterList size={16} /> Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="card p-0 overflow-hidden animate-pulse">
                  <div className="h-48 bg-surface2" />
                  <div className="p-5 flex flex-col gap-3">
                    <div className="h-4 bg-surface2 rounded w-3/4" />
                    <div className="h-3 bg-surface2 rounded w-full" />
                    <div className="h-3 bg-surface2 rounded w-1/2" />
                  </div>
                </div>
              ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-28 text-muted">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg font-display font-semibold mb-2">
              No courses found
            </p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button
              disabled={page === 1}
              onClick={() => {
                const p = new URLSearchParams(searchParams);
                p.set("page", page - 1);
                setSearchParams(p);
              }}
              className="btn-ghost px-5 py-2 text-sm disabled:opacity-40"
            >
              Prev
            </button>
            <span className="text-sm text-muted">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => {
                const p = new URLSearchParams(searchParams);
                p.set("page", page + 1);
                setSearchParams(p);
              }}
              className="btn-ghost px-5 py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
