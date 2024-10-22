import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import Button from "@mui/material/Button";

const UserMenu = ({ isMenuOpen, toggleMenu, handleLogout }) => (
  <div className="relative">
    <button
      onClick={toggleMenu}
      className="flex items-center space-x-2 focus:outline-none"
    >
      <img
        src="/profile.jpeg"
        alt="User Avatar"
        className="w-8 h-8 rounded-full"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </button>
    {isMenuOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
        <NavLink
          to="/profile"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Profile
        </NavLink>
        <NavLink
          to="/settings"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Settings
        </NavLink>
        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    )}
  </div>
);

const MobileMenu = ({ isMenuOpen, toggleMenu }) => (
  <div className="md:hidden mt-4">
    <button
      onClick={toggleMenu}
      className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
    >
      <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
        {isMenuOpen ? (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
          />
        ) : (
          <path
            fillRule="evenodd"
            d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
          />
        )}
      </svg>
    </button>
    {isMenuOpen && (
      <nav className="mt-2">
        <ul className="flex flex-col space-y-2">
          <li>
            <Link
              to="/"
              className="block hover:text-purple-400 transition-colors"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/ide"
              className="block hover:text-purple-400 transition-colors"
            >
              IDE
            </Link>
          </li>
          <li>
            <Link
              to="/pricing"
              className="block hover:text-purple-400 transition-colors"
            >
              Pricing
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="block hover:text-purple-400 transition-colors"
            >
              About
            </Link>
          </li>
        </ul>
      </nav>
    )}
  </div>
);

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate("/login");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="shadow sticky z-50 top-0 h-20 py-5 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-purple-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-2xl font-bold">PSTU LAB IDE</span>
            </Link>
            <nav className="md:block">
              <ul className="flex space-x-6">
                {["Home", "IDE", "Records", "Pricing", "Contact"].map(
                  (item) => (
                    <li key={item}>
                      <NavLink
                        to={`/${
                          item == "Home"
                            ? ""
                            : item == "IDE"
                            ? "editor"
                            : item.toLowerCase()
                        }`}
                        className={({ isActive }) =>
                          `${
                            isActive ? "text-purple-400" : ""
                          } hover:text-purple-400 transition-colors`
                        }
                      >
                        {item}
                      </NavLink>
                    </li>
                  )
                )}
              </ul>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <UserMenu
                isMenuOpen={isMenuOpen}
                toggleMenu={toggleMenu}
                handleLogout={handleLogout}
              />
            ) : (
              <Button
                variant="outlined"
                onClick={handleLogin}
                endIcon={<LoginIcon />}
                className="px-4 py-2 hover:text-white hover:bg-blue-700 rounded"
                color="primary"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
