"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { signupSchema } from "./schemas";
import FormInput from "./FormInput";
import GoogleIcon from "./GoogleIcon";

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

export default SignupForm;
