import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const QuickLinks = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
      <ul>
        <li className="mb-2">
          <Link to="/" className="text-gray-400 hover:text-white">
            Home
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/editor" className="text-gray-400 hover:text-white">
            IDE
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/records" className="text-gray-400 hover:text-white">
            Records
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/pricing" className="text-gray-400 hover:text-white">
            Pricing
          </Link>
        </li>
      </ul>
    </div>
  );

  const FollowUs = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
      <ul>
        <li className="mb-2">
          <Link
            to="https://github.com/1802042"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white"
          >
            GitHub
          </Link>
        </li>
        <li className="mb-2">
          <Link
            to="https://linkedin.com/in/rm1802042"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white"
          >
            LinkedIn
          </Link>
        </li>
        <li className="mb-2">
          <Link
            to="https://www.facebook.com/knightshade.1802042/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white"
          >
            Facebook
          </Link>
        </li>
      </ul>
    </div>
  );

  const ContactUs = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
      <p className="text-gray-400">
        Patuakhali Science and Technology University
      </p>
      <p className="text-gray-400">Dumki, Patuakhali - 8602</p>
      <p className="text-gray-400">Email: rony16@cse.pstu.ac.bd</p>
      <p className="text-gray-400">Phone: (+880) 1742-059121</p>
    </div>
  );

  const LogoSection = () => (
    <div className="mb-4 md:mb-0">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-purple-500 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        PSTU LAB IDE
      </h2>
      <p className="text-gray-400">
        &copy; {currentYear} PSTU LAB IDE. All rights reserved.
      </p>
    </div>
  );

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <LogoSection />
          <QuickLinks />
          <FollowUs />
          <ContactUs />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
