import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  userName: string;
  onProfileClick: () => void;
};

export default function DashboardHeader({ userName, onProfileClick }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // This effect closes the dropdown if you click outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo and App Name */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-emerald-600"></div>
          <span className="font-semibold tracking-tight">Sustain Insight</span>
        </Link>

        {/* User Menu Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {userName}
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onProfileClick();
                  setDropdownOpen(false);
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Manage Profile
              </a>
              <Link
                to="/"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}