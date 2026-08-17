"use client";

import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function LogoutButton() {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  return (
    <button
      onClick={handleLogout}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "11px",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: isHovered ? "#000" : "#71717a",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        transition: "color 0.2s ease"
      }}
    >
      <LogOut size={14} /> Log Out
    </button>
  );
}
