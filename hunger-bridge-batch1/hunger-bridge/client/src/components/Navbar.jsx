import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Sprout } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { dashboardPathForRole } from "../utils/roleRouting";

const NAV_LINKS = [
  { to: "/#how-it-works", label: "How it works" },
  { to: "/#benefits", label: "Who it's for" },
  { to: "/#food-safety", label: "Food safety" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setIsOpen(false);
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-bridge-100 bg-canvas/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl text-bridge-800">
          <Sprout className="h-6 w-6 text-bridge-500" strokeWidth={2.2} />
          Hunger Bridge
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.to}
              href={link.to}
              className="text-sm text-bridge-700 hover:text-bridge-900 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <NavLink to={dashboardPathForRole(user?.role)} className="btn-secondary">
                Dashboard
              </NavLink>
              <button onClick={handleLogout} className="btn-primary">
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn-secondary">
                Log in
              </NavLink>
              <NavLink to="/register" className="btn-primary">
                Get started
              </NavLink>
            </>
          )}
        </div>

        <button
          className="md:hidden text-bridge-800"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-bridge-100 bg-canvas px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a key={link.to} href={link.to} className="text-sm text-bridge-700" onClick={() => setIsOpen(false)}>
                {link.label}
              </a>
            ))}
            <hr className="border-bridge-100" />
            {isAuthenticated ? (
              <>
                <NavLink to={dashboardPathForRole(user?.role)} className="btn-secondary w-full" onClick={() => setIsOpen(false)}>
                  Dashboard
                </NavLink>
                <button onClick={handleLogout} className="btn-primary w-full">
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="btn-secondary w-full" onClick={() => setIsOpen(false)}>
                  Log in
                </NavLink>
                <NavLink to="/register" className="btn-primary w-full" onClick={() => setIsOpen(false)}>
                  Get started
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
