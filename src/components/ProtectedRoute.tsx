import { Navigate } from "react-router-dom";

function useAuth() {
  const user = localStorage.getItem("token");
  return { isAuthenticated: !!user };
}
import { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
