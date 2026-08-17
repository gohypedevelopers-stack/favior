"use client";

import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function LogoutButton() {
  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.05em] text-zinc-500 hover:text-black transition-colors"
    >
      <LogOut size={14} /> Log Out
    </button>
  );
}
