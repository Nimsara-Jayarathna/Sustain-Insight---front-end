const footerLinks = [
  { label: "Overview", href: "#top" },
  { label: "Features", href: "#features" },
  { label: "Latest News", href: "#latest" },
  { label: "Dashboard", href: "/dashboard" },
];

export default function Footer() {
  return (
    <footer
      id="footer"
      className="border-t border-gray-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 text-sm text-gray-600 dark:text-slate-300 md:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 overflow-hidden rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 p-1">
                <img
                  src="/icon.png"
                  alt="Sustain Insight"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                Sustain Insight
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed">
              Daily intelligence on sustainability regulation, impact investing, and supply-chain resilience for teams that need to move quickly.
            </p>
          </div>

          <div className="space-y-3 md:justify-self-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
              Explore
            </p>
            <ul className="space-y-2 text-sm">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="transition hover:text-emerald-600 dark:hover:text-emerald-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 md:justify-self-end">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
              Contact
            </p>
            <div className="space-y-1 text-sm">
              <p>We&apos;d love to hear from you.</p>
              <a
                href="mailto:contact.sustain-insight@blipzo.xyz"
                className="inline-flex items-center gap-2 text-emerald-600 transition hover:underline dark:text-emerald-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18-3h18a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2z"
                  />
                </svg>
                contact.sustain-insight@blipzo.xyz
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-100 pt-6 text-center text-xs text-gray-500 dark:border-slate-800 dark:text-slate-400">
          © {new Date().getFullYear()} Sustain Insight · A SE2012 Group Project
        </div>
      </div>
    </footer>
  );
}
