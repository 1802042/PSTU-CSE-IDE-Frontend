import React, { useState, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Download, Upload } from "lucide-react";
import Button from "@mui/material/Button";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Typography from "@mui/material/Typography";
import languageTemplates from "../constants.js";
import monokai from "../themes/Monokai.json";
import solarizedDark from "../themes/Solarized-dark.json";
import solarizedLight from "../themes/Solarized-light.json";
import dracula from "../themes/Dracula.json";
import nord from "../themes/Nord.json";
import tomorrowNightBlue from "../themes/Tomorrow-Night-Blue.json";

const editorThemes = [
  "vs-dark",
  "vs-light",
  "hc-black",
  "hc-light",
  "monokai",
  "solarized-dark",
  "solarized-light",
  "dracula",
  "nord",
  "tomorrow-night-blue",
];

const fontSizes = [8, 10, 12, 14, 15, 18, 20, 22];

const MAX_FILE_SIZE = 1024 * 1024; // 1MB

const Header = ({
  handleExportCode,
  handleImportCode,
  handleRunCode,
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

      <Button
        variant="outlined"
        onClick={handleRunCode}
        startIcon={<PlayCircleIcon />}
        className="px-4 py-2  hover:text-white hover:bg-green-600 rounded"
        color="success"
      >
        {"Run"}
      </Button>
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

const InputOutputPanel = ({ input, setInput, output }) => (
  <PanelGroup direction="vertical">
    <Panel defaultSize={50}>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter input here..."
        className="w-full h-full bg-gray-800 text-white font-mono p-2 resize-none border-gray-700"
      />
    </Panel>
    <PanelResizeHandle className="h-2 bg-gray-700 hover:bg-gray-600 transition-colors" />
    <Panel defaultSize={50}>
      <textarea
        value={output}
        readOnly
        placeholder="Output will appear here..."
        className="w-full h-full bg-gray-800 text-white font-mono p-2 resize-none border-gray-700"
      />
    </Panel>
  </PanelGroup>
);

const Ide = () => {
  const [code, setCode] = useState(languageTemplates.javascript);
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [fontSize, setFontSize] = useState(18); // Default font size
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

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
  };

  const handleRunCode = () => {
    // In a real implementation, this would send the code to a backend for execution
    setOutput("Code execution result would appear here.");
  };

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
    a.download = `code.${language}`;
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
      };
      reader.readAsText(file);
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white px-5 py-2">
      <Header
        handleExportCode={handleExportCode}
        handleImportCode={handleImportCode}
        handleRunCode={handleRunCode}
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
            fontSize={fontSize} // Pass fontSize to CodeEditor
          />
        </Panel>
        <PanelResizeHandle className="w-2 bg-gray-700 hover:bg-gray-600 transition-colors" />
        <Panel defaultSize={30}>
          <InputOutputPanel input={input} setInput={setInput} output={output} />
        </Panel>
      </PanelGroup>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".js,.py,.java,.cpp"
      />
    </div>
  );
};

export default Ide;
