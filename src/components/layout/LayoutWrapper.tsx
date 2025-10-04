import React from "react";
import AppHeader from "./AppHeader";
import Footer from "./Footer";

type Props = {
  variant: "landing" | "dashboard";
  children: React.ReactNode;
  onLogin?: () => void;
  onSignup?: () => void;
  onProfileClick?: () => void;
};

export default function LayoutWrapper({
  variant,
  children,
  onLogin,
  onSignup,
  onProfileClick,
}: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <AppHeader
        variant={variant}
        onLogin={onLogin!}
        onSignup={onSignup!}
        onProfileClick={onProfileClick!}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
