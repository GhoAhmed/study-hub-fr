import { useState, useEffect } from "react";
import { LuLogOut } from "react-icons/lu";
import { useNavigate, useLocation, Link } from "react-router-dom";

const roleAccent = {
  instructor: { color: "var(--color-primary)", rgb: "108,71,255" },
  student: { color: "var(--color-accent)", rgb: "0,229,176" },
  admin: { color: "var(--color-danger)", rgb: "255,107,107" },
};

export default function DashboardLayout({ children, navItems, role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { color, rgb } = roleAccent[role] || roleAccent.student;

  const isMobileScreen = () => window.innerWidth < 768;
  const [collapsed, setCollapsed] = useState(isMobileScreen());
  const [isMobile, setIsMobile] = useState(isMobileScreen());

  // Sync on resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = isMobileScreen();
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isMobile) setCollapsed(true);
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const sidebarOpen = !collapsed;

  return (
    <div className="flex min-h-screen bg-bg relative">
      {/* Backdrop (mobile only) */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className="flex flex-col border-r border-border bg-surface transition-all duration-300 shrink-0 z-30"
        style={{
          width: sidebarOpen ? "240px" : "72px",
          // On mobile: float over content
          position: isMobile ? "fixed" : "relative",
          top: isMobile ? 0 : "auto",
          left: isMobile ? (sidebarOpen ? 0 : "-72px") : "auto",
          height: isMobile ? "100vh" : "auto",
          // Hide collapsed sidebar off-screen on mobile
          transform:
            isMobile && !sidebarOpen ? "translateX(-100%)" : "translateX(0)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: color }}
          >
            <span className="text-white font-display font-bold text-sm">L</span>
          </div>
          {sidebarOpen && (
            <span className="text-lg font-display font-bold text-accent">
              <Link to="/">StudyHub</Link>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
          {navItems.map(({ icon, label, path }) => {
            const active = location.pathname === path;
            return (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="nav-link"
                style={
                  active
                    ? {
                        background: `rgba(${rgb}, 0.1)`,
                        borderColor: `rgba(${rgb}, 0.25)`,
                        color: color,
                      }
                    : {}
                }
              >
                <span className="text-lg shrink-0">{icon}</span>
                {sidebarOpen && <span>{label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-border flex flex-col gap-1">
          {sidebarOpen && (
            <div className="flex items-center gap-3 px-3 py-2 mb-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 text-white"
                style={{ background: color }}
              >
                {user.email?.[0]?.toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-medium truncate">{user.email}</div>
                <div className="text-xs text-muted capitalize">{role}</div>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="nav-link text-muted hover:text-danger"
          >
            <span className="text-lg shrink-0">
              <LuLogOut />
            </span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main — never shifts on mobile */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface shrink-0">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg bg-surface2 text-muted hover:text-text transition-colors text-sm font-medium"
          >
            {sidebarOpen ? "←" : "☰"}
          </button>
          <span
            className="badge"
            style={{
              background: `rgba(${rgb},0.12)`,
              color,
              border: `1px solid rgba(${rgb},0.25)`,
            }}
          >
            {role}
          </span>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
