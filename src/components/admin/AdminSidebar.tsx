"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@components/contexts/AuthContext";
import { useState, useEffect } from "react";

const NAV = [
  { href: "/admin",                label: "Overview",       icon: "▦" },
  { href: "/admin/about",          label: "About",          icon: "◐" },
  { href: "/admin/blogs",          label: "Blogs",          icon: "✍" },
  { href: "/admin/projects",       label: "Projects",       icon: "◈" },
  { href: "/admin/tech-stacks",   label: "Tech Stacks",    icon: "◇" },
  { href: "/admin/videos",         label: "Videos",         icon: "▷" },
  { href: "/admin/careers",        label: "Careers",        icon: "◉" },
  { href: "/admin/skills",         label: "Skills",         icon: "◆" },
  { href: "/admin/certifications", label: "Certifications", icon: "✦" },
  { href: "/admin/community",      label: "Community",      icon: "◎" },
  { href: "/admin/cv",             label: "CV Generator",   icon: "◻" },
  { href: "/admin/rag",            label: "RAG / Chat",     icon: "◍" },
  { href: "/admin/chat-sessions", label: "Chat Sessions",  icon: "◑" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);

  // Persist collapse state
  useEffect(() => {
    const stored = localStorage.getItem("admin-sidebar-collapsed");
    if (stored === "true") setCollapsed(true);
  }, []);

  const toggle = () => {
    setCollapsed(v => {
      localStorage.setItem("admin-sidebar-collapsed", String(!v));
      return !v;
    });
  };

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <aside
      className={`shrink-0 h-screen flex flex-col bg-[#13151f] border-r border-[#2d3748] transition-all duration-200 ${collapsed ? "w-14" : "w-56"}`}
    >
      {/* Logo + toggle */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-[#2d3748]">
        {!collapsed && (
          <span className="text-indigo-400 font-bold text-sm tracking-widest uppercase">ASY Admin</span>
        )}
        <button
          onClick={toggle}
          className={`text-slate-500 hover:text-slate-200 transition-colors text-base leading-none ${collapsed ? "mx-auto" : ""}`}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "▶" : "◀"}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV.map(({ href, label, icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 rounded-lg text-sm transition-colors ${collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5"} ${
                active
                  ? "bg-indigo-600/20 text-indigo-300 font-medium"
                  : "text-slate-400 hover:bg-[#1e2130] hover:text-slate-200"
              }`}
            >
              <span className="text-base shrink-0">{icon}</span>
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className={`py-4 border-t border-[#2d3748] ${collapsed ? "px-2 flex justify-center" : "px-4"}`}>
        {!collapsed && user && (
          <p className="text-xs text-slate-500 truncate mb-2">{user.email}</p>
        )}
        <button
          onClick={handleLogout}
          title="Sign out"
          className={`text-red-400 hover:text-red-300 transition-colors text-xs ${collapsed ? "" : "w-full text-left py-1"}`}
        >
          {collapsed ? "→" : "Sign out →"}
        </button>
      </div>
    </aside>
  );
}
