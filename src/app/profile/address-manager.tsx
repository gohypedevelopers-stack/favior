"use client";

import { useState } from "react";
import { createAddress, deleteAddress } from "@/lib/server/actions/address.actions";
import { MapPin, Plus, Trash2 } from "lucide-react";

export default function AddressManager({ addresses }: { addresses: any[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData(e.currentTarget);
    try {
      const res = await createAddress(formData);
      if (res.error) {
        setMessage({ type: "error", text: res.error });
      } else {
        setIsAdding(false);
      }
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      await deleteAddress(id);
    }
  };

  return (
    <>
      <h2 style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#a1a1aa", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
        <MapPin size={14} /> Saved Addresses
      </h2>
      
      {!isAdding && addresses.length === 0 && (
        <div style={{ backgroundColor: "#fafafa", border: "1px solid #f4f4f5", padding: "48px", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#71717a", marginBottom: "24px" }}>You haven't saved any addresses yet.</p>
          <button 
            onClick={() => setIsAdding(true)}
            style={{ backgroundColor: "#000", color: "#fff", padding: "16px 32px", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", border: "none", cursor: "pointer" }}
          >
            Add New Address
          </button>
        </div>
      )}

      {!isAdding && addresses.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {addresses.map((address) => (
            <div key={address.id} style={{ border: "1px solid #f4f4f5", padding: "24px", position: "relative" }}>
              {address.isDefault && (
                <span style={{ position: "absolute", top: "24px", right: "24px", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#000", backgroundColor: "#f4f4f5", padding: "4px 8px", borderRadius: "2px" }}>
                  Default
                </span>
              )}
              <p style={{ fontSize: "14px", fontWeight: "bold", color: "#18181b", margin: "0 0 8px 0" }}>
                {address.firstName} {address.lastName}
              </p>
              <p style={{ fontSize: "14px", color: "#71717a", margin: "0 0 4px 0" }}>{address.address1}</p>
              {address.address2 && <p style={{ fontSize: "14px", color: "#71717a", margin: "0 0 4px 0" }}>{address.address2}</p>}
              <p style={{ fontSize: "14px", color: "#71717a", margin: "0 0 16px 0" }}>
                {address.city}, {address.state} {address.zip} <br /> {address.country}
              </p>
              <button 
                onClick={() => handleDelete(address.id)}
                style={{ background: "none", border: "none", color: "#ef4444", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          ))}
          <button 
            onClick={() => setIsAdding(true)}
            style={{ backgroundColor: "#000", color: "#fff", padding: "16px", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "8px" }}
          >
            <Plus size={14} /> Add Another Address
          </button>
        </div>
      )}

      {isAdding && (
        <form onSubmit={handleAddSubmit} style={{ border: "1px solid #f4f4f5", padding: "32px", display: "flex", flexDirection: "column", gap: "24px", backgroundColor: "#fafafa" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#18181b", margin: 0 }}>Add New Address</h3>
          
          {message.text && (
            <div style={{ padding: "12px", backgroundColor: message.type === "success" ? "#ecfdf5" : "#fef2f2", color: message.type === "success" ? "#065f46" : "#991b1b", fontSize: "12px", borderRadius: "2px" }}>
              {message.text}
            </div>
          )}

          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#a1a1aa", marginBottom: "8px" }}>First Name</label>
              <input name="firstName" type="text" required style={{ width: "100%", padding: "12px", border: "1px solid #e4e4e7", backgroundColor: "#fff", fontSize: "14px", color: "#18181b", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#a1a1aa", marginBottom: "8px" }}>Last Name</label>
              <input name="lastName" type="text" required style={{ width: "100%", padding: "12px", border: "1px solid #e4e4e7", backgroundColor: "#fff", fontSize: "14px", color: "#18181b", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#a1a1aa", marginBottom: "8px" }}>Address Line 1</label>
            <input name="address1" type="text" required style={{ width: "100%", padding: "12px", border: "1px solid #e4e4e7", backgroundColor: "#fff", fontSize: "14px", color: "#18181b", outline: "none", boxSizing: "border-box" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#a1a1aa", marginBottom: "8px" }}>Address Line 2 (Optional)</label>
            <input name="address2" type="text" style={{ width: "100%", padding: "12px", border: "1px solid #e4e4e7", backgroundColor: "#fff", fontSize: "14px", color: "#18181b", outline: "none", boxSizing: "border-box" }} />
          </div>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 150px" }}>
              <label style={{ display: "block", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#a1a1aa", marginBottom: "8px" }}>City</label>
              <input name="city" type="text" required style={{ width: "100%", padding: "12px", border: "1px solid #e4e4e7", backgroundColor: "#fff", fontSize: "14px", color: "#18181b", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ flex: "1 1 150px" }}>
              <label style={{ display: "block", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#a1a1aa", marginBottom: "8px" }}>State/Province</label>
              <input name="state" type="text" required style={{ width: "100%", padding: "12px", border: "1px solid #e4e4e7", backgroundColor: "#fff", fontSize: "14px", color: "#18181b", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ flex: "1 1 150px" }}>
              <label style={{ display: "block", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#a1a1aa", marginBottom: "8px" }}>Postal / Zip Code</label>
              <input name="zip" type="text" required style={{ width: "100%", padding: "12px", border: "1px solid #e4e4e7", backgroundColor: "#fff", fontSize: "14px", color: "#18181b", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input type="checkbox" name="isDefault" id="isDefault" />
            <label htmlFor="isDefault" style={{ fontSize: "12px", color: "#18181b", cursor: "pointer" }}>Set as default address</label>
          </div>

          <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
            <button type="submit" disabled={isSaving} style={{ flex: 1, backgroundColor: "#000", color: "#fff", padding: "16px", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", border: "none", cursor: isSaving ? "not-allowed" : "pointer", opacity: isSaving ? 0.7 : 1 }}>
              {isSaving ? "Saving..." : "Save Address"}
            </button>
            <button type="button" onClick={() => setIsAdding(false)} style={{ flex: 1, backgroundColor: "transparent", color: "#18181b", padding: "16px", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", border: "1px solid #e4e4e7", cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </>
  );
}
