"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ArrowUpRight, Eye, EyeOff } from "lucide-react";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.user) {
          const paramRedirect = searchParams.get("redirectTo");
          if (paramRedirect) {
            router.replace(paramRedirect);
          } else if (data.user.role === "ADMIN") {
            router.replace("/dashboard");
          } else {
            router.replace("/orders");
          }
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [router, searchParams]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (mode === "signup") {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        if (!formData.agreeTerms) {
          throw new Error("You must agree to the Terms & Conditions.");
        }

        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.fullName,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Signup failed");

        setMode("login");
        setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
        setErrorMsg("Account created! Please sign in.");
      } else {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");

        let targetUrl = "/orders";
        if (data.user?.role === "ADMIN") {
          targetUrl = "/dashboard";
        }

        const redirectParam = searchParams.get("redirectTo");
        if (redirectParam) {
          targetUrl = redirectParam;
        }

        router.replace(targetUrl);
        router.refresh();
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%", display: "flex", flex: "1 1 0%", backgroundColor: "#fff" }}>
      <div style={{ display: "grid", width: "100%", minHeight: "calc(100vh - 70px)", gridTemplateColumns: "repeat(12, minmax(0, 1fr))" }}>
        
        {/* Left Side: Editorial Lifestyle Photo */}
        <div style={{ position: "relative", backgroundColor: "#f1f5f9", minHeight: "100%", overflow: "hidden", gridColumn: "span 6 / span 6" }} className="hidden lg:block">
          <Image
            src="/product_showcase_mosaic.png"
            alt="Favior Gym Gear Products"
            fill
            priority
            unoptimized
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        {/* Right Side: Editorial Form */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem", backgroundColor: "#fff", gridColumn: "span 6 / span 6" }}>
          <div style={{ width: "100%", maxWidth: "460px", margin: "auto", padding: "1.5rem 0" }}>
            
            <div style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", color: "#0f172a" }}>
                {mode === "signup" ? "CREATE YOUR ACCOUNT" : "SIGN IN TO YOUR ACCOUNT"}
              </h2>
              <p style={{ marginTop: "0.5rem", fontSize: "0.75rem", lineHeight: 1.625, color: "#64748b", fontWeight: 400 }}>
                {mode === "signup"
                  ? "Save your favourites, follow your orders, and receive access to our latest edits."
                  : "Access your saved products, track your orders, and manage your member profile."}
              </p>

              {errorMsg && (
                <div style={{ marginTop: "1rem", padding: "0.75rem", backgroundColor: "#fff1f2", border: "1px solid #fecdd3", color: "#be123c", fontSize: "0.75rem", fontWeight: 500 }}>
                  {errorMsg}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {mode === "signup" && (
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#0f172a", marginBottom: "0.375rem" }}>
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    style={{ width: "100%", borderRadius: 0, border: "1px solid #0f172a", backgroundColor: "#fff", padding: "0.75rem 1rem", fontSize: "0.75rem", color: "#0f172a", outline: "none", transition: "all 150ms" }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#0f172a", marginBottom: "0.375rem" }}>
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: "100%", borderRadius: 0, border: "1px solid #0f172a", backgroundColor: "#fff", padding: "0.75rem 1rem", fontSize: "0.75rem", color: "#0f172a", outline: "none", transition: "all 150ms" }}
                />
              </div>

              {mode === "signup" ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.75rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#0f172a", marginBottom: "0.375rem" }}>
                      PASSWORD
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="8+ characters"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        style={{ width: "100%", borderRadius: 0, border: "1px solid #0f172a", backgroundColor: "#fff", padding: "0.75rem 2.5rem 0.75rem 1rem", fontSize: "0.75rem", color: "#0f172a", outline: "none", transition: "all 150ms" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", cursor: "pointer", background: "none", border: "none" }}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#0f172a", marginBottom: "0.375rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      CONFIRM PASSWORD
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        placeholder="Repeat password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        style={{ width: "100%", borderRadius: 0, border: "1px solid #0f172a", backgroundColor: "#fff", padding: "0.75rem 2.5rem 0.75rem 1rem", fontSize: "0.75rem", color: "#0f172a", outline: "none", transition: "all 150ms" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", cursor: "pointer", background: "none", border: "none" }}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#0f172a" }}>
                      PASSWORD
                    </label>
                    <button
                      type="button"
                      onClick={() => alert("Password reset instructions sent.")}
                      style={{ fontSize: "11px", fontWeight: 400, color: "#64748b", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", textUnderlineOffset: "2px" }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="8+ characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      style={{ width: "100%", borderRadius: 0, border: "1px solid #0f172a", backgroundColor: "#fff", padding: "0.75rem 2.5rem 0.75rem 1rem", fontSize: "0.75rem", color: "#0f172a", outline: "none", transition: "all 150ms" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", background: "none", border: "none", cursor: "pointer" }}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              <div style={{ paddingTop: "0.25rem" }}>
                {mode === "signup" ? (
                  <label style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      required
                      checked={formData.agreeTerms}
                      onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                      style={{ marginTop: "0.125rem", width: "14px", height: "14px", borderRadius: 0, border: "1px solid #0f172a", outline: "none", accentColor: "#0f172a" }}
                    />
                    <span style={{ fontSize: "11px", lineHeight: 1.375, color: "#475569", fontWeight: 400 }}>
                      I agree to the{" "}
                      <span style={{ color: "#0f172a", textDecoration: "underline", cursor: "pointer" }}>
                        Terms & Conditions
                      </span>{" "}
                      and{" "}
                      <span style={{ color: "#0f172a", textDecoration: "underline", cursor: "pointer" }}>
                        Privacy Policy
                      </span>
                      .
                    </span>
                  </label>
                ) : (
                  <label style={{ display: "flex", alignItems: "center", gap: "0.625rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                      style={{ width: "14px", height: "14px", borderRadius: 0, border: "1px solid #0f172a", outline: "none", accentColor: "#0f172a" }}
                    />
                    <span style={{ fontSize: "11px", color: "#475569", fontWeight: 400 }}>
                      Keep me signed in on this device
                    </span>
                  </label>
                )}
              </div>

              <div style={{ paddingTop: "1rem" }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", borderRadius: 0, backgroundColor: "#000", padding: "1rem 1.5rem", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.2em", color: "#fff", transition: "all 150ms", opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer", border: "none" }}
                >
                  <span style={{ margin: "0 auto", paddingLeft: "1rem" }}>
                    {loading ? "VERIFYING..." : mode === "signup" ? "CREATE ACCOUNT" : "SIGN IN"}
                  </span>
                  <ArrowUpRight size={16} style={{ flexShrink: 0 }} />
                </button>
              </div>
            </form>

            <div style={{ marginTop: "2.5rem", textAlign: "center", paddingTop: "1.25rem", borderTop: "1px solid #f1f5f9" }}>
              {mode === "signup" ? (
                <p style={{ fontSize: "11px", color: "#64748b" }}>
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setMode("login");
                      setErrorMsg(null);
                    }}
                    style={{ fontWeight: "bold", color: "#0f172a", background: "none", border: "none", cursor: "pointer" }}
                  >
                    SIGN IN
                  </button>
                </p>
              ) : (
                <p style={{ fontSize: "11px", color: "#64748b" }}>
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => {
                      setMode("signup");
                      setErrorMsg(null);
                    }}
                    style={{ fontWeight: "bold", color: "#0f172a", background: "none", border: "none", cursor: "pointer" }}
                  >
                    CREATE ONE
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#fff" }}>
      <Navbar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: "3.5rem" }}>
        <Suspense
          fallback={
            <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "2rem", height: "2rem", border: "2px solid #0f172a", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            </div>
          }
        >
          <AuthForm />
        </Suspense>
      </div>
    </div>
  );
}
