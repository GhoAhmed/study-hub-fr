import DashboardLayout from "../../components/DashboardLayout";
import {
  MdDashboard,
  MdPeople,
  MdSchool,
  MdMenuBook,
  MdSettings,
} from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";

const navItems = [
  { icon: <MdDashboard size={20} />, label: "Overview", path: "/admin" },
  { icon: <MdPeople size={20} />, label: "Users", path: "/admin/users" },
  {
    icon: <MdSchool size={20} />,
    label: "Instructors",
    path: "/admin/instructors",
  },
  { icon: <MdMenuBook size={20} />, label: "Courses", path: "/admin/courses" },
  {
    icon: <MdSettings size={20} />,
    label: "Settings",
    path: "/admin/settings",
  },
];

// eslint-disable-next-line react-refresh/only-export-components
export { navItems };

const StatCard = ({ label, value, color }) => (
  <div className="card flex flex-col gap-2">
    <span className="text-sm text-muted">{label}</span>
    <span className="text-4xl font-display font-bold" style={{ color }}>
      {value ?? "—"}
    </span>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setStats(r.data))
      .catch(() => {});
  }, []);

  return (
    <DashboardLayout navItems={navItems} role="admin">
      <div className="fade-up">
        <h1 className="text-4xl font-display font-bold mb-1">Overview</h1>
        <p className="text-muted mb-8">Platform stats at a glance</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Users"
            value={stats?.totalUsers}
            color="var(--color-text)"
          />
          <StatCard
            label="Students"
            value={stats?.totalStudents}
            color="var(--color-accent)"
          />
          <StatCard
            label="Instructors"
            value={stats?.totalInstructors}
            color="var(--color-primary)"
          />
          <StatCard
            label="Pending Approvals"
            value={stats?.pendingInstructors}
            color="var(--color-danger)"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
