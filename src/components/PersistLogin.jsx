import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken.js";
import useAuth from "../hooks/useAuth.js";
import { Audio } from "react-loader-spinner";

const PersistLogin = () => {
  const refreshAccessToken = useRefreshToken();
  const [isLoading, setIsLoading] = useState(true);
  const { auth, persist } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refreshAccessToken();
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

    return () => (isMounted = false);
  }, []);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <>
      {!persist ? (
        <Outlet />
      ) : isLoading || loading ? (
        <div className="flex flex-col h-[calc(100vh-20px-40px)] bg-gray-800 text-gray-200 py-5 justify-center items-center">
          <Audio
            height="100"
            width="100"
            radius="15"
            color="red"
            ariaLabel="loading"
            wrapperStyle
            wrapperClass
          />
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
