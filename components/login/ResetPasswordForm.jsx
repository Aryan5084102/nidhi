"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "./schemas";
import FormInput from "./FormInput";

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
            {"\u2705"}
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
          <span>{"\u2190"}</span> Back
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

export default ResetPasswordForm;
