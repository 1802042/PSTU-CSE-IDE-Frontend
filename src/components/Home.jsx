import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Code2,
  Terminal,
  Book,
  Zap,
} from "lucide-react";
import Highlight from "react-highlight";
import "highlight.js/styles/atom-one-dark.css";
import { codeExamples } from "../constants.js";

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

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <Icon className="w-12 h-12 text-blue-400 mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  </motion.div>
);

const Home = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [activeTab, setActiveTab] = useState("java");

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prevTab) => {
        const tabs = Object.keys(codeExamples);
        const currentIndex = tabs.indexOf(prevTab);
        const nextIndex = (currentIndex + 1) % tabs.length;
        return tabs[nextIndex];
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  useEffect(() => {
    const updateWindowDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateWindowDimensions();
    window.addEventListener("resize", updateWindowDimensions);
    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 ">
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 py-10">
        <motion.section
          className="mb-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h2
            className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            PSTU CSE OFFLINE LAB IDE
          </motion.h2>
          <motion.p
            className="text-xl text-blue-200 mb-10 max-w-3xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <ArrowLeft className="inline mr-4" />
            Say goodbye to the hassle of setting up local environments! <br />
            Focus on writing code while we handle the rest
            <ArrowRight className="inline ml-4" />
          </motion.p>
          {/* <motion.div
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <button
              onClick={handleGetStarted}
              className="px-7 py-3 border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900 rounded-lg font-semibold transition-all duration-200"
            >
              Get Started
            </button>
            <button className="px-7 py-3 border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900 rounded-lg font-semibold transition-all duration-200">
              Live Demo
            </button>
          </motion.div> */}
        </motion.section>
        <motion.section>
          <section id="languages" className="mb-16">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="flex border-b border-gray-700">
                {Object.keys(codeExamples).map((lang) => (
                  <button
                    key={lang}
                    className={`px-4 py-2 focus:outline-none ${
                      activeTab === lang
                        ? "bg-gray-700 text-blue-400"
                        : "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                    }`}
                    onClick={() => setActiveTab(lang)}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <PreviewIde
                    code={codeExamples[activeTab]}
                    language={activeTab}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </section>
        </motion.section>

        {/* <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <PreviewIde
                language="cpp"
                code={`// Language: C++
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    vector<int> numbers = {5, 2, 8, 1, 9};
    
    cout << "Original vector: ";
    for (int num : numbers) {
        cout << num << " ";
    }
    cout << endl;

    // Sort the vector
    sort(numbers.begin(), numbers.end());

    cout << "Sorted vector: ";
    for (int num : numbers) {
        cout << num << " ";
    }
    cout << endl;

    return 0;
}`}
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <PreviewIde
                language="java"
                code={`// Language: Java
import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList<>();
        numbers.add(5);
        numbers.add(2);
        numbers.add(8);
        numbers.add(1);
        numbers.add(9);

        System.out.println("Original list: " + numbers);

        // Sort the list
        Collections.sort(numbers);

        System.out.println("Sorted list: " + numbers);
    }
}`}
              />
            </motion.div>
          </div>
        </motion.section> */}
        <motion.section
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-blue-200 mb-8">
            Testimonials
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <p className="text-gray-300 mb-4">
                  "PSTU LAB IDE has revolutionized the way we teach programming.
                  It's an invaluable tool for both students and educators."
                </p>
                <p className="text-blue-400 font-semibold">
                  - Prof. Jane Doe, Computer Science Department
                </p>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <p className="text-gray-300 mb-4">
                  "As a student, having access to PSTU LAB IDE has made learning
                  to code so much easier. I can practice anywhere, anytime!"
                </p>
                <p className="text-blue-400 font-semibold">
                  - John Smith, Computer Engineering Student
                </p>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <p className="text-gray-300 mb-4">
                  "As a student, having access to PSTU LAB IDE has made learning
                  to code so much easier. I can practice anywhere, anytime!"
                </p>
                <p className="text-blue-400 font-semibold">
                  - John Smith, Computer Engineering Student
                </p>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <p className="text-gray-300 mb-4">
                  "As a student, having access to PSTU LAB IDE has made learning
                  to code so much easier. I can practice anywhere, anytime!"
                </p>
                <p className="text-blue-400 font-semibold">
                  - John Smith, Computer Engineering Student
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-blue-200 mb-8">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Terminal}
              title="Multiple Languages"
              description="Support for various programming languages including C++, Java, Python, and more."
            />
            <FeatureCard
              icon={Code2}
              title="Real-time Collaboration"
              description="Work on projects together with real-time code sharing and editing."
            />
            <FeatureCard
              icon={Book}
              title="Integrated Learning"
              description="Access tutorials and documentation right within the IDE for seamless learning."
            />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <div className="inline-block bg-gray-800 text-lg text-slate-100 px-4 py-2 rounded-full">
            <Zap className="inline-block mr-2" />
            Start coding in your browser today!
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Home;
