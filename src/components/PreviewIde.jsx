import React from "react";
import Highlight from "react-highlight";
import "highlight.js/styles/obsidian.css";
// import "highlight.js/styles/a11y-light.css";

const PreviewIde = ({ code, language }) => (
  <div className="bg-gray-900 rounded-lg overflow-hidden">
    <div className="flex items-center justify-between p-4 bg-gray-800">
      <div className="flex space-x-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <span className="text-gray-400 text-sm">{language}</span>
    </div>
    <div className="p-4 overflow-x-auto scrollbar-hide">
      <Highlight className={language}>{code}</Highlight>
    </div>
  </div>
);
export default PreviewIde;
