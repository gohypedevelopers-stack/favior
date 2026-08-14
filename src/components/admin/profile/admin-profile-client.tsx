"use client";

import { useState } from "react";
import { User, ShieldCheck, KeyRound, Check, AlertCircle, Eye, EyeOff } from "lucide-react";

type AdminProfileProps = {
  initialProfile: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    createdAt?: Date | string;
  };
};

export function AdminProfileClient({ initialProfile }: AdminProfileProps) {
  const [formData, setFormData] = useState({
    name: initialProfile.name || "",
    email: initialProfile.email || "",
    phone: initialProfile.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update profile.");
      }

      setMessage({ type: "success", text: "Admin profile updated successfully!" });
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "An error occurred while updating profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  const initials = formData.name
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div style={{"marginLeft":"auto","marginRight":"auto","maxWidth":"56rem","flex":"1 1 0%","marginTop":"calc(1.5rem * calc(1 - 0))","marginBottom":"calc(1.5rem * 0)","padding":"1.5rem"}}>
      {/* Top Header */}
      <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.05)","paddingBottom":"1.25rem"}}>
        <div>
          <h1 style={{"fontSize":"1.25rem","lineHeight":"1.75rem","fontWeight":"700","letterSpacing":"-0.025em","color":"rgb(15,23,42)"}}>Admin Profile</h1>
          <p style={{"marginTop":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(100,116,139)"}}>
            Manage your personal profile details, contact information, and security password.
          </p>
        </div>
        <div style={{"display":"flex","alignItems":"center","gap":"0.5rem","borderRadius":"9999px","borderWidth":"1px","borderColor":"rgb(167,243,208)","backgroundColor":"rgb(236,253,245)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.375rem","paddingBottom":"0.375rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(4,120,87)"}}>
          <ShieldCheck className="size-4" />
          <span>{formData.email} ({initialProfile.role})</span>
        </div>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2.5 p-4 text-xs font-medium rounded-xl border ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {message.type === "success" ? (
            <Check style={{"flexShrink":"0","color":"rgb(5,150,105)"}} />
          ) : (
            <AlertCircle style={{"flexShrink":"0","color":"rgb(225,29,72)"}} />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{"marginTop":"calc(1.5rem * calc(1 - 0))","marginBottom":"calc(1.5rem * 0)"}}>
        {/* Avatar & Profile Card */}
        <div style={{"marginTop":"calc(1.5rem * calc(1 - 0))","marginBottom":"calc(1.5rem * 0)","borderRadius":"1rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.05)","backgroundColor":"rgb(255,255,255)","padding":"1.5rem"}}>
          <div style={{"display":"flex","alignItems":"center","gap":"1rem","borderBottomWidth":"1px","borderColor":"rgb(241,245,249)","paddingBottom":"1rem"}}>
            <div style={{"display":"flex","alignItems":"center","justifyContent":"center","borderRadius":"1rem","backgroundColor":"rgb(15,23,42)","fontSize":"1.25rem","lineHeight":"1.75rem","fontWeight":"700","color":"rgb(255,255,255)","boxShadow":"0 0 #0000, 0 0 #0000, 0 4px 6px -1px rgb(0,0,0,0.1), 0 2px 4px -2px rgb(0,0,0,0.1)"}}>
              {initials || "AD"}
            </div>
            <div>
              <h2 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"700","color":"rgb(15,23,42)"}}>{formData.name || "Admin Account"}</h2>
              <p style={{"marginTop":"0.125rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(100,116,139)"}}>{formData.email}</p>
              <span style={{"marginTop":"0.25rem","display":"inline-block","borderRadius":"0.375rem","backgroundColor":"rgb(241,245,249)","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.125rem","paddingBottom":"0.125rem","fontSize":"10px","fontWeight":"800","textTransform":"uppercase","letterSpacing":"0.1em","color":"rgb(51,65,85)"}}>
                System Administrator
              </span>
            </div>
          </div>

          <div style={{"display":"grid","gridTemplateColumns":"repeat(1, minmax(0, 1fr))","gap":"1.25rem"}}>
            <div>
              <label style={{"marginBottom":"0.375rem","display":"block","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.05em","color":"rgb(51,65,85)"}}>
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{"width":"100%","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(15,23,42)","backgroundColor":"rgb(255,255,255)","paddingLeft":"0.875rem","paddingRight":"0.875rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(15,23,42)","transitionProperty":"all","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","outline":"2px solid transparent","outlineOffset":"2px","boxShadow":"0 0 0 0px #fff,   0 0 0 calc(1px + 0px) rgb(59,130,246,0.5), 0 0 #0000"}}
                placeholder="Administrator Name"
              />
            </div>

            <div>
              <label style={{"marginBottom":"0.375rem","display":"block","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.05em","color":"rgb(51,65,85)"}}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{"width":"100%","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(15,23,42)","backgroundColor":"rgb(255,255,255)","paddingLeft":"0.875rem","paddingRight":"0.875rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(15,23,42)","transitionProperty":"all","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","outline":"2px solid transparent","outlineOffset":"2px","boxShadow":"0 0 0 0px #fff,   0 0 0 calc(1px + 0px) rgb(59,130,246,0.5), 0 0 #0000"}}
                placeholder="admin@favior.com"
              />
            </div>

            <div className="md:col-span-2">
              <label style={{"marginBottom":"0.375rem","display":"block","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.05em","color":"rgb(51,65,85)"}}>
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{"width":"100%","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(15,23,42)","backgroundColor":"rgb(255,255,255)","paddingLeft":"0.875rem","paddingRight":"0.875rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(15,23,42)","transitionProperty":"all","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","outline":"2px solid transparent","outlineOffset":"2px","boxShadow":"0 0 0 0px #fff,   0 0 0 calc(1px + 0px) rgb(59,130,246,0.5), 0 0 #0000"}}
                placeholder="+91 9876543210"
              />
            </div>
          </div>
        </div>

        {/* Security / Password Change Card */}
        <div style={{"marginTop":"calc(1.25rem * calc(1 - 0))","marginBottom":"calc(1.25rem * 0)","borderRadius":"1rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.05)","backgroundColor":"rgb(255,255,255)","padding":"1.5rem"}}>
          <div style={{"display":"flex","alignItems":"center","gap":"0.5rem","borderBottomWidth":"1px","borderColor":"rgb(241,245,249)","paddingBottom":"0.75rem"}}>
            <KeyRound style={{"color":"rgb(51,65,85)"}} />
            <h3 style={{"fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.05em","color":"rgb(15,23,42)"}}>
              Change Security Password
            </h3>
          </div>
          <p style={{"fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(100,116,139)"}}>
            Leave password fields blank if you do not wish to update your password.
          </p>

          <div style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)"}}>
            <div>
              <label style={{"marginBottom":"0.25rem","display":"block","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(51,65,85)"}}>Current Password</label>
              <div style={{"position":"relative"}}>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  style={{"width":"100%","borderRadius":"0.375rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.2)","backgroundColor":"white","padding":"0.5rem 2.5rem 0.5rem 0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem","outline":"none"}}
                  placeholder="Enter current password to authorize change"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  style={{"position":"absolute","right":"0.75rem","top":"50%","transform":"translate(0, -50%) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1)","color":"rgb(15,23,42)"}}
                >
                  {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div style={{"display":"grid","gridTemplateColumns":"repeat(1, minmax(0, 1fr))","gap":"1rem"}}>
              <div>
                <label style={{"marginBottom":"0.25rem","display":"block","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(51,65,85)"}}>New Password</label>
                <div style={{"position":"relative"}}>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    style={{"width":"100%","borderRadius":"0.375rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.2)","backgroundColor":"white","padding":"0.5rem 2.5rem 0.5rem 0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem","outline":"none"}}
                    placeholder="New password (min 6 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    style={{"position":"absolute","right":"0.75rem","top":"50%","transform":"translate(0, -50%) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1)","color":"rgb(15,23,42)"}}
                  >
                    {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{"marginBottom":"0.25rem","display":"block","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(51,65,85)"}}>Confirm New Password</label>
                <div style={{"position":"relative"}}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    style={{"width":"100%","borderRadius":"0.375rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.2)","backgroundColor":"white","padding":"0.5rem 2.5rem 0.5rem 0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem","outline":"none"}}
                    placeholder="Repeat new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    style={{"position":"absolute","right":"0.75rem","top":"50%","transform":"translate(0, -50%) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1)","color":"rgb(15,23,42)"}}
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{"display":"flex","alignItems":"center","justifyContent":"flex-end","gap":"0.75rem","paddingTop":"0.5rem"}}>
          <button
            type="submit"
            disabled={saving}
            style={{"display":"inline-flex","cursor":"pointer","alignItems":"center","gap":"0.5rem","borderRadius":"0.75rem","backgroundColor":"rgb(30,41,59)","paddingLeft":"1.5rem","paddingRight":"1.5rem","paddingTop":"0.75rem","paddingBottom":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.05em","color":"rgb(255,255,255)","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)","transitionProperty":"all","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","opacity":"0.6"}}
          >
            {saving ? "Saving Changes..." : "Save Profile Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
