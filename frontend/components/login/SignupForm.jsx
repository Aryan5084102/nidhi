"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { signupSchema } from "./schemas";
import FormInput from "./FormInput";
import GoogleIcon from "./GoogleIcon";
import { post } from "@/lib/api";

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

  const [selectedRole, setSelectedRole] = useState("member");

  const roleOptions = [
    { value: "member", label: "Member" },
    { value: "branch_manager", label: "Branch Manager (Foreman)" },
  ];

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      const result = await post("/auth/register", {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: selectedRole === "branch_manager" ? "BRANCH_MANAGER" : "MEMBER",
      });
      if (result.success) {
        toast.success("Signup successful! Please sign in with your email and password.");
        onSwitch("login");
      } else {
        setServerError(result.error || "Registration failed");
      }
    } catch (err) {
      setServerError(err.message || "Registration failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white lg:text-heading mb-1">Create your account</h2>
        <p className="text-heading text-sm">Get started with Glimmora Nidhi platform</p>
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

        <div>
          <label className="block text-xs font-medium text-subtle lg:text-body mb-1.5">
            Account Type
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-success-500/50 focus:border-success-500/50 transition-all lg:bg-white lg:border-slate-200 lg:text-heading lg:focus:ring-primary-500/30 lg:focus:border-primary-400"
          >
            {roleOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-slate-800 lg:bg-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {serverError && (
          <div className="bg-danger-500/10 border border-danger-400/30 lg:bg-danger-50 lg:border-danger-200/60 rounded-xl px-4 py-2.5 text-danger-400 lg:text-danger text-xs font-medium animate-fade-in">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-success to-success-500 hover:from-success-700 hover:to-success text-white font-semibold text-sm rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-success-500/25 hover:shadow-success-500/35 active:scale-[0.99]"
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
        <span className="text-[11px] text-heading lg:text-subtle">or</span>
        <div className="flex-1 h-px bg-white/20 lg:bg-slate-200" />
      </div>

      <button
        type="button"
        onClick={onGoogleLogin}
        className="w-full flex items-center justify-center gap-2.5 py-3 bg-white/10 border border-white/20 rounded-xl text-sm font-medium text-white hover:bg-white/15 transition-all cursor-pointer lg:bg-white lg:border-slate-200 lg:text-body lg:hover:bg-slate-50 lg:hover:border-slate-300 lg:hover:shadow-sm"
      >
        <GoogleIcon />
        Sign up with Google
      </button>

      <p className="text-center text-sm text-heading mt-4">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => onSwitch("login")}
          className="text-success-400 hover:text-success-300 lg:text-primary-500 lg:hover:text-primary-700 font-semibold cursor-pointer transition-colors"
        >
          Sign In
        </button>
      </p>
    </div>
  );
}

export default SignupForm;
