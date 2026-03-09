import {
  MdAnalytics,
  MdDashboard,
  MdMenuBook,
  MdPeople,
  MdSettings,
} from "react-icons/md";
import DashboardLayout from "../components/DashboardLayout";

const navItems = [
  { icon: <MdDashboard size={20} />, label: "Overview", path: "/admin" },
  { icon: <MdPeople size={20} />, label: "Users", path: "/admin/users" },
  { icon: <MdMenuBook size={20} />, label: "Courses", path: "/admin/courses" },
  {
    icon: <MdAnalytics size={20} />,
    label: "Analytics",
    path: "/admin/analytics",
  },
  {
    icon: <MdSettings size={20} />,
    label: "Settings",
    path: "/admin/settings",
  },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout navItems={navItems} role="admin">
      <div className="fade-up">
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "Syne" }}>
          Admin Dashboard
        </h1>
        <p style={{ color: "var(--muted)" }}>
          Full platform control and analytics.
        </p>

        <div
          className="mt-10 p-8 rounded-2xl flex items-center justify-center"
          style={{
            border: "1px dashed var(--border)",
            minHeight: "300px",
            background: "var(--surface)",
          }}
        >
          <div className="text-center">
            <div className="text-5xl mb-4">🚧</div>
            <p className="text-lg font-semibold" style={{ fontFamily: "Syne" }}>
              Coming soon
            </p>
            <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
              Platform management tools will appear here.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
