import React, { useState } from "react";
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
import { Link } from "react-router-dom";

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

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={buttonVariants({ variant, size, className })} {...props} />
  );
}

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

export default function Login() {
  const [avatar, setAvatar] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Form Section */}
      <div className="lg:flex-1 bg-gray-900 text-white p-8 lg:p-16 flex items-center justify-center relative overflow-hidden">
        <div className="w-full max-w-md z-10">
          <h2 className="text-3xl font-bold text-white mb-8">
            Log into Your Account
          </h2>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-white"
              >
                Username
              </Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-5 w-5 text-white" />
                <Input
                  id="username"
                  placeholder="Your Username"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-white">
                Email
              </Label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-3 h-5 w-5 text-white" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Your Email"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-white"
              >
                Password
              </Label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-3 h-5 w-5 text-white" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Your Password"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
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

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full -mt-16 -mr-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400 rounded-full -mb-16 -ml-16"></div>
      </div>
    </div>
  );
}
