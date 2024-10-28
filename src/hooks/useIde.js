import { useContext } from "react";
import IdeContext from "../context/IdeProvider.contest.jsx";

const useIde = () => {
  return useContext(IdeContext);
};

export default useIde;
