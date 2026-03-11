import { Link } from "react-router-dom";
import { MdStar, MdPeople, MdAccessTime } from "react-icons/md";

const levelColors = {
  beginner: { bg: "rgba(0,229,176,0.12)", color: "var(--color-accent)" },
  intermediate: { bg: "rgba(108,71,255,0.12)", color: "var(--color-primary)" },
  advanced: { bg: "rgba(255,107,107,0.12)", color: "var(--color-danger)" },
};

export default function CourseCard({ course }) {
  const level = levelColors[course.level] || levelColors.beginner;

  return (
    <Link to={`/courses/${course._id}`} className="group block">
      <div
        className="card p-0 overflow-hidden hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        style={{ "--tw-shadow": "0 20px 60px rgba(108,71,255,0.15)" }}
      >
        {/* Thumbnail */}
        <div className="relative overflow-hidden h-48 bg-surface2">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">
              📚
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span
              className="badge"
              style={{ background: level.bg, color: level.color }}
            >
              {course.level}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span
              className="badge"
              style={{
                background: "rgba(0,0,0,0.6)",
                color: "#fff",
                backdropFilter: "blur(4px)",
              }}
            >
              {course.category}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-3">
          <h3 className="font-display font-bold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {course.title}
          </h3>
          <p className="text-xs text-muted line-clamp-2 leading-relaxed">
            {course.shortDescription}
          </p>

          <div className="flex items-center gap-1 text-xs text-muted">
            <span>by</span>
            <span className="font-medium text-text">
              {course.instructor?.username}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-muted pt-1">
            <span className="flex items-center gap-1">
              <MdStar size={14} style={{ color: "#fbbf24" }} />
              <span className="font-semibold text-text">
                {course.rating?.toFixed(1)}
              </span>
              <span>({course.totalRatings?.toLocaleString()})</span>
            </span>
            <span className="flex items-center gap-1">
              <MdPeople size={14} />
              {course.enrolledCount?.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <MdAccessTime size={14} />
              {course.totalDuration}m
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border mt-1">
            <span className="text-xl font-display font-bold">
              {course.price === 0 ? (
                <span style={{ color: "var(--color-accent)" }}>Free</span>
              ) : (
                `$${course.price}`
              )}
            </span>
            <span className="text-xs text-muted">
              {course.totalLessons} lessons
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
