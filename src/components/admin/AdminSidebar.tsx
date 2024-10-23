"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@components/contexts/AuthContext";

const NAV = [
  { href: "/admin",               label: "Overview",       icon: "▦" },
  { href: "/admin/about",         label: "About",          icon: "◐" },
  { href: "/admin/blogs",         label: "Blogs",          icon: "✍" },
  { href: "/admin/projects",      label: "Projects",       icon: "◈" },
  { href: "/admin/videos",        label: "Videos",         icon: "▷" },
  { href: "/admin/careers",       label: "Careers",        icon: "◉" },
  { href: "/admin/skills",        label: "Skills",         icon: "◆" },
  { href: "/admin/certifications",label: "Certifications", icon: "✦" },
  { href: "/admin/community",     label: "Community",      icon: "◎" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <aside className="w-56 shrink-0 h-screen flex flex-col bg-[#13151f] border-r border-[#2d3748]">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#2d3748]">
        <span className="text-indigo-400 font-bold text-sm tracking-widest uppercase">
          ASY Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {NAV.map(({ href, label, icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-indigo-600/20 text-indigo-300 font-medium"
                  : "text-slate-400 hover:bg-[#1e2130] hover:text-slate-200"
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="px-4 py-4 border-t border-[#2d3748]">
        {user && (
          <p className="text-xs text-slate-500 truncate mb-2">{user.email}</p>
        )}
        <button
          onClick={handleLogout}
          className="w-full text-left text-xs text-red-400 hover:text-red-300 transition-colors py-1"
        >
          Sign out →
        </button>
      </div>
    </aside>
  );
}
