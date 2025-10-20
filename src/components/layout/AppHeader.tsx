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

// --- Helper Icon Components ---
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

const landingLinks = [
  { label: "Overview", href: "#top" },
  { label: "Features", href: "#features" },
  { label: "Latest News", href: "#latest" },
  { label: "Contact", href: "#footer" },
];

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

  const initials = (user?.firstName?.[0] || '') + (user?.lastName?.[0] || '');

  const handleLogout = () => {
    logout?.();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <Link to={variant === "dashboard" ? "/dashboard" : "/"} className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-200">
            <img src="/icon.png" alt="Sustain Insight" className="h-full w-full object-contain p-1" />
          </div>
          <span className="font-semibold tracking-tight text-gray-900 text-lg">Sustain Insight</span>
        </Link>

        {variant === "landing" ? (
          <nav className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="mr-2 hidden items-center gap-3 md:flex lg:gap-4">
              {landingLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:text-gray-900 hover:bg-gray-100"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <button
              className="rounded-lg border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              onClick={props.onLogin}
            >
              Login
            </button>
            <button
              className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              onClick={props.onSignup}
            >
              Get Started
            </button>
          </nav>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setDropdownOpen((p) => !p)} className="flex items-center gap-2 rounded-full text-sm font-medium transition hover:bg-gray-100 p-1">
              <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                {initials || '?'}
              </div>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg p-1">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800 truncate">{user?.firstName} {user?.lastName}</p>
                  {/* <p className="text-xs text-gray-500 truncate">{user?.email}</p> */}
                </div>
                <div className="py-1">
                  <button onClick={() => { props.onProfileClick(); setDropdownOpen(false); }} className="flex w-full items-center gap-2 text-left px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
                    <ProfileIcon /> Manage Profile
                  </button>
                </div>
                <div className="py-1 border-t border-gray-100">
                  <button onClick={handleLogout} className="flex w-full items-center gap-2 text-left px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50">
                    <LogoutIcon /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
