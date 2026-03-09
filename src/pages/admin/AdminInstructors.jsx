import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { navItems } from "./AdminDashboard";
import axios from "axios";
import { MdCheckCircle, MdCancel, MdPerson } from "react-icons/md";

const api = (token) =>
  axios.create({
    baseURL: "http://localhost:3000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

export default function AdminInstructors() {
  const token = localStorage.getItem("token");
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPending = async () => {
    const res = await api(token).get("/admin/instructors/pending");
    setPending(res.data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPending();
  }, []);

  const approve = async (id) => {
    setLoading(true);
    await api(token).patch(`/admin/instructors/${id}/approve`);
    fetchPending();
    setLoading(false);
  };

  const reject = async (id) => {
    if (!confirm("Reject and delete this instructor account?")) return;
    await api(token).delete(`/admin/instructors/${id}/reject`);
    fetchPending();
  };

  return (
    <DashboardLayout navItems={navItems} role="admin">
      <div className="fade-up">
        <h1 className="text-3xl font-display font-bold mb-1">
          Instructor Approvals
        </h1>
        <p className="text-muted text-sm mb-8">
          {pending.length} instructor{pending.length !== 1 ? "s" : ""} waiting
          for approval
        </p>

        {pending.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-20 text-center">
            <MdCheckCircle
              size={48}
              className="mb-4"
              style={{ color: "var(--color-accent)" }}
            />
            <p className="text-lg font-display font-semibold">All caught up!</p>
            <p className="text-muted text-sm mt-1">
              No pending instructor approvals.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pending.map((u) => (
              <div key={u._id} className="card flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0"
                    style={{ background: "var(--color-primary)" }}
                  >
                    {u.username[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold">{u.username}</div>
                    <div className="text-xs text-muted">{u.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted">
                  <MdPerson size={14} />
                  <span>
                    Applied {new Date(u.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => reject(u._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all border border-border text-muted hover:text-danger hover:border-danger/40"
                  >
                    <MdCancel size={16} /> Reject
                  </button>
                  <button
                    onClick={() => approve(u._id)}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all text-white"
                    style={{ background: "var(--color-primary)" }}
                  >
                    <MdCheckCircle size={16} /> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
