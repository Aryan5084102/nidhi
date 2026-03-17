import "./globals.css";
import ToastProvider from "@/components/ToastProvider";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";

export const metadata = {
  title: "Glimmora Nidhi - Agentic AI Dashboard",
  description: "AI-powered Nidhi company management platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AuthProvider>
        <ToastProvider />
      </body>
    </html>
  );
}
