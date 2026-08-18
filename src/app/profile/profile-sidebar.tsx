"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { User, Package, MapPin, Heart } from "lucide-react";
import LogoutButton from "./logout-button";

function ProfileSidebarContent({ userName, userEmail }: { userName: string, userEmail: string }) {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "profile";

  const menuItems = [
    { id: "profile", label: "Profile Details", icon: User },
    { id: "orders", label: "Order History", icon: Package },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "wishlist", label: "Wishlist", icon: Heart },
  ];

  return (
    <div style={{ flex: "1 1 250px", display: "flex", flexDirection: "column", gap: "32px", minWidth: "250px" }}>
      
      {/* User Info */}
      <div>
        <p style={{ fontSize: "16px", fontWeight: "bold", textTransform: "uppercase", color: "#18181b", margin: "0 0 4px 0", letterSpacing: "0.05em" }}>
          {userName}
        </p>
        <p style={{ fontSize: "13px", color: "#71717a", margin: 0 }}>{userEmail}</p>
      </div>

      {/* Navigation Menu */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          
          return (
            <Link
              key={item.id}
              href={`/profile?tab=${item.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "12px",
                fontWeight: isActive ? "bold" : "500",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: isActive ? "#000" : "#71717a",
                textDecoration: "none",
                transition: "color 0.2s ease"
              }}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      <div style={{ paddingTop: "24px", borderTop: "1px solid #f4f4f5" }}>
         <LogoutButton />
      </div>
    </div>
  );
}

export default function ProfileSidebar(props: { userName: string, userEmail: string }) {
  return (
    <Suspense fallback={<div style={{ flex: "1 1 250px", minWidth: "250px" }}>Loading...</div>}>
      <ProfileSidebarContent {...props} />
    </Suspense>
  );
}
