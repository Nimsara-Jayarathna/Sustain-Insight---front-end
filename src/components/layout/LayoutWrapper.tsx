import React from "react";
import AppHeader from "./AppHeader";
import Footer from "./Footer";

type Props =
  | {
      variant: "landing";
      children: React.ReactNode;
      onLogin: () => void;
      onSignup: () => void;
    }
  | {
      variant: "dashboard";
      children: React.ReactNode;
      onProfileClick: () => void;
    };

// This component is structurally complex due to TypeScript's discriminated unions.
// We must handle the props carefully.
export default function LayoutWrapper(props: Props) {
  const {children } = props;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* The AppHeader now receives all props and internally selects the ones it needs. */}
      {/* This is a clean way to handle conditional props. */}
      <AppHeader {...props} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}