import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:3000/api/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg">
      <div className="w-full max-w-md fade-up">
        <Link to="/" className="inline-block mb-8">
          <span className="text-2xl font-display font-bold text-accent">
            LearnFlow
          </span>
        </Link>

        <div className="card">
          <h2 className="text-3xl font-display font-bold mb-1">
            Create account
          </h2>
          <p className="text-sm text-muted mb-8">
            Start your learning journey today
          </p>

          {error && (
            <div
              className="p-3 rounded-xl text-sm mb-6"
              style={{
                background: "rgba(255,107,107,0.1)",
                border: "1px solid rgba(255,107,107,0.3)",
                color: "var(--color-danger)",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {[
              ["username", "Username", "text", "ahmed123"],
              ["email", "Email", "email", "you@example.com"],
              ["password", "Password", "password", "••••••••"],
            ].map(([name, label, type, placeholder]) => (
              <div key={name} className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted">
                  {label}
                </label>
                <input
                  className="input"
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required
                  placeholder={placeholder}
                />
              </div>
            ))}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted">
                I want to
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["student", "📚 Learn"],
                  ["instructor", "🎓 Teach"],
                ].map(([r, label]) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setForm({ ...form, role: r })}
                    className="py-3 rounded-xl text-sm font-medium transition-all border"
                    style={{
                      borderColor:
                        form.role === r
                          ? "var(--color-primary)"
                          : "var(--color-border)",
                      background:
                        form.role === r
                          ? "rgba(108,71,255,0.12)"
                          : "var(--color-surface2)",
                      color:
                        form.role === r
                          ? "var(--color-text)"
                          : "var(--color-muted)",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-2"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-muted">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-accent font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
