import { useState, useEffect, useRef } from "react";
import { LuLogOut } from "react-icons/lu";
import { MdHome, MdLogout, MdDashboard } from "react-icons/md";
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
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef(null);

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
  }, [isMobile, location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const sidebarOpen = !collapsed;

  return (
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

        {/* Nav */}
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

        {/* User + Logout */}
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

          {/* ── User dropdown ── */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdown(!dropdown)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all hover:bg-surface2"
              style={{ border: "1px solid var(--color-border)" }}
            >
              {/* Avatar */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: color }}
              >
                {user.email?.[0]?.toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-medium leading-none">
                  {user.email?.split("@")[0]}
                </p>
                <p className="text-xs capitalize mt-0.5" style={{ color }}>
                  {role}
                </p>
              </div>
              {/* Chevron */}
              <svg
                className="w-3 h-3 text-muted transition-transform"
                style={{
                  transform: dropdown ? "rotate(180deg)" : "rotate(0deg)",
                }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown menu */}
            {dropdown && (
              <div
                className="absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-2xl overflow-hidden z-50 fade-up"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {/* User info header */}
                <div className="px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                      style={{ background: color }}
                    >
                      {user.email?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.email?.split("@")[0]}
                      </p>
                      <p
                        className="text-xs truncate"
                        style={{ color: "var(--color-muted)" }}
                      >
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="p-1.5 flex flex-col gap-0.5">
                  <button
                    onClick={() => {
                      navigate("/");
                      setDropdown(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-surface2 transition-colors w-full text-left"
                    style={{ color: "var(--color-muted)" }}
                  >
                    <MdHome size={17} style={{ color }} />
                    Home
                  </button>

                  <div
                    className="h-px my-1"
                    style={{ background: "var(--color-border)" }}
                  />

                  <button
                    onClick={logout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-surface2 transition-colors w-full text-left"
                    style={{ color: "var(--color-danger)" }}
                  >
                    <MdLogout size={17} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
