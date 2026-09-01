"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import LogoutButton from "./LogoutButton";

export default function Nav({
  orgName,
  links,
}: {
  orgName: string;
  links: { href: string; label: string }[];
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const initial = orgName?.trim()?.[0]?.toUpperCase() ?? "?";

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80 shadow-sm shadow-slate-900/[0.02] backdrop-blur">
      <div className="h-0.5 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600" />
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5">
        <div className="flex min-w-0 items-center gap-8">
          <Logo textClassName="hidden sm:inline" />
          <nav className="hidden gap-1 text-sm sm:flex">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <span className="flex items-center gap-2 rounded-full bg-slate-100 py-1 pl-1 pr-1 text-sm font-medium text-slate-700 sm:pr-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
              {initial}
            </span>
            <span className="hidden sm:inline">{orgName || "—"}</span>
          </span>
          <LogoutButton className="btn-secondary hidden sm:inline-flex" />
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 text-slate-600 sm:hidden"
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 sm:hidden">
          <p className="mb-2 px-1 text-sm font-medium text-slate-500">{orgName || "—"}</p>
          <nav className="flex flex-col gap-1">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-2 border-t border-slate-100 pt-2">
            <LogoutButton className="btn-secondary w-full justify-center" />
          </div>
        </div>
      )}
    </header>
  );
}
