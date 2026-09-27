import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppWithContextBridge from "./AppWithContextBridge";

// ✅ Root render
createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <AuthProvider>
      <AppWithContextBridge />
    </AuthProvider>
  </ThemeProvider>
);
