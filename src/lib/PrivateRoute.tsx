import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const user = useSelector((state: RootState) => state.user);
  console.log("PrivateRoute userr:", user);

  if (!user.id) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
