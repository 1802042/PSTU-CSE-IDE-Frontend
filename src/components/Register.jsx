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
      {/* Form Section */}
      <div className="lg:flex-1 bg-gray-900 text-white p-8 lg:p-16 flex items-center justify-center relative overflow-hidden">
        <div className="w-full max-w-md z-10">
          <h2 className="text-3xl font-bold text-white mb-8">
            Create Your Account
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
                htmlFor="fullname"
                className="text-sm font-medium text-white"
              >
                Full Name
              </Label>
              <div className="relative">
                <UserCircleIcon className="absolute left-3 top-3 h-5 w-5 text-white" />
                <Input
                  id="fullname"
                  placeholder="Your Full Name"
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

            <div className="space-y-2">
              <Label
                htmlFor="avatar"
                className="text-sm font-medium text-white"
              >
                Avatar
              </Label>
              <div className="flex items-center space-x-4">
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

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </a>
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full -mt-16 -mr-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400 rounded-full -mb-16 -ml-16"></div>
      </div>
    </div>
  );
}

// import React, { useState } from "react";
// import { cva } from "class-variance-authority";
// import { Label } from "@radix-ui/react-label";
// import { Slot } from "@radix-ui/react-slot";
// import {
//   UserIcon,
//   MailIcon,
//   LockIcon,
//   UserCircleIcon,
//   ImageIcon,
// } from "lucide-react";

// const buttonVariants = cva(
//   "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
//   {
//     variants: {
//       variant: {
//         default: "bg-blue-600 text-white hover:bg-blue-700",
//         outline: "border border-gray-600 hover:bg-gray-700 text-gray-300",
//       },
//       size: {
//         default: "h-10 py-2 px-4",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   }
// );

// function Button({ className, variant, size, asChild = false, ...props }) {
//   const Comp = asChild ? Slot : "button";
//   return (
//     <Comp className={buttonVariants({ variant, size, className })} {...props} />
//   );
// }

// function Input({ className, type, ...props }) {
//   return (
//     <input
//       type={type}
//       className={`flex h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
//       {...props}
//     />
//   );
// }

// export default function Register() {
//   const [avatar, setAvatar] = useState(null);

//   const handleAvatarChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setAvatar(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className="h-full px-5 py-2 flex flex-col lg:flex-row bg-gray-900 text-white">
//       {/* Image Background Section */}
//       <div className="lg:flex-1 bg-gray-800 relative overflow-hidden hidden lg:block">
//         <img
//           src="/placeholder.svg?height=1080&width=1920"
//           alt="Registration background"
//           className="absolute inset-0 w-full h-full object-cover opacity-50"
//         />
//         <div className="absolute inset-0 bg-blue-900 bg-opacity-50 flex items-center justify-center">
//           <h1 className="text-white text-4xl font-bold text-center px-4">
//             Welcome to Our Platform
//           </h1>
//         </div>
//       </div>

//       {/* Form Section */}
//       <div className="lg:flex-1 bg-gray-900 p-8 lg:p-16 flex items-center justify-center">
//         <div className="w-full max-w-md">
//           <h2 className="text-3xl font-bold text-white mb-8 lg:hidden">
//             Create Your Account
//           </h2>
//           <form className="space-y-6">
//             <div className="space-y-2">
//               <Label
//                 htmlFor="username"
//                 className="text-sm font-medium text-gray-300"
//               >
//                 Username
//               </Label>
//               <div className="relative">
//                 <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <Input
//                   id="username"
//                   placeholder="Your Username"
//                   required
//                   className="pl-10"
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label
//                 htmlFor="email"
//                 className="text-sm font-medium text-gray-300"
//               >
//                 Email
//               </Label>
//               <div className="relative">
//                 <MailIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="Your Email"
//                   required
//                   className="pl-10"
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label
//                 htmlFor="fullname"
//                 className="text-sm font-medium text-gray-300"
//               >
//                 Full Name
//               </Label>
//               <div className="relative">
//                 <UserCircleIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <Input
//                   id="fullname"
//                   placeholder="Your Full Name"
//                   required
//                   className="pl-10"
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label
//                 htmlFor="password"
//                 className="text-sm font-medium text-gray-300"
//               >
//                 Password
//               </Label>
//               <div className="relative">
//                 <LockIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="Your Password"
//                   required
//                   className="pl-10"
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label
//                 htmlFor="confirmPassword"
//                 className="text-sm font-medium text-gray-300"
//               >
//                 Confirm Password
//               </Label>
//               <div className="relative">
//                 <LockIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <Input
//                   id="confirmPassword"
//                   type="password"
//                   placeholder="Confirm Password"
//                   required
//                   className="pl-10"
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label
//                 htmlFor="avatar"
//                 className="text-sm font-medium text-gray-300"
//               >
//                 Avatar
//               </Label>
//               <div className="flex items-center space-x-4">
//                 <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-700 border-2 border-blue-500">
//                   {avatar ? (
//                     <img
//                       src={avatar}
//                       alt="Avatar preview"
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <UserCircleIcon className="w-full h-full p-2 text-gray-400" />
//                   )}
//                 </div>
//                 <div className="relative flex-1">
//                   <Input
//                     id="avatar"
//                     type="file"
//                     accept="image/*"
//                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                     onChange={handleAvatarChange}
//                   />
//                   <Button
//                     type="button"
//                     variant="outline"
//                     className="w-full text-gray-900"
//                   >
//                     <ImageIcon className="mr-2 h-4 w-4" />
//                     Upload Avatar
//                   </Button>
//                 </div>
//               </div>
//             </div>

//             <Button className="w-full">Register</Button>
//           </form>

//           <p className="mt-6 text-center text-sm text-gray-400">
//             Already have an account?{" "}
//             <a
//               href="#"
//               className="font-medium text-blue-500 hover:text-blue-400"
//             >
//               Sign in
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
