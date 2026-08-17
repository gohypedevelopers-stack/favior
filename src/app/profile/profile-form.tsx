"use client";

import { useState } from "react";
import { updateUserProfile } from "@/lib/server/actions/profile.actions";
import { User } from "lucide-react";

export default function ProfileForm({ user }: { user: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData(e.currentTarget);
    try {
      const res = await updateUserProfile(formData);
      if (res.error) {
        setMessage({ type: "error", text: res.error });
      } else {
        setMessage({ type: "success", text: "Profile updated successfully." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <h2 style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#a1a1aa", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
        <User size={14} /> Profile Details
      </h2>
      <form onSubmit={handleSubmit} style={{ border: "1px solid #f4f4f5", padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {message.text && (
          <div style={{ padding: "12px", backgroundColor: message.type === "success" ? "#ecfdf5" : "#fef2f2", color: message.type === "success" ? "#065f46" : "#991b1b", fontSize: "12px", borderRadius: "2px" }}>
            {message.text}
          </div>
        )}

        <div>
          <label style={{ display: "block", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#a1a1aa", marginBottom: "8px" }}>Full Name</label>
          <input name="name" type="text" defaultValue={user.name || ""} required style={{ width: "100%", padding: "12px", border: "1px solid #e4e4e7", backgroundColor: "#fff", fontSize: "14px", color: "#18181b", outline: "none", boxSizing: "border-box" }} />
        </div>
        
        <div>
          <label style={{ display: "block", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#a1a1aa", marginBottom: "8px" }}>Email Address</label>
          <input name="email" type="email" defaultValue={user.email || ""} disabled style={{ width: "100%", padding: "12px", border: "1px solid #e4e4e7", backgroundColor: "#fafafa", fontSize: "14px", color: "#71717a", outline: "none", boxSizing: "border-box", cursor: "not-allowed" }} />
          <p style={{ fontSize: "10px", color: "#a1a1aa", marginTop: "4px" }}>Email cannot be changed.</p>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#a1a1aa", marginBottom: "8px" }}>Phone Number</label>
          <input name="phone" type="tel" defaultValue={user.phone || ""} style={{ width: "100%", padding: "12px", border: "1px solid #e4e4e7", backgroundColor: "#fff", fontSize: "14px", color: "#18181b", outline: "none", boxSizing: "border-box" }} />
        </div>
        
        <button type="submit" disabled={isSaving} style={{ backgroundColor: "#000", color: "#fff", padding: "16px", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", border: "none", cursor: isSaving ? "not-allowed" : "pointer", marginTop: "8px", opacity: isSaving ? 0.7 : 1 }}>
          {isSaving ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </>
  );
}
