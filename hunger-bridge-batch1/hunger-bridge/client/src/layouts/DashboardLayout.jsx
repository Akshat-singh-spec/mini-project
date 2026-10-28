import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Sprout, Plus, Search, Inbox, ShieldCheck, Users, ClipboardList } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "../components/NotificationBell";

const NAV_BY_ROLE = {
  DONOR: [
    { to: "/donor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/donor/donations/new", label: "List a donation", icon: Plus },
  ],
  NGO: [
    { to: "/ngo/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/ngo/donations", label: "Browse donations", icon: Search },
    { to: "/ngo/requests", label: "My requests", icon: Inbox },
  ],
  ADMIN: [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/ngos", label: "NGO verification", icon: ShieldCheck },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/donations", label: "All donations", icon: ClipboardList },
  ],
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = NAV_BY_ROLE[user?.role] || [];

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="flex min-h-screen bg-canvas">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-bridge-100 bg-white md:flex">
        <div className="flex items-center gap-2 px-6 py-5 font-display text-lg text-bridge-800">
          <Sprout className="h-5 w-5 text-bridge-500" />
          Hunger Bridge
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-bridge-50 text-bridge-800" : "text-bridge-600 hover:bg-bridge-50"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-bridge-100 px-4 py-4">
          <p className="truncate text-sm font-medium text-bridge-800">{user?.name}</p>
          <p className="truncate text-xs text-bridge-500">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="mt-3 flex items-center gap-2 text-sm text-clay hover:underline"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-bridge-100 bg-white px-6 py-4">
          <span className="font-display text-lg text-bridge-800 md:hidden">Hunger Bridge</span>
          <span className="hidden md:block" />
          <div className="flex items-center gap-3">
            <NotificationBell />
            <button onClick={handleLogout} className="text-sm text-clay md:hidden">
              Log out
            </button>
          </div>
        </header>
        <main className="p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
