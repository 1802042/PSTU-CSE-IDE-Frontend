import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const technologies = [
  { name: "React", icon: "⚛️" },
  { name: "JavaScript", icon: "𝗝𝗦" },
  { name: "Python", icon: "🐍" },
  { name: "Node.js", icon: "🟢" },
  { name: "TypeScript", icon: "𝗧𝗦" },
  { name: "HTML", icon: "🌐" },
  { name: "CSS", icon: "🎨" },
  { name: "Git", icon: "📂" },
  { name: "Docker", icon: "🐳" },
  { name: "GraphQL", icon: "◢" },
  { name: "Vue", icon: "🟩" },
  { name: "Angular", icon: "🅰️" },
  { name: "Svelte", icon: "🟠" },
  { name: "Next.js", icon: "▲" },
  { name: "Rust", icon: "🦀" },
  { name: "Go", icon: "🐹" },
  { name: "Ruby", icon: "💎" },
  { name: "PHP", icon: "🐘" },
  { name: "Java", icon: "☕" },
  { name: "C#", icon: "🟪" },
];

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen text-white">
      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to Knightshade IDE
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Empower your coding journey with our cutting-edge integrated
            development environment.
          </p>
          <Link
            to="/try-now"
            className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-700 transition duration-300"
          >
            Try Knightshade IDE Now
          </Link>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Supported Technologies
          </h2>
          <div className="relative h-[400px] md:h-[600px]">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                className="absolute"
                initial={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  opacity: 0,
                }}
                animate={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  opacity: 1,
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: index * 0.2,
                }}
              >
                <div className="flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full shadow-lg">
                  <span className="text-2xl" role="img" aria-label={tech.name}>
                    {tech.icon}
                  </span>
                </div>
                <p className="mt-2 text-center text-sm">{tech.name}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">
            Why Choose Knightshade IDE?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">
                Intelligent Code Completion
              </h3>
              <p>
                Advanced AI-powered suggestions to boost your coding
                productivity.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">
                Seamless Integration
              </h3>
              <p>
                Works with your favorite tools and version control systems out
                of the box.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">
                Customizable Workspace
              </h3>
              <p>
                Tailor your development environment to suit your unique
                workflow.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to elevate your coding experience?
          </h2>
          <Link
            to="/signup"
            className="bg-green-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-600 transition duration-300"
          >
            Get Started for Free
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Home;
