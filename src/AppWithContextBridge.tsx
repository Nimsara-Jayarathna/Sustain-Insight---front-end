import App from "./App";
import { useAuthContext } from "./hooks/useAuthContext";
import { setAuthContextRef } from "./context/contextBridge";

export default function AppWithContextBridge() {
  const auth = useAuthContext();
  setAuthContextRef(auth);
  return <App />;
}
