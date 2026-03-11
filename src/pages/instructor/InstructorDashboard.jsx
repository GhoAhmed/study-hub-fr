import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  MdDashboard,
  MdMenuBook,
  MdAdd,
  MdPeople,
  MdSettings,
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

const StatCard = ({ label, value, color }) => (
  <div className="card flex flex-col gap-2">
    <span className="text-sm text-muted">{label}</span>
    <span className="text-4xl font-display font-bold" style={{ color }}>
      {value ?? "—"}
    </span>
  </div>
);

export default function InstructorDashboard() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/instructor/courses?limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => {
        const courses = r.data.courses || [];
        const totalEnrolled = courses.reduce(
          (a, c) => a + (c.enrolledCount || 0),
          0,
        );
        const avgRating = courses.length
          ? (
              courses.reduce((a, c) => a + (c.rating || 0), 0) / courses.length
            ).toFixed(1)
          : 0;
        setStats({
          total: courses.length,
          published: courses.filter((c) => c.isPublished).length,
          totalEnrolled,
          avgRating,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <DashboardLayout navItems={instructorNavItems} role="instructor">
      <div className="fade-up">
        <h1 className="text-4xl font-display font-bold mb-1">
          Welcome, {user.email?.split("@")[0]} 👋
        </h1>
        <p className="text-muted mb-8">
          Here's what's happening with your courses
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            label="Total Courses"
            value={stats?.total}
            color="var(--color-text)"
          />
          <StatCard
            label="Published"
            value={stats?.published}
            color="var(--color-accent)"
          />
          <StatCard
            label="Total Students"
            value={stats?.totalEnrolled}
            color="var(--color-primary)"
          />
          <StatCard
            label="Avg Rating"
            value={stats?.avgRating}
            color="#fbbf24"
          />
        </div>

        <div
          className="card flex flex-col items-center justify-center py-16 text-center"
          style={{ border: "1px dashed var(--color-border)" }}
        >
          <div className="text-5xl mb-4">📈</div>
          <p className="text-lg font-display font-semibold mb-1">
            More analytics coming soon
          </p>
          <p className="text-sm text-muted">
            Enrollment trends, revenue, and student activity
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
