"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@components/contexts/AuthContext";
import AdminSidebar from "./AdminSidebar";

function Guard({ children }: { children: React.ReactNode }) {
  const { loading, isAdmin } = useAuth();
  const pathname = usePathname();
  const router   = useRouter();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (loading) return;
    if (!isAdmin && !isLoginPage) {
      router.replace("/admin/login");
    }
    if (isAdmin && isLoginPage) {
      router.replace("/admin");
    }
  }, [loading, isAdmin, isLoginPage, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f1117]">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isLoginPage) return <>{children}</>;

  if (!isAdmin) return null;

  return (
    <div className="flex h-screen bg-[#0f1117]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6 text-slate-200">
        {children}
      </main>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Guard>{children}</Guard>
    </AuthProvider>
  );
}
