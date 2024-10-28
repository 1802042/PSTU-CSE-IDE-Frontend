import React, { useState, useRef, useCallback, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Panel } from "react-resizable-panels";
import { Download, Upload, XCircle } from "lucide-react";
import Button from "@mui/material/Button";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Typography from "@mui/material/Typography";
import { languageTemplates, mapLanguageId } from "../constants.js";
import monokai from "../themes/Monokai.json";
import solarizedDark from "../themes/Solarized-dark.json";
import solarizedLight from "../themes/Solarized-light.json";
import dracula from "../themes/Dracula.json";
import nord from "../themes/Nord.json";
import tomorrowNightBlue from "../themes/Tomorrow-Night-Blue.json";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import { toast, Bounce } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import Confetti from "react-confetti";
import useIde from "../hooks/useIde.js";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { PanelGroup, PanelResizeHandle } from "react-resizable-panels";

const SUBMIT_URL = "/submissions/submit";
const RESULT_URL = "/submissions/result";

const editorThemes = [
  "dracula",
  "nord",
  "vs-dark",
  "vs-light",
  "hc-black",
  "hc-light",
  "monokai",
  "solarized-dark",
  "solarized-light",
  "tomorrow-night-blue",
];

const fontSizes = [8, 10, 12, 14, 15, 18, 20, 22];

const MAX_FILE_SIZE = 1024 * 1024; // 1MB

const Header = ({
  handleExportCode,
  handleImportCode,
  handleRunCode,
  handleCancelSubmission,
  isProcessing,
  language,
  theme,
  handleLanguageChange,
  setTheme,
  fontSize,
  setFontSize,
}) => (
  <div className="flex items-center justify-between p-4 bg-gray-800">
    <div className="flex items-center space-x-4 px-4">
      <div className="flex items-star justify-start space-x-4 px-4">
        <div>
          <FolderSpecialIcon className="text-orange-600" />
          <ChevronRightIcon className="text-orange-600" />
        </div>
        <Typography variant="h7" className="text-slate-200 underline">
          Filename.cpp
        </Typography>
      </div>

      <Button
        variant="outlined"
        onClick={handleExportCode}
        startIcon={<Download size={"20"} />}
        className="px-4 py-2 hover:text-white hover:bg-blue-600 rounded"
        color="primary"
      >
        {"Export"}
      </Button>

      <Button
        variant="outlined"
        onClick={handleImportCode}
        startIcon={<Upload size={"20"} />}
        className="px-4 py-2 hover:text-white hover:bg-purple-600 rounded"
        color="secondary"
      >
        {"Import"}
      </Button>

      {isProcessing ? (
        <Button
          variant="outlined"
          onClick={handleCancelSubmission}
          startIcon={<XCircle size={"20"} />}
          className="px-4 py-2 hover:text-white hover:bg-red-600 rounded"
          color="error"
        >
          {"Cancel Run"}
        </Button>
      ) : (
        <Button
          variant="outlined"
          onClick={handleRunCode}
          startIcon={<PlayCircleIcon />}
          className="px-4 py-2 hover:text-white hover:bg-green-600 rounded"
          color="success"
        >
          {"Run"}
        </Button>
      )}
    </div>
    <div className="flex items-center space-x-4">
      <select
        value={language}
        onChange={handleLanguageChange}
        className="bg-gray-700 text-white border-gray-600 rounded p-2"
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="cpp">C++</option>
        <option value="c">C</option>
      </select>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="bg-gray-700 text-white border-gray-600 rounded p-2"
      >
        {editorThemes.map((t) => (
          <option key={t} value={t}>
            {t === "tomorrow-night-blue"
              ? "night-blue"
              : t === "vs-dark"
              ? "vscode-dark"
              : t === "vs-light"
              ? "vscode-light"
              : t}
          </option>
        ))}
      </select>
      <select
        value={fontSize}
        onChange={(e) => setFontSize(parseInt(e.target.value))}
        className="bg-gray-700 text-white border-gray-600 rounded p-2"
      >
        {fontSizes.map((size) => (
          <option key={size} value={size}>
            FontSize: {size}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const CodeEditor = ({
  language,
  code,
  theme,
  handleEditorDidMount,
  setCode,
  fontSize,
}) => (
  <Editor
    height="100%"
    language={language}
    value={code}
    theme={theme}
    onMount={handleEditorDidMount}
    onChange={(value) => setCode(value)}
    options={{
      fontSize: fontSize,
      minimap: { enabled: true },
      scrollbar: {
        vertical: "visible",
        horizontal: "visible",
      },
    }}
  />
);

const InputOutputPanel = ({
  input,
  setInput,
  output,
  expectedOutput,
  setExpectedOutput,
}) => {
  const [activeTab, setActiveTab] = useState("input");

  return (
    <PanelGroup direction="vertical">
      <Panel defaultSize={50}>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full h-full"
        >
          <TabsList className="flex mb-2">
            <TabsTrigger
              value="input"
              className={`flex-1 py-2 px-4 text-center font-semibold cursor-pointer ${
                activeTab === "input"
                  ? "bg-blue-800 text-white"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              Input
            </TabsTrigger>
            <TabsTrigger
              value="expected"
              className={`flex-1 py-2 px-4 text-center font-semibold cursor-pointer ${
                activeTab === "expected"
                  ? "bg-blue-800 text-white"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              Expected Output
            </TabsTrigger>
          </TabsList>
          <TabsContent value="input" className="h-[calc(100%-40px)]">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter input here..."
              className="w-full h-full bg-gray-800 text-white font-mono p-2 resize-none border-gray-700"
            />
          </TabsContent>
          <TabsContent value="expected" className="h-[calc(100%-40px)]">
            <textarea
              value={expectedOutput}
              onChange={(e) => setExpectedOutput(e.target.value)}
              placeholder="Enter expected output here..."
              className="w-full h-full bg-gray-800 text-white font-mono p-2 resize-none border-gray-700"
            />
          </TabsContent>
        </Tabs>
      </Panel>
      <PanelResizeHandle className="h-2 bg-gray-700 hover:bg-gray-600 transition-colors" />
      <Panel defaultSize={50}>
        <div className="h-full">
          <h3 className="text-center text-m font-semibold mb-2">Output</h3>
          <textarea
            value={output}
            readOnly
            placeholder="Output will appear here..."
            className="w-full h-[calc(100%-28px)] bg-gray-800 text-white font-mono p-2 resize-none border-gray-700"
          />
        </div>
      </Panel>
    </PanelGroup>
  );
};

const Ide = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [activePage, setActivePage] = useState(false);

  useEffect(() => {
    setActivePage(true);
    return () => {
      setActivePage((pre) => !pre);
    };
  }, []);

  const {
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
  } = useIde();

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const intervalRef = useRef(null);
  const finalIntervalRef = useRef(null);
  const abortControllerRef = useRef(null);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    const themesToLoad = [
      { name: "monokai", data: monokai },
      { name: "solarized-dark", data: solarizedDark },
      { name: "solarized-light", data: solarizedLight },
      { name: "dracula", data: dracula },
      { name: "nord", data: nord },
      { name: "tomorrow-night-blue", data: tomorrowNightBlue },
    ];

    themesToLoad.forEach(({ name, data }) => {
      monaco.editor.defineTheme(name, data);
    });

    monaco.editor.setTheme(theme);
  };

  const fireToast = (message, success) => {
    if (activePage) {
      success
        ? toast.success(message, {
            position: "top-center",
            autoClose: 3500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          })
        : toast.error(message, {
            position: "top-center",
            autoClose: 3500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
    }
  };

  const handleCancelSubmission = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsProcessing(false);
    setResultId(null);
    setOutput("Submission cancelled.");
  }, []);

  useEffect(() => {
    console.log(`isProcessing : ${isProcessing}`);
  }, []);

  // useEffect(() => {
  //   return () => {
  //     handleCancelSubmission();
  //   };
  // }, [handleCancelSubmission]);

  const fetchResult = (submissionId, intervalRef, abortController) => {
    return new Promise((resolve, reject) => {
      try {
        intervalRef.current = setInterval(async () => {
          try {
            const response = await axiosPrivate.get(
              `${RESULT_URL}/${submissionId}`,
              {
                withCredentials: true,
                params: {
                  submissionId,
                },
                signal: abortController.signal,
              }
            );

            const result = response.data?.data;
            if (result?.status && result?.status !== "Processing") {
              resolve(result);
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
              }
              if (finalIntervalRef.current) {
                clearInterval(finalIntervalRef.current);
              }
            }
          } catch (err) {
            reject(err);
            // if (err.name !== "AbortError") {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            if (finalIntervalRef.current) {
              clearInterval(finalIntervalRef.current);
            }
            // }
          }
        }, 1500);

        finalIntervalRef.current = setTimeout(() => {
          if (isProcessing) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            reject(new Error("Timeout"));
          }
        }, 20000);
      } catch (err) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        if (finalIntervalRef.current) {
          clearInterval(finalIntervalRef.current);
        }
        reject(err);
      }
    });
  };

  const handleRunCode = async () => {
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);
    const editorValue = editorRef.current.getValue();
    const requestData = {
      sourceCode: editorValue,
      stdin: input.trim(),
      expected: expectedOutput.trim(),
      languageId: mapLanguageId[language],
    };

    try {
      const response = await axiosPrivate(SUBMIT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(requestData),
        withCredentials: true,
      });

      const result = response.data?.data;
      setResultId(result?._id || resultId);
      setOutput(`[${result?.status}...]`);
    } catch (error) {
      setOutput("Error submitting code.");
      setIsProcessing(false);

      const status = error?.status;
      if (!status) {
        fireToast("Something went wrong! Try again!", false);
      } else if (status == 400) {
        fireToast("Source code is empty!", false);
      } else if (status == 401 || status == 403) {
        navigate("/login", {
          state: { from: location },
          replace: true,
        });
      } else {
        fireToast("Something went wrong! Try again!", false);
      }
    }
  };

  useEffect(() => {
    const getResult = async () => {
      abortControllerRef.current = new AbortController();
      try {
        const submissionResult = await fetchResult(
          resultId,
          intervalRef,
          abortControllerRef.current
        );
        if (submissionResult.status == "Accepted") {
          fireToast(submissionResult.status, true);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }
        const okFormat =
          submissionResult.stdout +
          "\n" +
          `[${submissionResult.status}]` +
          "\n" +
          "Time: " +
          submissionResult.cpu +
          "s Memory: " +
          submissionResult.memory +
          "kb";
        const errorFormat =
          submissionResult.status +
          "\n" +
          submissionResult.compile +
          "\n" +
          submissionResult.stdout;

        setOutput(
          parseInt(submissionResult.statusId, 10) >= 6 ? errorFormat : okFormat
        );
        setResultId(null);
        setIsProcessing(false);
      } catch (error) {
        error === "Timeout"
          ? setOutput("[Time Limit Exceeded]\nTime: 10.00s Memory: 0kb")
          : setOutput("Error executing code.");
        setIsProcessing(false);
        setResultId(null);

        const status = error?.status;
        if (!status) {
        } else if (status == 401 || status == 403) {
          navigate("/login", {
            state: { from: location },
            replace: true,
          });
        } else if (status == 404) {
          fireToast("Invalid submission id!", false);
        } else {
          fireToast("Something went wrong! Try again!", false);
        }
      }
    };

    if (resultId) {
      getResult();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (finalIntervalRef.current) {
        clearInterval(finalIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [resultId]);

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    setCode(languageTemplates[newLanguage]);
  };

  const handleExportCode = useCallback(() => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${
      language === "c"
        ? "c"
        : language === "cpp"
        ? "cpp"
        : language === "javascript"
        ? "js"
        : language === "python"
        ? "py"
        : language === "java"
        ? "java"
        : "txt"
    }`;
    a.click();
    URL.revokeObjectURL(url);
  }, [code, language]);

  const handleImportCode = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`The maximum file size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target.result);
        const extension = file.name.split(".").pop();
        const newLanguage =
          extension === "c"
            ? "c"
            : extension === "cpp"
            ? "cpp"
            : extension === "js"
            ? "javascript"
            : extension === "py"
            ? "python"
            : "java";
        setLanguage(newLanguage);
      };
      reader.readAsText(file);
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white px-5 py-2">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      <Header
        handleExportCode={handleExportCode}
        handleImportCode={handleImportCode}
        handleRunCode={handleRunCode}
        handleCancelSubmission={handleCancelSubmission}
        isProcessing={isProcessing}
        language={language}
        theme={theme}
        handleLanguageChange={handleLanguageChange}
        setTheme={setTheme}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />
      <PanelGroup direction="horizontal" className="flex-grow">
        <Panel defaultSize={70}>
          <CodeEditor
            language={language}
            code={code}
            theme={theme}
            handleEditorDidMount={handleEditorDidMount}
            setCode={setCode}
            fontSize={fontSize}
          />
        </Panel>
        <PanelResizeHandle className="w-2 bg-gray-700 hover:bg-gray-600 transition-colors" />
        <Panel defaultSize={30}>
          <InputOutputPanel
            input={input}
            setInput={setInput}
            output={output}
            expectedOutput={expectedOutput}
            setExpectedOutput={setExpectedOutput}
          />
        </Panel>
      </PanelGroup>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".js,.py,.java,.cpp, .c"
      />
    </div>
  );
};

export default Ide;
