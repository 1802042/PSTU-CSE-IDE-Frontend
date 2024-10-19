import React, { useState, useEffect, useRef, useContext } from "react";
import { cva } from "class-variance-authority";
import { Label } from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { UserIcon, MailIcon, LockIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import AuthContext from "../context/AuthProvider.context.jsx";
import "react-toastify/dist/ReactToastify.css";
import axios from "../api/axios.js";
const LOGIN_URL = "/users/login";

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

const FormField = ({
  id,
  name,
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  inputRef,
}) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium text-white">
      {label}
    </Label>
    <div className="relative">
      <Icon className="absolute left-3 top-3 h-5 w-5 text-white" />
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="pl-10"
        ref={inputRef}
      />
    </div>
  </div>
);

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { auth, setAuth } = useContext(AuthContext);

  const usernameRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    usernameRef.current.focus();
    const savedFormData = localStorage.getItem("formData");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const clearLocalStorage = () => {
    localStorage.clear();
  };

  const fireToast = (message, success) => {
    success
      ? toast.success(message, {
          position: "top-center",
          autoClose: 3000,
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
          autoClose: 3000,
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
    try {
      const response = await axios.post(LOGIN_URL, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      fireToast("Login successful!", true);
      setTimeout(() => {
        navigate("/");
        setAuth(response.data);
      }, 3200);
    } catch (error) {
      usernameRef.current.focus();
      const status = error.response?.data?.status;
      if (!status) {
        fireToast("Something Went Wrong!", false);
      } else if (status == "400") {
        fireToast("Wrong Input Data Format!", false);
      } else if (status == "401") {
        fireToast("Invalid Credentials!", false);
      } else if (status == "403") {
        fireToast(
          "Email Not Verified! Please Verify Email Before Loggin",
          false
        );
      } else if (status == "500") {
        fireToast("Something Went Wrong When Logging! Try Again!", false);
      } else {
        fireToast("Something Went Wrong!", false);
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <ToastContainer />
      <div className="lg:flex-1 bg-gray-900 text-white p-8 lg:p-16 flex items-center justify-center relative overflow-hidden">
        <div className="w-full max-w-md z-10">
          <h2 className="text-3xl font-bold text-white mb-8">
            Log into Your Account
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <FormField
              id="username"
              name="username"
              label="Username"
              icon={UserIcon}
              value={formData.username}
              onChange={handleChange}
              placeholder="Your Username"
              required
              inputRef={usernameRef}
            />
            <FormField
              id="email"
              name="email"
              type="email"
              label="Email"
              icon={MailIcon}
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
            />
            <FormField
              id="password"
              name="password"
              type="password"
              label="Password"
              icon={LockIcon}
              value={formData.password}
              onChange={handleChange}
              placeholder="Your Password"
              required
            />
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Login
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Register Now
            </Link>
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full -mt-16 -mr-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400 rounded-full -mb-16 -ml-16"></div>
      </div>
    </div>
  );
};

export default Login;
