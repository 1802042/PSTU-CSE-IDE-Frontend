import React, { useState, useEffect } from "react";

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-[calc(100vh-0px)] flex items-center justify-center p-4">
      <div
        className={`text-center transition-all duration-1000 ease-out transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h1 className="text-6xl font-bold mb-4 animate-bounce">404</h1>
        <p className="text-2xl mb-8">Oops! Page not found</p>
        <div className="mb-8">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
        </div>
        <p className="mb-8 text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a
          href="/"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 inline-block"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
