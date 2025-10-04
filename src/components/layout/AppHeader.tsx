import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

type Props =
  | {
      variant: "landing";
      onLogin: () => void;
      onSignup: () => void;
    }
  | {
      variant: "dashboard";
      onProfileClick: () => void;
    };

export default function AppHeader(props: Props) {
  const { variant } = props;
  const { user, logout } = useAuthContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fullName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : "User";

  const handleLogout = () => {
    logout?.();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-sm shadow-sm transition-shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          to={variant === "dashboard" ? "/dashboard" : "/"}
          className="flex items-center gap-3"
        >
          <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5">
            <img
              src="/icon.png"
              alt="Sustain Insight"
              className="h-full w-full object-contain"
            />
            <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_30%,rgba(16,185,129,0.15),transparent_70%)] blur-sm" />
          </div>

          <span className="font-semibold tracking-tight text-gray-900 text-lg">
            Sustain Insight
          </span>
        </Link>

        {/* Actions */}
        {variant === "landing" ? (
          <nav className="flex items-center gap-3">
            <button
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
              onClick={props.onLogin}
            >
              Login
            </button>
            <button
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
              onClick={props.onSignup}
            >
              Sign Up
            </button>
          </nav>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium hover:bg-gray-100"
            >
              <span>{fullName}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white py-1 shadow-lg">
                <button
                  onClick={() => {
                    props.onProfileClick();
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Manage Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
