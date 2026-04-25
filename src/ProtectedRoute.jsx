import { Navigate } from "react-router-dom";
import { auth } from "./lib/firebase";

export default function ProtectedRoute({ children }) {
  const user = auth?.currentUser;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}