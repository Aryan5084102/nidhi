"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { loginSchema } from "./schemas";
import FormInput from "./FormInput";
import GoogleIcon from "./GoogleIcon";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS } from "@/lib/roles";

function LoginForm({ onSwitch, onForgotPassword, onGoogleLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        toast.success(`Welcome back, ${result.user.name}! (${ROLE_LABELS[result.user.role]})`);
      } else {
        setServerError(result.error);
      }
    } catch (err) {
      setServerError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white lg:text-heading mb-1.5">Welcome back</h2>
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
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                className="peer sr-only"
              />
              <div className="w-4 h-4 rounded border border-white/30 lg:border-slate-300 peer-checked:bg-success-500 peer-checked:border-success-500 transition-all" />
              <svg className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <span className="text-xs text-slate-400 lg:text-slate-500">Remember me</span>
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs text-success-400 hover:text-success-300 lg:text-primary-500 lg:hover:text-primary-700 font-medium cursor-pointer transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {serverError && (
          <div className="bg-danger-500/10 border border-danger-400/30 lg:bg-danger-50 lg:border-danger-200/60 rounded-xl px-4 py-2.5 text-danger-400 lg:text-danger text-xs font-medium animate-fade-in">
            {serverError}
          </div>
        )}

        <button
  type="submit"
  disabled={loading}
  className="w-full py-3.5 bg-gradient-to-r from-success-500 to-success-400 hover:from-success hover:to-success-500 text-white font-semibold text-sm rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-success-500/25 hover:shadow-success-500/35 active:scale-[0.99]"
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
        className="w-full flex items-center justify-center gap-2.5 py-3 bg-white/10 border border-white/20 rounded-xl text-sm font-medium text-white hover:bg-white/15 transition-all cursor-pointer lg:bg-white lg:border-slate-200 lg:text-body lg:hover:bg-slate-50 lg:hover:border-slate-300 lg:hover:shadow-sm"
      >
        <GoogleIcon />
        Sign in with Google
      </button>

      <p className="text-center text-sm text-heading mt-8">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => onSwitch("signup")}
          className="text-success-400 hover:text-success-300 lg:text-primary-500 lg:hover:text-primary-700 font-semibold cursor-pointer transition-colors"
        >
          Create Account
        </button>
      </p>

      <p className="text-center text-[11px] text-slate-500 lg:text-subtle mt-4">
        Protected by enterprise-grade encryption
      </p>

      {/* Demo credentials */}
      <details className="mt-4 group">
        <summary className="text-[11px] text-heading cursor-pointer hover:text-subtle lg:hover:text-slate-500 transition-colors text-center list-none">
          <span className="border-b border-dashed border-slate-500">Demo Credentials</span>
        </summary>
        <div className="mt-2 bg-white/5 lg:bg-slate-50 border border-white/10 lg:border-slate-200 rounded-xl p-3 space-y-1.5 text-[11px]">
          {[
            { role: "Admin", email: "admin@glimmora.com", pass: "Admin@123" },
            { role: "Manager", email: "manager@glimmora.com", pass: "Manager@123" },
            { role: "Member", email: "member@glimmora.com", pass: "Member@123" },
          ].map((d) => (
            <div key={d.role} className="flex items-center justify-between text-slate-400 lg:text-slate-500">
              <span className="font-medium text-subtle lg:text-body w-24">{d.role}</span>
              <span className="truncate flex-1 text-right">{d.email} / {d.pass}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

export default LoginForm;
