"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

// ─── Validation Schemas ────────────────────────────────────────────────────────

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const signupSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email address"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Must contain at least one special character"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email address"),
});

const resetPasswordSchema = yup.object().shape({
  otp: yup
    .string()
    .required("OTP is required")
    .matches(/^\d{6}$/, "OTP must be 6 digits"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Must contain at least one special character"),
  confirmNewPassword: yup
    .string()
    .required("Please confirm your new password")
    .oneOf([yup.ref("newPassword")], "Passwords do not match"),
});

// ─── Reusable Form Input Component ─────────────────────────────────────────────

function FormInput({ label, type = "text", placeholder, register, error, showToggle, showPassword, onToggle }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-300 lg:text-slate-600 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={showToggle ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          {...register}
          className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all lg:bg-white lg:text-slate-900 lg:placeholder:text-slate-300 ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
              : "border-white/20 focus:border-indigo-400 focus:ring-indigo-500/10 lg:border-slate-200"
          } ${showToggle ? "pr-11" : ""}`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 lg:hover:text-slate-600 text-sm transition-colors cursor-pointer"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-400 lg:text-red-500 animate-fade-in">{error.message}</p>
      )}
    </div>
  );
}

// ─── Google Icon SVG ────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

// ─── Left Panel (shared across all views) ───────────────────────────────────────

function LeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1a2744] to-[#0F172A]">
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/[0.07] blur-3xl" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-emerald-500/[0.07] blur-3xl" />
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 via-indigo-400 to-emerald-400" />

      <div className="relative z-10 flex flex-col justify-between p-12 w-full">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-emerald-500/25">
            G
          </div>
          <div>
            <div className="text-white text-lg font-bold tracking-tight">Glimmora Nidhi</div>
            <div className="text-slate-400 text-xs">Agentic AI Platform</div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-lg">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-dot" />
              <span className="text-emerald-400 text-xs font-semibold">AI-Powered Chit Fund Management</span>
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Smart Chit Fund<br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Operations Hub</span>
            </h1>
            <p className="text-slate-400 text-[15px] leading-relaxed">
              Manage your Nidhi company with AI-powered risk assessment,
              automated compliance, and real-time fraud detection — all in one platform.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: "🛡️", title: "RBI Compliant", desc: "Automated regulatory compliance monitoring" },
              { icon: "🤖", title: "6 AI Agents", desc: "Intelligent automation across all operations" },
              { icon: "📊", title: "Real-time Analytics", desc: "Live dashboards with predictive insights" },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3 group">
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-lg shrink-0 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-colors">
                  {f.icon}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{f.title}</div>
                  <div className="text-slate-500 text-xs">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-slate-600 text-xs">
          &copy; 2026 Glimmora International. All rights reserved.
        </div>
      </div>
    </div>
  );
}

// ─── Login Form ─────────────────────────────────────────────────────────────────

function LoginForm({ onLogin, onSwitch, onForgotPassword, onGoogleLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onTouched",
  });

  const VALID_EMAIL = "test5084@gmail.com";
  const VALID_PASSWORD = "Test@5084";

  const onSubmit = (data) => {
    setServerError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (data.email === VALID_EMAIL && data.password === VALID_PASSWORD) {
        toast.success("Sign in successful! Welcome back.");
        onLogin({ email: VALID_EMAIL, name: "Admin" });
      } else {
        setServerError("Invalid email or password.");
      }
    }, 1200);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white lg:text-slate-900 mb-1.5">Welcome back</h2>
        <p className="text-slate-400 text-sm">Sign in to access your dashboard</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormInput
          label="Email Address"
          type="email"
          placeholder="admin@glimmora.com"
          register={register("email")}
          error={errors.email}
        />

        <FormInput
          label="Password"
          type="password"
          placeholder="Enter your password"
          register={register("password")}
          error={errors.password}
          showToggle
          showPassword={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-white/30 lg:border-slate-300 accent-emerald-500 cursor-pointer"
            />
            <span className="text-xs text-slate-300 lg:text-slate-500">Remember me</span>
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs text-emerald-400 hover:text-emerald-300 lg:text-indigo-500 lg:hover:text-indigo-700 font-medium cursor-pointer transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {serverError && (
          <div className="bg-red-500/10 border border-red-400/30 lg:bg-red-50 lg:border-red-200/60 rounded-xl px-4 py-2.5 text-red-400 lg:text-red-600 text-xs font-medium animate-fade-in">
            {serverError}
          </div>
        )}

        <button
  type="submit"
  disabled={loading}
  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-600 hover:to-emerald-500 text-white font-semibold text-sm rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 active:scale-[0.99]"
>
  {loading ? (
    <span className="flex items-center justify-center gap-2">
      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      Signing in...
    </span>
  ) : (
    "Sign In"
  )}
</button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-white/20 lg:bg-slate-200" />
        <span className="text-[11px] text-slate-400 lg:text-slate-300">or continue with</span>
        <div className="flex-1 h-px bg-white/20 lg:bg-slate-200" />
      </div>

      <button
        type="button"
        onClick={onGoogleLogin}
        className="w-full flex items-center justify-center gap-2.5 py-3 bg-white/10 border border-white/20 rounded-xl text-sm font-medium text-white hover:bg-white/15 transition-all cursor-pointer lg:bg-white lg:border-slate-200 lg:text-slate-700 lg:hover:bg-slate-50 lg:hover:border-slate-300 lg:hover:shadow-sm"
      >
        <GoogleIcon />
        Sign in with Google
      </button>

      <p className="text-center text-sm text-slate-400 mt-8">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => onSwitch("signup")}
          className="text-emerald-400 hover:text-emerald-300 lg:text-indigo-500 lg:hover:text-indigo-700 font-semibold cursor-pointer transition-colors"
        >
          Create Account
        </button>
      </p>

      <p className="text-center text-[11px] text-slate-500 lg:text-slate-300 mt-4">
        Protected by enterprise-grade encryption
      </p>
    </div>
  );
}

// ─── Signup Form ────────────────────────────────────────────────────────────────

function SignupForm({ onSwitch, onGoogleLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
    mode: "onTouched",
  });

  const onSubmit = (data) => {
    setServerError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem("glimmora_users") || "[]");
      const existingUser = users.find((u) => u.email === data.email);
      if (existingUser) {
        setServerError("An account with this email already exists. Please sign in.");
        return;
      }
      // Save new user to localStorage
      const newUser = {
        email: data.email,
        name: data.fullName,
        phone: data.phone,
        password: data.password,
      };
      users.push(newUser);
      localStorage.setItem("glimmora_users", JSON.stringify(users));
      toast.success("Signup successful! Please sign in with your email and password.");
      onSwitch("login");
    }, 1500);
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white lg:text-slate-900 mb-1">Create your account</h2>
        <p className="text-slate-400 text-sm">Get started with Glimmora Nidhi platform</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
        <FormInput
          label="Full Name"
          placeholder="John Doe"
          register={register("fullName")}
          error={errors.fullName}
        />

        <FormInput
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          register={register("email")}
          error={errors.email}
        />

        <FormInput
          label="Phone Number"
          type="tel"
          placeholder="9876543210"
          register={register("phone")}
          error={errors.phone}
        />

        <FormInput
          label="Password"
          type="password"
          placeholder="Min 8 chars, uppercase, number, special"
          register={register("password")}
          error={errors.password}
          showToggle
          showPassword={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
        />

        <FormInput
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          register={register("confirmPassword")}
          error={errors.confirmPassword}
          showToggle
          showPassword={showConfirm}
          onToggle={() => setShowConfirm(!showConfirm)}
        />

        {serverError && (
          <div className="bg-red-500/10 border border-red-400/30 lg:bg-red-50 lg:border-red-200/60 rounded-xl px-4 py-2.5 text-red-400 lg:text-red-600 text-xs font-medium animate-fade-in">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 active:scale-[0.99]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </span>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-white/20 lg:bg-slate-200" />
        <span className="text-[11px] text-slate-400 lg:text-slate-300">or</span>
        <div className="flex-1 h-px bg-white/20 lg:bg-slate-200" />
      </div>

      <button
        type="button"
        onClick={onGoogleLogin}
        className="w-full flex items-center justify-center gap-2.5 py-3 bg-white/10 border border-white/20 rounded-xl text-sm font-medium text-white hover:bg-white/15 transition-all cursor-pointer lg:bg-white lg:border-slate-200 lg:text-slate-700 lg:hover:bg-slate-50 lg:hover:border-slate-300 lg:hover:shadow-sm"
      >
        <GoogleIcon />
        Sign up with Google
      </button>

      <p className="text-center text-sm text-slate-400 mt-4">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => onSwitch("login")}
          className="text-emerald-400 hover:text-emerald-300 lg:text-indigo-500 lg:hover:text-indigo-700 font-semibold cursor-pointer transition-colors"
        >
          Sign In
        </button>
      </p>
    </div>
  );
}

// ─── Forgot Password Form ───────────────────────────────────────────────────────

function ForgotPasswordForm({ onSwitch }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    mode: "onTouched",
  });

  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  };

  if (sent) {
    return (
      <div className="w-full">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 bg-emerald-500/20 lg:bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5">
            ✉️
          </div>
          <h2 className="text-2xl font-bold text-white lg:text-slate-900 mb-2">Check your email</h2>
          <p className="text-slate-400 text-sm mb-2">
            We sent a 6-digit OTP to
          </p>
          <p className="text-white lg:text-slate-700 text-sm font-semibold mb-6">
            {getValues("email")}
          </p>
          <button
            type="button"
            onClick={() => onSwitch("reset-password")}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 cursor-pointer shadow-lg shadow-indigo-500/25 mb-4"
          >
            Enter OTP & Reset Password
          </button>
          <button
            type="button"
            onClick={() => onSwitch("login")}
            className="text-sm text-slate-400 hover:text-slate-300 lg:hover:text-slate-600 cursor-pointer transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => onSwitch("login")}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-300 lg:hover:text-slate-600 cursor-pointer transition-colors mb-4"
        >
          <span>←</span> Back to Sign In
        </button>
        <h2 className="text-2xl font-bold text-white lg:text-slate-900 mb-1.5">Forgot password?</h2>
        <p className="text-slate-400 text-sm">
          Enter your email and we&apos;ll send you a reset OTP
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormInput
          label="Email Address"
          type="email"
          placeholder="admin@glimmora.com"
          register={register("email")}
          error={errors.email}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-600 hover:to-emerald-500 text-white font-semibold text-sm rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 active:scale-[0.99]"
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
      </form>
    </div>
  );
}

// ─── Reset Password Form (OTP + New Password) ──────────────────────────────────

function ResetPasswordForm({ onSwitch }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    mode: "onTouched",
  });

  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  };

  if (success) {
    return (
      <div className="w-full">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 bg-emerald-500/20 lg:bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5">
            ✅
          </div>
          <h2 className="text-2xl font-bold text-white lg:text-slate-900 mb-2">Password reset successful</h2>
          <p className="text-slate-400 text-sm mb-6">
            Your password has been updated. You can now sign in with your new password.
          </p>
          <button
            type="button"
            onClick={() => onSwitch("login")}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 cursor-pointer shadow-lg shadow-indigo-500/25"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => onSwitch("forgot-password")}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-300 lg:hover:text-slate-600 cursor-pointer transition-colors mb-4"
        >
          <span>←</span> Back
        </button>
        <h2 className="text-2xl font-bold text-white lg:text-slate-900 mb-1.5">Reset your password</h2>
        <p className="text-slate-400 text-sm">Enter the OTP sent to your email and set a new password</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="block text-xs font-semibold text-slate-300 lg:text-slate-600 mb-1.5">
            OTP Code
          </label>
          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            {...register("otp")}
            className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all tracking-[0.3em] text-center font-mono lg:bg-white lg:text-slate-900 lg:placeholder:text-slate-300 ${
              errors.otp
                ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
                : "border-white/20 focus:border-indigo-400 focus:ring-indigo-500/10 lg:border-slate-200"
            }`}
          />
          {errors.otp && (
            <p className="mt-1 text-xs text-red-400 lg:text-red-500 animate-fade-in">{errors.otp.message}</p>
          )}
        </div>

        <FormInput
          label="New Password"
          type="password"
          placeholder="Min 8 chars, uppercase, number, special"
          register={register("newPassword")}
          error={errors.newPassword}
          showToggle
          showPassword={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
        />

        <FormInput
          label="Confirm New Password"
          type="password"
          placeholder="Re-enter your new password"
          register={register("confirmNewPassword")}
          error={errors.confirmNewPassword}
          showToggle
          showPassword={showConfirm}
          onToggle={() => setShowConfirm(!showConfirm)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 active:scale-[0.99]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Resetting password...
            </span>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );
}

// ─── Main LoginPage Component ───────────────────────────────────────────────────

// ─── Google Client ID ────────────────────────────────────────────────────────
// Replace this with your actual Google OAuth Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

export default function LoginPage({ onLogin }) {
  const [view, setView] = useState("login"); // login | signup | forgot-password | reset-password

  const handleGoogleCredential = useCallback(
    (response) => {
      // Decode JWT token from Google
      const base64Url = response.credential.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64));

      const googleUser = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };

      // Save google user if not already in localStorage
      const users = JSON.parse(localStorage.getItem("glimmora_users") || "[]");
      if (!users.find((u) => u.email === googleUser.email)) {
        users.push({ ...googleUser, password: null });
        localStorage.setItem("glimmora_users", JSON.stringify(users));
      }

      toast.success(`Welcome, ${googleUser.name}! Signed in with Google.`);
      onLogin(googleUser);
    },
    [onLogin]
  );

  // Load Google Identity Services script
  useEffect(() => {
    if (document.getElementById("google-gsi-script")) return;

    const script = document.createElement("script");
    script.id = "google-gsi-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredential,
        });
      }
    };
    document.head.appendChild(script);
  }, [handleGoogleCredential]);

  const handleGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback: use popup mode if One Tap is blocked
          window.google.accounts.id.renderButton(
            document.createElement("div"),
            { type: "standard" }
          );
          // Use OAuth2 popup as fallback
          const client = window.google.accounts.oauth2.initCodeClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: "email profile",
            ux_mode: "popup",
            callback: (response) => {
              if (response.code) {
                toast.info("Google sign-in processing...");
              }
            },
          });
          client.requestCode();
        }
      });
    } else {
      toast.error("Google sign-in is loading. Please try again in a moment.");
    }
  };

  const renderForm = () => {
    switch (view) {
      case "signup":
        return <SignupForm onSwitch={setView} onGoogleLogin={handleGoogleLogin} />;
      case "forgot-password":
        return <ForgotPasswordForm onSwitch={setView} />;
      case "reset-password":
        return <ResetPasswordForm onSwitch={setView} />;
      default:
        return (
          <LoginForm
            onLogin={onLogin}
            onSwitch={setView}
            onForgotPassword={() => setView("forgot-password")}
            onGoogleLogin={handleGoogleLogin}
          />
        );
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <LeftPanel />
      <div className="flex-1 flex flex-col overflow-hidden relative bg-gradient-to-br from-[#0F172A] via-[#1a2744] to-[#0F172A] lg:from-[#F8FAFC] lg:via-[#F8FAFC] lg:to-[#F8FAFC]">
        {/* Mobile gradient decorative elements */}
        <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-500/[0.07] blur-3xl lg:hidden pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] rounded-full bg-emerald-500/[0.07] blur-3xl lg:hidden pointer-events-none" />

        {/* Persistent mobile header */}
        <div className="lg:hidden relative z-10 shrink-0 flex items-center gap-3 px-6 pt-6 pb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-base font-bold text-white shadow-lg shadow-emerald-500/25">
            G
          </div>
          <div>
            <div className="text-white text-base font-bold">Glimmora Nidhi</div>
            <div className="text-slate-400 text-[11px]">Agentic AI Platform</div>
          </div>
        </div>

        {/* Form content — top-aligned with scroll on mobile, centered on desktop */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 px-6 pt-6 pb-6 lg:flex lg:items-center lg:justify-center lg:p-8">
          <div className="w-full max-w-[400px] lg:mx-auto">
            {renderForm()}
          </div>
        </div>
      </div>
    </div>
  );
}
