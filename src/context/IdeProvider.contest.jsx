import { createContext, useState } from "react";
import { languageTemplates } from "../constants.js";
const IdeContext = createContext({});

export const IdeProvider = ({ children }) => {
  const [code, setCode] = useState(languageTemplates.cpp);
  const [language, setLanguage] = useState("cpp");
  const [theme, setTheme] = useState("dracula");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [fontSize, setFontSize] = useState(18);
  const [resultId, setResultId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <IdeContext.Provider
      value={{
        code,
        setCode,
        language,
        setLanguage,
        theme,
        setTheme,
        input,
        setInput,
        output,
        setOutput,
        expectedOutput,
        setExpectedOutput,
        fontSize,
        setFontSize,
        resultId,
        setResultId,
        isProcessing,
        setIsProcessing,
      }}
    >
      {children}
    </IdeContext.Provider>
  );
};

export default IdeContext;
