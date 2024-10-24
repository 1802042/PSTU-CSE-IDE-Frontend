import React, { useState, useEffect } from "react";
import { Camera, Save, Edit, User, Mail, Loader } from "lucide-react";
import useAuth from "../hooks/useAuth.js";
import { format } from "date-fns";
import { axiosPrivate } from "../api/axios.js";
import { toast, Bounce } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const PASSWORD_URL = "users/reset-password";
const AVATAR_URL = "users/reset-avatar";

const Profile = () => {
  const { auth, setAuth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [profileImage, setProfileImage] = useState(auth.user?.avatarUrl);
  const navigate = useNavigate();
  const location = useLocation();

  let keepImage = null;
  let submissionCount = 131;

  const formData = {
    username: auth.user?.username,
    fullName: auth.user?.fullName,
    email: auth.user?.email,
    joinDate: format(new Date(auth.user?.createdAt), "PP"),
  };

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fireToast = (message, success) => {
    success
      ? toast.success(message, {
          position: "top-center",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        })
      : toast.error(message, {
          position: "top-center",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
  };

  const handleInputChange = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      fireToast("Image not uploaded!", false);
      return;
    }
    keepImage = profileImage;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);

    const formDataToSend = new FormData();
    formDataToSend.append("avatar", file);

    try {
      const response = await axiosPrivate.post(AVATAR_URL, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      fireToast("Avatar updated successfully!", true);
      setProfileImage(response.data?.data.avatarUrl);
      keepImage = null;
      setAuth((prev) => {
        prev.avatarUrl = response.data?.data.avatarUrl;
        return prev;
      });
    } catch (error) {
      setProfileImage(keepImage);
      keepImage = null;
      const status = error.response?.data?.status;
      if (!status) {
        fireToast("Something Went Wrong!", false);
      } else if (status == "400") {
        fireToast("Upload file missing!", false);
      } else if (status == "401" || status == "403") {
        fireToast("Please login to perform this operation!", false);
        navigate("/login", {
          state: { from: location },
          replace: true,
        });
      } else if (status == "413") {
        fireToast("Too Large Image Uploaded!", false);
      } else if (status == "500") {
        fireToast("Something Went Wrong Creating User! Try Again!", false);
      } else {
        fireToast("Something Went Wrong!", false);
      }
    }
  };

  const updatePassword = async () => {
    if (password.newPassword !== password.confirmPassword) {
      fireToast("Password does not match!", false);
      return;
    }
    setIsLoading(true);
    try {
      await axiosPrivate.post(
        PASSWORD_URL,
        {
          oldPassword: password.currentPassword,
          newPassword: password.confirmPassword,
        },
        {
          withCredentials: true,
        }
      );
      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      fireToast("Password updated successfully!", true);
    } catch (err) {
      const status = err.response?.data?.status;
      console.log(`status  =  ${status}`);
      if (!status) {
        fireToast("Something Went Wrong 1!");
      } else if (status == "400") {
        fireToast("Passwords must be atlest 8 characters!");
      } else if (status == 401) {
        fireToast("Incorrect old password!", false);
      } else if (status == 403) {
        fireToast("Please login to perform this operation!", false);
        navigate("/login", {
          state: { from: location },
          replace: true,
        });
      } else if (status == "500") {
        fireToast("Something Went Wrong When Logging! Try Again!");
      } else {
        fireToast("Something Went Wrong!");
      }
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  return (
    <div className="h-[calc(100vh-20px-40px)] bg-gray-900 text-gray-100 py-2 ">
      <div className="max-w-4xl mx-auto p-2 space-y-2">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        {/* Profile Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <p className="text-gray-400 mb-6">Manage your account information</p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Profile Picture Column */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-40 h-40 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-4 border-gray-600">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-20 h-20 text-gray-500" />
                  )}
                </div>
                <label
                  htmlFor="profile-picture"
                  className="absolute bottom-0 right-0 bg-gray-700 p-2 rounded-full cursor-pointer hover:bg-gray-600 transition-colors"
                >
                  <Camera className="w-5 h-5 text-gray-300" />
                  <input
                    id="profile-picture"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-400">
                  Joined {formData.joinDate}
                </p>
              </div>
            </div>

            {/* User Details Column */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Username
                </label>
                <div className="bg-gray-700 p-3 rounded-md flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-200">{formData.username}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Full Name
                </label>
                <div className="bg-gray-700 p-3 rounded-md flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-200">{formData.fullName}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email Address
                </label>
                <div className="bg-gray-700 p-3 rounded-md flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-200">{formData.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-gray-400">
                Update your password to keep your account secure
              </p>
            </div>
            <button
              onClick={() =>
                isEditing ? updatePassword() : setIsEditing(true)
              }
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : isEditing ? (
                <Save className="w-5 h-5" />
              ) : (
                <Edit className="w-5 h-5" />
              )}
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                placeholder="insert current password"
                disabled={!isEditing || isLoading}
                value={password.currentPassword}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                placeholder="insert new password"
                disabled={!isEditing || isLoading}
                value={password.newPassword}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="confirm new password"
                disabled={!isEditing || isLoading}
                value={password.confirmPassword}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
