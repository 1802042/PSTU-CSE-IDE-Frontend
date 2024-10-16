import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaFacebook,
  FaGlobe,
  FaPython,
  FaJsSquare,
  FaReact,
  FaNodeJs,
  FaDocker,
  FaGitAlt,
  FaLinux,
} from "react-icons/fa";

import { SiCplusplus, SiMongodb, SiPostgresql, SiRedis } from "react-icons/si"; // Additional icons

// New card for Languages and Technologies
const technologies = [
  { name: "JavaScript", icon: <FaJsSquare /> },
  { name: "PostgreSQL", icon: <SiPostgresql /> },
  { name: "C++", icon: <SiCplusplus /> },
  { name: "Node.js", icon: <FaNodeJs /> },
  { name: "MongoDB", icon: <SiMongodb /> },
  { name: "Python", icon: <FaPython /> },
  { name: "React.js", icon: <FaReact /> },
  { name: "Redis", icon: <SiRedis /> },
  { name: "Docker", icon: <FaDocker /> },
  { name: "Linux", icon: <FaLinux /> },
  { name: "Git", icon: <FaGitAlt /> },
  { name: "Github", icon: <FaGithub /> },
];

const Contact = () => {
  const profile = {
    name: "MD. Rony Mir",
    email: "rony16@cse.pstu.ac.bd",
    bio: "ICPC Asia West Continental Finalist '2021 | Expert at Codeforces | 5★ at Codechef | Full Stack WebDeveloper | President @CSE Club, PSTU",
    photo: "/profile.jpeg", // Replace with your photo
  };

  const items = [
    {
      name: "Backend Repository",
      icon: <FaNodeJs />,
      link: "https://github.com/1802042/IDE-Backend.git",
    },
    {
      name: "Frontend Repository",
      icon: <FaReact />,
      link: "https://github.com/1802042/IDE-Frontend.git",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-20px)] bg-gray-900 text-gray-100 px-5 py-5">
      {/* Profile Section */}
      <div className="flex w-full max-w-5xl bg-gray-800 rounded-lg shadow-lg p-8">
        {/* Profile Image on the left */}
        <div className="flex-shrink-0">
          <img
            src={profile.photo}
            alt="Profile"
            className="rounded-full w-40 h-40 border-4 border-blue-500"
          />
        </div>
        {/* Profile Info on the right */}
        <div className="ml-8">
          <h1 className="text-4xl font-bold mb-2">
            {profile.name}{" "}
            <span role="img" aria-label="wave" className="mr-2">
              👋{" "}
            </span>
          </h1>
          <p className="text-blue-400 mb-2">{profile.email}</p>
          <p className="text-gray-300 max-w-lg">{profile.bio}</p>

          {/* Social Links */}
          <div className="flex space-x-4 mt-6">
            <a
              href="https://github.com/1802042"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://linkedin.com/in/rm1802042"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="mailto:rony16@cse.pstu.ac.bd"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <FaEnvelope size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Card Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full max-w-5xl">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-6 bg-gray-800 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl text-blue-400 hover:text-orange-300">
                {item.icon}
              </div>
              <div className="text-lg font-medium text-gray-200 group-hover:text-blue-300">
                {item.name}
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Languages and Technologies Section (New Card) */}
      <div className="mt-8 w-full max-w-5xl bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6">Languages and Technologies</h2>
        <div className="grid grid-cols-3 gap-6">
          {technologies.map((tech, index) => (
            <div key={index} className="flex items-center space-x-4">
              <span className="text-4xl text-blue-400 hover:text-orange-300">
                {tech.icon}
              </span>
              <span className="text-xl">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
