"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import LeftPanel from "./LeftPanel";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";
import { useAuth } from "@/context/AuthContext";
import { ROLES } from "@/lib/roles";

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

export default function LoginPage() {
  const [view, setView] = useState("login");
  const { loginWithGoogle } = useAuth();

  const handleGoogleCredential = useCallback(
    (response) => {
      const base64Url = response.credential.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64));

      const googleUser = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        role: ROLES.MEMBER,
      };

      const users = JSON.parse(localStorage.getItem("glimmora_users") || "[]");
      if (!users.find((u) => u.email === googleUser.email)) {
        users.push({ ...googleUser, password: null, role: ROLES.MEMBER });
        localStorage.setItem("glimmora_users", JSON.stringify(users));
      }

      toast.success(`Welcome, ${googleUser.name}! Signed in with Google.`);
      loginWithGoogle(googleUser);
    },
    [loginWithGoogle]
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
        <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-primary-500/[0.07] blur-3xl lg:hidden pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] rounded-full bg-success-500/[0.07] blur-3xl lg:hidden pointer-events-none" />

        {/* Persistent mobile header */}
        <div className="lg:hidden relative z-10 shrink-0 flex items-center gap-3 px-6 pt-6 pb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-success-400 to-teal-500 rounded-xl flex items-center justify-center text-base font-bold text-white shadow-lg shadow-success-500/25">
            G
          </div>
          <div>
            <div className="text-white text-base font-bold">Glimmora Nidhi</div>
            <div className="text-heading text-[11px]">Agentic AI Platform</div>
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
