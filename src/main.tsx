import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import { setAuthContextRef } from "./context/contextBridge";

// ✅ Wrapper component to connect AuthContext globally
function AppWithContextBridge() {
  const auth = useAuthContext();
  setAuthContextRef(auth); // makes the context available for api.ts
  return <App />;
}

// ✅ Root render
createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <AppWithContextBridge />
  </AuthProvider>
);
