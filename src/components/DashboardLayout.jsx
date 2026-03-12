import { useState, useEffect } from "react";
import { LuLogOut } from "react-icons/lu";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";

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

  useEffect(() => {
    const handleResize = () => {
      const mobile = isMobileScreen();
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isMobile) setCollapsed(true);
  }, [location.pathname]);

  const logout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const sidebarOpen = !collapsed;

  return (
    // ✅ h-screen + overflow-hidden on root to prevent page scroll bleeding
    <div className="flex h-screen overflow-hidden bg-bg relative">
      {/* Backdrop — mobile only */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className="flex flex-col border-r border-border bg-surface shrink-0 z-30 transition-all duration-300"
        style={{
          width: sidebarOpen ? "240px" : "72px",
          // ✅ desktop: relative in normal flow, full height via flex parent
          // ✅ mobile: fixed overlay, full viewport height
          position: isMobile ? "fixed" : "relative",
          top: isMobile ? 0 : "auto",
          left: isMobile ? (sidebarOpen ? 0 : "-72px") : "auto",
          height: isMobile ? "100vh" : "100%",
          transform:
            isMobile && !sidebarOpen ? "translateX(-100%)" : "translateX(0)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-border shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: color }}
          >
            <span className="text-white font-display font-bold text-sm">S</span>
          </div>
          {sidebarOpen && (
            <Link to="/" className="text-lg font-display font-bold text-accent">
              StudyHub
            </Link>
          )}
        </div>

        {/* Nav — scrollable if items overflow */}
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
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
                        color,
                      }
                    : {}
                }
              >
                <span className="shrink-0">{icon}</span>
                {sidebarOpen && <span>{label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User + Logout — always pinned to bottom */}
        <div className="px-3 py-4 border-t border-border flex flex-col gap-1 shrink-0">
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
            <span className="shrink-0">
              <LuLogOut size={18} />
            </span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface shrink-0">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg bg-surface2 text-muted hover:text-text transition-colors text-sm"
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

        {/* ✅ Only the content area scrolls */}
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
