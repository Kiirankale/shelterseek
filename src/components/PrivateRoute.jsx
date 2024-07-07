import { Outlet, Navigate } from "react-router-dom";
import { useAuthStats } from "../hooks/useAuthStats";
import Spinner from "./Spinner";

export default function PrivateRoute() {
  const { loggedIn, checkingStatus } = useAuthStats();
  if (checkingStatus) {
    return  <Spinner/>
  }
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
}
