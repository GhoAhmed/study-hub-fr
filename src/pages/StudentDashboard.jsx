import DashboardLayout from "../components/DashboardLayout";

const navItems = [
  { icon: "🏠", label: "Overview", path: "/student" },
  { icon: "📖", label: "My Courses", path: "/student/courses" },
  { icon: "🔍", label: "Browse", path: "/student/browse" },
  { icon: "📊", label: "Progress", path: "/student/progress" },
  { icon: "⚙️", label: "Settings", path: "/student/settings" },
];

export default function StudentDashboard() {
  return (
    <DashboardLayout navItems={navItems} role="student">
      <div className="fade-up">
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "Syne" }}>
          Student Dashboard
        </h1>
        <p style={{ color: "var(--muted)" }}>
          Track your progress and continue learning.
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
              Your enrolled courses will appear here.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
