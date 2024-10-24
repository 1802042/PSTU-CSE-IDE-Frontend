import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { cva } from "class-variance-authority";
import { Label } from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  UserIcon,
  MailIcon,
  LockIcon,
  UserCircleIcon,
  ImageIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

const REGISTER_URL = "users/register";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline:
          "border border-input hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 py-2 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = ({ className, variant, size, asChild = false, ...props }) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={buttonVariants({ variant, size, className })} {...props} />
  );
};

const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={`flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    ref={ref}
    {...props}
  />
));

const AvatarPreview = ({ avatar }) => (
  <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-blue-500">
    {avatar ? (
      <img
        src={avatar}
        alt="Avatar preview"
        className="w-full h-full object-cover"
      />
    ) : (
      <UserCircleIcon className="w-full h-full p-2 text-gray-400" />
    )}
  </div>
);

const FormField = ({
  id,
  inputRef,
  label,
  type = "text",
  icon: Icon,
  ...props
}) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium text-white">
      {label}
    </Label>
    <div className="relative">
      <Icon className="absolute left-3 top-3 h-5 w-5 text-white" />
      <Input id={id} ref={inputRef} type={type} className="pl-10" {...props} />
    </div>
  </div>
);

const RegisterForm = ({
  handleAvatarChange,
  usernameRef,
  avatar,
  previewAvatar,
  formData,
  handleInputChange,
  handleSubmit,
}) => (
  <form className="space-y-6" onSubmit={handleSubmit}>
    <FormField
      id="username"
      inputRef={usernameRef}
      label="Username"
      icon={UserIcon}
      placeholder="Your Username"
      required
      value={formData.username}
      onChange={handleInputChange}
    />
    <FormField
      id="email"
      label="Email"
      type="email"
      icon={MailIcon}
      placeholder="Your Email"
      required
      value={formData.email}
      onChange={handleInputChange}
    />
    <FormField
      id="fullname"
      label="Full Name"
      icon={UserCircleIcon}
      placeholder="Your Full Name"
      required
      value={formData.fullname}
      onChange={handleInputChange}
    />
    <FormField
      id="password"
      label="Password"
      type="password"
      icon={LockIcon}
      placeholder="Your Password"
      required
      value={formData.password}
      onChange={handleInputChange}
    />
    <div className="space-y-2">
      <Label htmlFor="avatar" className="text-sm font-medium text-white">
        Avatar
      </Label>
      <div className="flex items-center space-x-4">
        <AvatarPreview avatar={previewAvatar} />
        <div className="relative flex-1">
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleAvatarChange}
          />
          <Button type="button" variant="outline" className="w-full">
            <ImageIcon className="mr-2 h-4 w-4" />
            Upload Avatar
          </Button>
        </div>
      </div>
    </div>
    <Button
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
    >
      Register
    </Button>
  </form>
);

export default function Register() {
  const usernameRef = useRef();

  const [avatar, setAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullname: "",
    password: "",
  });

  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const fireToast = (message, success) => {
    success
      ? toast.success(message, {
          position: "top-center",
          autoClose: 3500,
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
          autoClose: 3500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!avatar || !formData) {
      fireToast("Insert into all the fields!", false);
    } else {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("fullName", formData.fullname);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("avatar", avatar);

      try {
        await axios.post(REGISTER_URL, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });

        fireToast("You have registered successfully!", true);

        setFormData({
          username: "",
          password: "",
          email: "",
          fullname: "",
        });
        setAvatar(null);
        setPreviewAvatar(null);
        navigate("/login");
      } catch (error) {
        usernameRef.current.focus();
        const status = error.response?.data?.status;
        if (!status) {
          fireToast("Something Went Wrong!", false);
        } else if (status == "400") {
          fireToast("Wrong Input Data Format!", false);
        } else if (status == "409") {
          fireToast("Username or Email Already Exists!", false);
        } else if (status == "413") {
          fireToast("Too Large Image Uploaded!", false);
        } else if (status == "500") {
          fireToast("Something Went Wrong Creating User! Try Again!", false);
        } else {
          fireToast("Something Went Wrong!", false);
        }
      }
    }
  };

  return (
    <div className="h-[calc(100vh-20px-40px)] flex flex-col lg:flex-row">
      <ToastContainer />
      <div className="lg:flex-1 bg-gray-900 text-white p-8 lg:p-16 flex items-center justify-center relative overflow-hidden">
        <div className="w-full max-w-md z-10">
          <h2 className="text-3xl font-bold text-white mb-8">
            Create Your Account
          </h2>
          <RegisterForm
            handleAvatarChange={handleAvatarChange}
            usernameRef={usernameRef}
            avatar={avatar}
            previewAvatar={previewAvatar}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Login Now
            </Link>
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full -mt-16 -mr-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400 rounded-full -mb-16 -ml-16"></div>
      </div>
    </div>
  );
}
