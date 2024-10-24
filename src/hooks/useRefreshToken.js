import axios from "../api/axios.js";
import useAuth from "./useAuth.js";

const TOKEN_URL = "users/refresh-token";
const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refreshAccessToken = async () => {
    const response = await axios.get(TOKEN_URL, {
      withCredentials: true,
    });

    setAuth(response.data?.data);
    return response.data?.data?.accessToken;
  };
  return refreshAccessToken;
};

export default useRefreshToken;
