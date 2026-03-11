import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { MdHourglassTop } from "react-icons/md";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [pending, setPending] = useState(false); // for pending approval UI
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPending(false);
    try {
      const res = await axios.post("http://localhost:3000/api/login", form);
      const token = res.data;
      const payload = JSON.parse(atob(token.split(".")[1]));
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(payload));
      toast.success("Welcome back!");
      if (payload.role === "instructor") navigate("/instructor");
      else if (payload.role === "admin") navigate("/admin");
      else navigate("/student");
    } catch (err) {
      const message = err.response?.data?.error || "Login failed";
      if (message.toLowerCase().includes("pending")) {
        setPending(true);
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg">
      <div className="w-full max-w-md fade-up">
        <Link to="/" className="inline-block mb-8">
          <span className="text-2xl font-display font-bold text-accent">
            StudyHub
          </span>
        </Link>

        <div className="card">
          <h2 className="text-3xl font-display font-bold mb-1">Welcome back</h2>
          <p className="text-sm text-muted mb-8">
            Sign in to continue learning
          </p>

          {/* Pending approval banner — kept inline since it's persistent UI */}
          {pending && (
            <div
              className="flex gap-3 p-4 rounded-xl text-sm mb-6"
              style={{
                background: "rgba(108,71,255,0.1)",
                border: "1px solid rgba(108,71,255,0.3)",
                color: "var(--color-primary)",
              }}
            >
              <MdHourglassTop size={20} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-0.5">Pending Approval</p>
                <p style={{ opacity: 0.85 }}>
                  Your instructor account is awaiting admin approval.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted">Email</label>
              <input
                className="input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted">Password</label>
              <input
                className="input"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-muted">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-accent font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
