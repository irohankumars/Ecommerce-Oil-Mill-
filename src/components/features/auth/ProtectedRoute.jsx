// Guards routes that require an authenticated session.
import StatusPage from "../../../pages/StatusPage.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";

export default function ProtectedRoute({ allowed = true, children }) {
  const { authenticated, loading } = useAuth();
  if (loading) return null;
  return allowed && authenticated ? children : <StatusPage code="401" retry />;
}
