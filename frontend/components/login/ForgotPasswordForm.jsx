"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { post } from "@/lib/api";

// ── Password strength checks ────────────────────────────────────────────────
const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "Uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "Lowercase letter", test: (v) => /[a-z]/.test(v) },
  { label: "Number", test: (v) => /[0-9]/.test(v) },
  { label: "Special character", test: (v) => /[!@#$%^&*(),.?":{}|<>]/.test(v) },
];

function ForgotPasswordForm({ onSwitch }) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [step, setStep] = useState("email"); // email | otp | success
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const otpRefs = useRef([]);

  // ── Resend countdown ──────────────────────────────────────────────────────
  useEffect(() => {
    if (step !== "otp" || canResend) return;
    if (resendTimer <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer, step, canResend]);

  // ── Focus first OTP input when entering OTP step ──────────────────────────
  useEffect(() => {
    if (step === "otp") otpRefs.current[0]?.focus();
  }, [step]);

  // ── Send OTP ──────────────────────────────────────────────────────────────
  const sendOtp = useCallback(async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) { setEmailError("Email is required"); return; }
    if (!emailRegex.test(email)) { setEmailError("Enter a valid email"); return; }
    setEmailError("");
    setLoading(true);
    setServerError("");
    try {
      const res = await post("/auth/forgot-password", { email });
      if (res.success) {
        setStep("otp");
        setResendTimer(30);
        setCanResend(false);
      } else {
        setServerError(res.message || "Failed to send OTP");
      }
    } catch (err) {
      setServerError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }, [email]);

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResend = async () => {
    setOtp(["", "", "", "", "", ""]);
    setCanResend(false);
    setResendTimer(30);
    setServerError("");
    setLoading(true);
    try {
      await post("/auth/forgot-password", { email });
    } catch {}
    setLoading(false);
  };

  // ── OTP input handlers ────────────────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    const next = [...otp];
    for (let i = 0; i < 6; i++) next[i] = text[i] || "";
    setOtp(next);
    const focusIdx = Math.min(text.length, 5);
    otpRefs.current[focusIdx]?.focus();
  };

  // ── Reset password ────────────────────────────────────────────────────────
  const handleReset = async (e) => {
    e.preventDefault();
    const otpStr = otp.join("");
    if (otpStr.length !== 6) { setServerError("Enter the 6-digit OTP"); return; }
    if (!PASSWORD_RULES.every((r) => r.test(password))) {
      setServerError("Password doesn't meet requirements");
      return;
    }
    if (password !== confirmPassword) {
      setServerError("Passwords do not match");
      return;
    }
    setLoading(true);
    setServerError("");
    try {
      const res = await post("/auth/reset-password", {
        email,
        otp: otpStr,
        newPassword: password,
        confirmPassword,
      });
      if (res.success) setStep("success");
      else setServerError(res.message || "Reset failed");
    } catch (err) {
      setServerError(err.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Eye icon ──────────────────────────────────────────────────────────────
  const EyeToggle = ({ show, onToggle }) => (
    <button
      type="button"
      tabIndex={-1}
      onClick={onToggle}
      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
    >
      {show ? (
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
      ) : (
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      )}
    </button>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 1: Email input
  // ═══════════════════════════════════════════════════════════════════════════
  if (step === "email") {
    return (
      <div className="w-full animate-fade-in">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => onSwitch("login")}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white lg:text-slate-500 lg:hover:text-slate-800 cursor-pointer transition-colors mb-4"
          >
            <span>&larr;</span> Back
          </button>
          <h2 className="text-2xl font-bold text-white lg:text-slate-900 mb-1.5">
            Forgot password?
          </h2>
          <p className="text-slate-400 lg:text-slate-500 text-sm">
            Enter your email and we&apos;ll send you a 6-digit OTP
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 lg:text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
              onKeyDown={(e) => e.key === "Enter" && sendOtp()}
              placeholder="admin@glimmora.com"
              className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all lg:bg-white lg:text-slate-900 lg:placeholder:text-slate-400 ${
                emailError
                  ? "border-danger-300 focus:border-danger-400 focus:ring-danger-500/10"
                  : "border-white/20 focus:border-primary-400 focus:ring-primary-500/10 lg:border-slate-200"
              }`}
            />
            {emailError && (
              <p className="mt-1 text-xs text-danger-400 animate-fade-in">{emailError}</p>
            )}
          </div>

          {serverError && (
            <div className="px-3 py-2.5 bg-danger-500/10 border border-danger-500/20 rounded-xl text-xs text-danger-400 lg:text-danger-500">
              {serverError}
            </div>
          )}

          <button
            type="button"
            onClick={sendOtp}
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-success-500 to-success-400 hover:from-success hover:to-success-500 text-white font-semibold text-sm rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-success-500/25 active:scale-[0.99]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending OTP...
              </span>
            ) : (
              "Send Reset OTP"
            )}
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 3: Success
  // ═══════════════════════════════════════════════════════════════════════════
  if (step === "success") {
    return (
      <div className="w-full animate-fade-in">
        <div className="text-center">
          <div className="w-16 h-16 bg-success-500/20 lg:bg-success-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white lg:text-slate-900 mb-2">
            Password reset successful
          </h2>
          <p className="text-slate-400 lg:text-slate-500 text-sm mb-6">
            Your password has been updated. You can now sign in with your new password.
          </p>
          <button
            type="button"
            onClick={() => onSwitch("login")}
            className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-500 hover:from-primary-700 hover:to-primary text-white font-semibold text-sm rounded-xl transition-all duration-200 cursor-pointer shadow-lg shadow-primary-500/25"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 2: OTP + New Password  (matches screenshot)
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="w-full animate-fade-in">
      {/* Back button */}
      <button
        type="button"
        onClick={() => setStep("email")}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white lg:text-slate-500 lg:hover:text-slate-800 cursor-pointer transition-colors mb-5"
      >
        <span>&larr;</span> Back
      </button>

      <form onSubmit={handleReset} className="space-y-5">
        {/* ── OTP Section ──────────────────────────────────────────────── */}
        <div>
          <h3 className="text-base font-bold text-white lg:text-slate-900 mb-1">
            OTP Code
          </h3>
          <p className="text-xs text-slate-400 lg:text-slate-500 mb-3">
            We sent a 6-digit code to{" "}
            <span className="font-semibold text-white lg:text-slate-900">{email}</span>
          </p>

          {/* 6 separate OTP boxes */}
          <div className="flex gap-2 mb-2" onPaste={handleOtpPaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (otpRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className="w-12 h-13 text-center text-lg font-semibold rounded-xl border bg-white/10 border-white/20 text-white focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 focus:outline-none transition-all lg:bg-white lg:text-slate-900 lg:border-slate-200 caret-primary-500"
              />
            ))}
          </div>

          {/* Resend timer */}
          <p className="text-xs text-slate-400 lg:text-slate-500">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="text-primary font-semibold hover:text-primary-700 cursor-pointer"
              >
                Resend code
              </button>
            ) : (
              <>
                Resend code in <span className="font-semibold text-white lg:text-slate-900">{resendTimer}s</span>
              </>
            )}
          </p>
        </div>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10 lg:bg-slate-200" />
          <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">
            Set new password
          </span>
          <div className="flex-1 h-px bg-white/10 lg:bg-slate-200" />
        </div>

        {/* ── New Password ─────────────────────────────────────────────── */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 lg:text-slate-700 mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 chars, uppercase, number, special"
              className="w-full px-4 py-3 pr-11 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:border-primary-400 focus:ring-primary-500/10 transition-all lg:bg-white lg:text-slate-900 lg:placeholder:text-slate-400 lg:border-slate-200"
            />
            <EyeToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
          </div>
        </div>

        {/* ── Confirm Password ─────────────────────────────────────────── */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 lg:text-slate-700 mb-1.5">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your new password"
              className="w-full px-4 py-3 pr-11 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:border-primary-400 focus:ring-primary-500/10 transition-all lg:bg-white lg:text-slate-900 lg:placeholder:text-slate-400 lg:border-slate-200"
            />
            <EyeToggle show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
          </div>
        </div>

        {/* ── Password requirements ────────────────────────────────────── */}
        <div className="p-3.5 bg-white/5 lg:bg-slate-50 border border-white/10 lg:border-slate-200 rounded-xl">
          <p className="text-xs font-semibold text-slate-300 lg:text-slate-700 mb-2">
            Password requirements:
          </p>
          <ul className="space-y-1">
            {PASSWORD_RULES.map((rule) => {
              const pass = password.length > 0 && rule.test(password);
              return (
                <li key={rule.label} className="flex items-center gap-2 text-xs">
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      pass ? "bg-success-500" : "bg-slate-400 lg:bg-slate-300"
                    }`}
                  />
                  <span
                    className={`transition-colors ${
                      pass
                        ? "text-success-400 lg:text-success-600"
                        : "text-slate-400 lg:text-slate-500"
                    }`}
                  >
                    {rule.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Error ────────────────────────────────────────────────────── */}
        {serverError && (
          <div className="px-3 py-2.5 bg-danger-500/10 border border-danger-500/20 rounded-xl text-xs text-danger-400 lg:text-danger-500">
            {serverError}
          </div>
        )}

        {/* ── Submit ───────────────────────────────────────────────────── */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-500 hover:from-primary-700 hover:to-primary text-white font-semibold text-sm rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-primary-500/25 hover:shadow-primary-500/35 active:scale-[0.99] flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Resetting password...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              Reset Password
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default ForgotPasswordForm;
