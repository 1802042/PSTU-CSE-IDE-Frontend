import { useContext } from "react";
import AuthContext from "../context/AuthProvider.context.jsx";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;