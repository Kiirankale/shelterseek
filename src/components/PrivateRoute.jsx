import { Outlet, Navigate } from "react-router-dom";
import { useAuthStats } from "../hooks/useAuthStats";

export default function PrivateRoute() {
  const { loggedIn, checkingStatus } = useAuthStats();
  if (checkingStatus) {
    return <h1>loading...</h1>;
  }
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
}
