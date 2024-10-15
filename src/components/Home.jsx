import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Home = () => {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleGetStarted = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5 seconds
  };

  return (
    <section className="relative overflow-hidden flex flex-col h-[calc(100vh-20px)] bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* ... (SVG code remains the same) ... */}
        </svg>
      </div>

      <AnimatePresence>
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col justify-between h-full py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            PSTU LAB IDE
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-blue-200 mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ArrowBackIosIcon />
            Say goodbye to the hassle of setting up local environments! <br />{" "}
            Focus on writing code while we handle the rest
            <ArrowForwardIosIcon />
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="default"
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:shadow-xl"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                color="primary"
                size="lg"
                className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:shadow-xl"
              >
                Live Demo
              </Button>
            </motion.div>
          </motion.div>
          <br />

          <div className="flex flex-row w-full gap-2">
            <PreviewIde
              code={`// Language: C++
#include <iostream>
using namespace std;

int main() {
    string name;
    // Prompt the user for their name
    cout << "Enter your name: ";
    cin >> name;
    // Print the greeting message
    cout << "Hello " << name << endl;            
    return 0;
}
          `}
            />
            <PreviewIde
              code={`// Language: Java
import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);  
        // Prompt the user for their name
        System.out.print("Enter your name: ");
        String name = scanner.nextLine();
        // Print the greeting message
        System.out.println("Hello " + name);
        scanner.close();
    }
}
            `}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const PreviewIde = ({ code }) => {
  return (
    <div className="w-full bg-gray-800 rounded-lg p-2 shadow-2xl h-full">
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <div className="bg-gray-900 p-2 rounded overflow-hidden h-full">
        <SyntaxHighlighter
          language="cpp"
          style={dracula}
          customStyle={{
            fontSize: "1.1rem",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default Home;
