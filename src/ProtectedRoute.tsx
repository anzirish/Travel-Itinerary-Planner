import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { User } from "firebase/auth";
import { subscribeAuth } from "./services/authService";

interface Props {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    // Subscribe to Firebase auth state
    return subscribeAuth(setUser);
  }, []);

  if (user === undefined) {
    // still loading auth state
    return <div>Loading...</div>;
  }

  if (!user) {
    // not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  // logged in → render children
  return <>{children}</>;
}
