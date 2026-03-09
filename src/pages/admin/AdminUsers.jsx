import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { navItems } from "./AdminDashboard";
import axios from "axios";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdBlock,
  MdCheckCircle,
  MdSearch,
} from "react-icons/md";

const api = (token) =>
  axios.create({
    baseURL: "http://localhost:3000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

const EMPTY_FORM = { username: "", email: "", password: "", role: "student" };

export default function AdminUsers() {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [modal, setModal] = useState(null); // null | "create" | "edit"
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({ page, limit: 8 });
      if (search) params.append("search", search);
      if (roleFilter) params.append("role", roleFilter);
      const res = await api(token).get(`/admin/users?${params}`);
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch {
      /* empty */
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setError("");
    setModal("create");
  };
  const openEdit = (u) => {
    setSelected(u);
    setForm({
      username: u.username,
      email: u.email,
      password: "",
      role: u.role,
    });
    setError("");
    setModal("edit");
  };
  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (modal === "create") {
        await api(token).post("/admin/users", form);
      } else {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        await api(token).put(`/admin/users/${selected._id}`, payload);
      }
      closeModal();
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    await api(token).delete(`/admin/users/${id}`);
    fetchUsers();
  };

  const handleToggle = async (id) => {
    await api(token).patch(`/admin/users/${id}/toggle-status`);
    fetchUsers();
  };

  const totalPages = Math.ceil(total / 8);

  return (
    <DashboardLayout navItems={navItems} role="admin">
      <div className="fade-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold">Users</h1>
            <p className="text-muted text-sm mt-1">{total} total users</p>
          </div>
          <button
            onClick={openCreate}
            className="btn-primary flex items-center gap-2"
          >
            <MdAdd size={18} /> New User
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-2 input max-w-xs">
            <MdSearch size={18} className="text-muted shrink-0" />
            <input
              className="bg-transparent outline-none text-sm w-full"
              placeholder="Search users..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="input max-w-[150px]"
          >
            <option value="">All roles</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Table */}
        <div className="card p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-4">User</th>
                <th className="text-left px-5 py-4">Role</th>
                <th className="text-left px-5 py-4">Status</th>
                <th className="text-right px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-surface2 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{
                          background:
                            u.role === "admin"
                              ? "var(--color-danger)"
                              : u.role === "instructor"
                                ? "var(--color-primary)"
                                : "var(--color-accent)",
                        }}
                      >
                        {u.username[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{u.username}</div>
                        <div className="text-muted text-xs">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="badge"
                      style={{
                        background:
                          u.role === "admin"
                            ? "rgba(255,107,107,0.12)"
                            : u.role === "instructor"
                              ? "rgba(108,71,255,0.12)"
                              : "rgba(0,229,176,0.12)",
                        color:
                          u.role === "admin"
                            ? "var(--color-danger)"
                            : u.role === "instructor"
                              ? "var(--color-primary)"
                              : "var(--color-accent)",
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="badge"
                      style={{
                        background: u.isActive
                          ? "rgba(0,229,176,0.1)"
                          : "rgba(255,107,107,0.1)",
                        color: u.isActive
                          ? "var(--color-accent)"
                          : "var(--color-danger)",
                      }}
                    >
                      {u.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(u)}
                        title="Edit"
                        className="p-1.5 rounded-lg hover:bg-surface transition-colors text-muted hover:text-text"
                      >
                        <MdEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleToggle(u._id)}
                        title={u.isActive ? "Disable" : "Enable"}
                        className="p-1.5 rounded-lg hover:bg-surface transition-colors"
                        style={{
                          color: u.isActive
                            ? "var(--color-danger)"
                            : "var(--color-accent)",
                        }}
                      >
                        {u.isActive ? (
                          <MdBlock size={16} />
                        ) : (
                          <MdCheckCircle size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        title="Delete"
                        className="p-1.5 rounded-lg hover:bg-surface transition-colors text-muted hover:text-danger"
                      >
                        <MdDelete size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="py-16 text-center text-muted">No users found.</div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 text-sm text-muted">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-ghost px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-ghost px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-md fade-up">
            <h2 className="text-xl font-display font-bold mb-6">
              {modal === "create" ? "Create User" : "Edit User"}
            </h2>

            {error && (
              <div
                className="p-3 rounded-xl text-sm mb-4"
                style={{
                  background: "rgba(255,107,107,0.1)",
                  border: "1px solid rgba(255,107,107,0.3)",
                  color: "var(--color-danger)",
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {[
                ["username", "Username", "text"],
                ["email", "Email", "email"],
                [
                  "password",
                  modal === "edit" ? "New Password (optional)" : "Password",
                  "password",
                ],
              ].map(([name, label, type]) => (
                <div key={name} className="flex flex-col gap-1.5">
                  <label className="text-sm text-muted">{label}</label>
                  <input
                    className="input"
                    type={type}
                    value={form[name]}
                    required={!(modal === "edit" && name === "password")}
                    onChange={(e) =>
                      setForm({ ...form, [name]: e.target.value })
                    }
                  />
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-muted">Role</label>
                <select
                  className="input"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-ghost flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading
                    ? "Saving..."
                    : modal === "create"
                      ? "Create"
                      : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
