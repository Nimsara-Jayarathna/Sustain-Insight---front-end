import { Link } from "react-router-dom";
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
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;

const landingLinks = [
  { label: "Overview", href: "#top" },
  { label: "Features", href: "#features" },
  { label: "Latest News", href: "#latest" },
  { label: "Contact", href: "#footer" },
];

export default function AppHeader(props: Props) {
  const { variant } = props;
  const { user } = useAuthContext();

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.trim();
  const profileTitle = user ? `${user.firstName} ${user.lastName}` : "Manage Profile";

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
          <button
            type="button"
            onClick={props.onProfileClick}
            aria-label="Open profile settings"
            className="group flex items-center gap-3 rounded-full border border-gray-200 bg-white/70 px-2.5 py-1.5 text-left shadow-sm transition hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-sm font-semibold text-white shadow-inner">
              {initials || <ProfileIcon />}
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                Manage
              </span>
              <span className="text-sm font-semibold text-gray-800 transition group-hover:text-emerald-700">
                {profileTitle}
              </span>
            </div>
          </button>
        )}
      </div>
    </header>
  );
}
