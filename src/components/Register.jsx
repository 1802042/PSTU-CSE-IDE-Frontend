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

const Button = ({ className, variant, size, asChild = false, ...props }) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={buttonVariants({ variant, size, className })} {...props} />
  );
};

const Input = ({ className, type, ...props }) => (
  <input
    type={type}
    className={`flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

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

const FormField = ({ id, label, type = "text", icon: Icon, ...props }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium text-white">
      {label}
    </Label>
    <div className="relative">
      <Icon className="absolute left-3 top-3 h-5 w-5 text-white" />
      <Input id={id} type={type} className="pl-10" {...props} />
    </div>
  </div>
);

const RegisterForm = ({ handleAvatarChange, avatar }) => (
  <form className="space-y-6">
    <FormField
      id="username"
      label="Username"
      icon={UserIcon}
      placeholder="Your Username"
      required
    />
    <FormField
      id="email"
      label="Email"
      type="email"
      icon={MailIcon}
      placeholder="Your Email"
      required
    />
    <FormField
      id="fullname"
      label="Full Name"
      icon={UserCircleIcon}
      placeholder="Your Full Name"
      required
    />
    <FormField
      id="password"
      label="Password"
      type="password"
      icon={LockIcon}
      placeholder="Your Password"
      required
    />
    <div className="space-y-2">
      <Label htmlFor="avatar" className="text-sm font-medium text-white">
        Avatar
      </Label>
      <div className="flex items-center space-x-4">
        <AvatarPreview avatar={avatar} />
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
    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
      Register
    </Button>
  </form>
);

export default function Register() {
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
      <div className="lg:flex-1 bg-gray-900 text-white p-8 lg:p-16 flex items-center justify-center relative overflow-hidden">
        <div className="w-full max-w-md z-10">
          <h2 className="text-3xl font-bold text-white mb-8">
            Create Your Account
          </h2>
          <RegisterForm
            handleAvatarChange={handleAvatarChange}
            avatar={avatar}
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
