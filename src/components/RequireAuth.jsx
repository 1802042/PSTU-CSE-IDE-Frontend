import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

const RequireAuth = ({ userRole }) => {
  const { auth } = useAuth();
  const location = useLocation();

  return (
    <>
      {!userRole ? (
        auth.accessToken ? (
          <Outlet />
        ) : (
          <Navigate to="/login" state={{ from: location }} replace />
        )
      ) : (
        <>
          {auth.accessToken && auth.user.role === userRole ? (
            <Outlet />
          ) : (
            <Navigate to="/not-found" state={{ from: location }} replace />
          )}
        </>
      )}
    </>
  );
};

export default RequireAuth;
