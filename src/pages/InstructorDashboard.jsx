import {
  MdAddBox,
  MdDashboard,
  MdMenuBook,
  MdPeople,
  MdSettings,
} from "react-icons/md";
import DashboardLayout from "../components/DashboardLayout";

const navItems = [
  { icon: <MdDashboard size={20} />, label: "Overview", path: "/instructor" },
  {
    icon: <MdMenuBook size={20} />,
    label: "My Courses",
    path: "/instructor/courses",
  },
  {
    icon: <MdAddBox size={20} />,
    label: "Create Course",
    path: "/instructor/create",
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

export default function InstructorDashboard() {
  return (
    <DashboardLayout navItems={navItems} role="instructor">
      <div className="fade-up">
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "Syne" }}>
          Instructor Dashboard
        </h1>
        <p style={{ color: "var(--muted)" }}>
          Manage your courses and students from here.
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
              Your instructor tools will appear here.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
