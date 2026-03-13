"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { loginSchema } from "./schemas";
import FormInput from "./FormInput";
import GoogleIcon from "./GoogleIcon";

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

export default LoginForm;
