import { Navigate } from "react-router-dom";
import type { JSX } from "react";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const user = localStorage.getItem('userToken')

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PublicRoute;