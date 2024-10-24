import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Avatar,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
} from "@mui/material";
import {
  Login as LoginIcon,
  AccountCircle,
  Settings,
  Logout,
  AdminPanelSettings,
  School,
  Notifications,
  Email,
  CalendarMonth,
} from "@mui/icons-material";
import useAuth from "../hooks/useAuth.js"; // Adjust the path as needed
import useLogout from "../hooks/useLogout.js";
import useRefreshToken from "../hooks/useRefreshToken.js";

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isMenuOpen = Boolean(anchorEl);
  const { auth } = useAuth();
  const logout = useLogout();
  const refreshAccessToken = useRefreshToken();
  const [isLoading, setIsLoading] = useState(true);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseMenu();
    localStorage.removeItem("persist");
    navigate("/login", {
      state: { from: location },
      replace: true,
    });
  };

  const handleLogin = () => {
    navigate("/login", {
      state: { from: location },
      replace: true,
    });
  };

  useEffect(() => {
    const checkUser = async () => {
      if (!auth?.user) {
        await refreshAccessToken();
      }
    };
    checkUser();
  }, [auth]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, []);

  if (!auth?.user) {
    return (
      <>
        {isLoading ? (
          <> </>
        ) : (
          <Button
            variant="contained"
            onClick={handleLogin}
            startIcon={<LoginIcon />}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Login
          </Button>
        )}
      </>
    );
  }

  // Check if user exists in auth object
  if (!auth?.user) {
    return (
      <Button
        variant="contained"
        onClick={handleLogin}
        startIcon={<LoginIcon />}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        Login
      </Button>
    );
  }

  const { fullName, username, avatarUrl, role, email, createdAt } = auth.user;
  const joinDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center space-x-4">
      {/* Notifications Badge */}
      <Badge badgeContent={3} color="error" className="cursor-pointer">
        <Notifications className="text-gray-300 hover:text-white transition-colors" />
      </Badge>

      {/* User Menu Button */}
      <div
        className="flex items-center space-x-3 cursor-pointer group"
        onClick={handleOpenMenu}
      >
        <Avatar
          src={avatarUrl || "/default-avatar.png"} // Fallback to default avatar if URL is missing
          alt={fullName}
          className="ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-800 transform group-hover:scale-105 transition-all duration-200"
        />
        <div className="hidden md:block text-left">
          <div className="text-sm font-semibold group-hover:text-purple-400 transition-colors">
            {fullName}
          </div>
          <div className="text-xs text-gray-400">
            {role === "admin" ? (
              <div className="flex items-center">
                <AdminPanelSettings className="w-3 h-3 mr-1" />
                Administrator
              </div>
            ) : (
              <div className="flex items-center">
                <School className="w-3 h-3 mr-1" />
                Student
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Menu with User Details */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleCloseMenu}
        className="mt-2"
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 3,
          className: "w-72 bg-gray-900 text-white",
        }}
      >
        <div className="px-4 py-3 bg-gradient-to-r from-purple-800 to-blue-900">
          <div className="flex items-center space-x-3">
            <Avatar
              src={avatarUrl || "/default-avatar.png"}
              alt={fullName}
              className="ring-2 ring-white"
            />
            <div>
              <div className="text-white font-semibold">{fullName}</div>
              <div className="text-purple-200 text-sm">ID: {username}</div>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 bg-gradient-to-r from-purple-800 to-blue-900">
          <div className="flex items-center text-sm text-gray-300 mb-1 truncate">
            <Email className="w-4 h-4 mr-2 flex-shrink-0" />
            {email}
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <CalendarMonth className="w-4 h-4 mr-2 flex-shrink-0" />
            Joined {joinDate}
          </div>
        </div>

        <Divider className="bg-gray-700" />

        <MenuItem
          onClick={() => {
            navigate("/profile");
            handleCloseMenu();
          }}
          className="px-4 py-3 text-white bg-gradient-to-r from-purple-800 to-blue-900"
        >
          <ListItemIcon>
            <AccountCircle className="text-white" />
          </ListItemIcon>
          <ListItemText primary="Update Profile" className="text-white" />
        </MenuItem>

        {role === "admin" && (
          <MenuItem
            onClick={() => {
              navigate("/dashboard");
              handleCloseMenu();
            }}
            className="px-4 py-3 text-white bg-gradient-to-r from-purple-800 to-blue-900"
          >
            <ListItemIcon>
              <AdminPanelSettings className="text-white" />
            </ListItemIcon>
            <ListItemText primary="Admin Dashboard" className="text-white" />
          </MenuItem>
        )}

        <MenuItem
          onClick={handleLogout}
          className="px-4 py-3 bg-gradient-to-r from-purple-800 to-blue-900"
        >
          <ListItemIcon>
            <Logout className="text-white" />
          </ListItemIcon>
          <ListItemText primary="Logout" className="text-white" />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default function Header() {
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
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                {["Home", "IDE", "Records", "Pricing", "Contact"].map(
                  (item) => (
                    <li key={item}>
                      <NavLink
                        to={`/${
                          item === "Home"
                            ? ""
                            : item === "IDE"
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
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
