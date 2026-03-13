"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordSchema } from "./schemas";
import FormInput from "./FormInput";

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
            {"\u2709\uFE0F"}
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
          <span>{"\u2190"}</span> Back to Sign In
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

export default ForgotPasswordForm;
