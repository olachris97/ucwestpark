import { useState } from "react";
import type { FormEvent } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { LayoutDashboard, Inbox, CalendarRange, Tags, LogOut, ExternalLink } from "lucide-react";
import logo from "../../assets/logo.png";
import { isAuthenticated, login as apiLogin, logout as apiLogout } from "../../lib/store";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/requests", label: "Requests", icon: Inbox, end: false },
  { to: "/admin/events", label: "Events", icon: CalendarRange, end: false },
  { to: "/admin/categories", label: "Categories", icon: Tags, end: false },
];

function useAdminSession() {
  const [authed, setAuthed] = useState(isAuthenticated);

  async function login(username: string, password: string) {
    await apiLogin(username, password);
    setAuthed(true);
  }

  function logout() {
    apiLogout();
    setAuthed(false);
  }

  return { authed, login, logout };
}

export default function AdminLayout() {
  const { authed, login, logout } = useAdminSession();

  if (!authed) {
    return <AdminLogin onLogin={login} />;
  }

  return (
    <div className="flex min-h-screen bg-paper-stub">
      <aside className="hidden w-64 shrink-0 flex-col bg-black text-paper md:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <div className="inline-block rounded-md bg-white px-3 py-2">
            <img src={logo} alt="UCwestpark" className="h-7 w-auto" />
          </div>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gold">
            Staff Dashboard
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gold text-black"
                    : "text-paper/70 hover:bg-white/5 hover:text-paper"
                }`
              }
            >
              <l.icon size={18} />
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 border-t border-white/10 px-3 py-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-paper/70 hover:bg-white/5 hover:text-paper"
          >
            <ExternalLink size={18} />
            View site
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-paper/70 hover:bg-white/5 hover:text-paper"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <MobileAdminNav onLogout={logout} />
        <main className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function MobileAdminNav({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-paper-line bg-black px-5 py-3 text-paper md:hidden">
      <div className="flex gap-4 overflow-x-auto text-sm font-medium">
        {links.map((l) => (
          <NavLink
            key={l.label}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `whitespace-nowrap ${isActive ? "text-gold" : "text-paper/70"}`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </div>
      <button onClick={onLogout} className="text-paper/70" aria-label="Log out">
        <LogOut size={18} />
      </button>
    </div>
  );
}

function AdminLogin({ onLogin }: { onLogin: (username: string, password: string) => Promise<void> }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await onLogin(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-black p-8 text-paper"
      >
        <div className="inline-block rounded-md bg-white px-3 py-2">
          <img src={logo} alt="UCwestpark" className="h-7 w-auto" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-semibold">Staff sign in</h1>
        <p className="mt-1 text-sm text-paper/60">
          Sign in with your staff account to manage requests, events, and categories.
        </p>

        <label htmlFor="admin-username" className="mt-6 block text-sm font-medium">
          Username
        </label>
        <input
          id="admin-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-paper focus:border-gold focus:outline-none"
          autoFocus
          autoComplete="username"
        />

        <label htmlFor="admin-password" className="mt-4 block text-sm font-medium">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-paper focus:border-gold focus:outline-none"
          autoComplete="current-password"
        />
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-full bg-gold px-6 py-3 text-sm font-semibold text-black hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
