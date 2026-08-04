"use client";

import { useState } from "react";
import type { UserRole } from "@/lib/types";

type SafeUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  company?: string;
  createdAt: string;
};

export function AdminUsersManager({ initial }: { initial: SafeUser[] }) {
  const [users, setUsers] = useState(initial);
  const [status, setStatus] = useState("");

  async function changeRole(id: string, role: UserRole) {
    setStatus("");
    const res = await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Update failed");
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: data.user.role } : u)),
    );
    setStatus("Role updated");
  }

  return (
    <div>
      {status && <p className="mb-4 text-sm text-amber-200">{status}</p>}
      <div className="overflow-x-auto border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wider text-white/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-white/10">
                <td className="px-4 py-3 text-white">{user.name}</td>
                <td className="px-4 py-3 text-white/70">{user.email}</td>
                <td className="px-4 py-3 text-white/55">{user.company || "—"}</td>
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      changeRole(user.id, e.target.value as UserRole)
                    }
                    className="border border-white/15 bg-stone-950 px-3 py-2 text-white"
                  >
                    <option value="customer">customer</option>
                    <option value="admin">admin</option>
                    <option value="superadmin">superadmin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
