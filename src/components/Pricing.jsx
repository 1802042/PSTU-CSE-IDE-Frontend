import React from "react";
import { Check } from "lucide-react";

const PricingCard = ({ tier }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg divide-y divide-gray-700 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
    <div className="p-6">
      <h3 className="text-lg leading-6 font-medium text-white">{tier.name}</h3>
      <p className="mt-4 text-sm text-gray-300">{tier.description}</p>
      <p className="mt-8">
        <span className="text-4xl font-extrabold text-white">{tier.price}</span>
        {tier.name !== "Enterprise" && (
          <span className="text-base font-medium text-gray-400">/month</span>
        )}
      </p>
      <a
        href="#"
        className={`mt-8 block w-full ${
          tier.name === "Pro"
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-700 hover:bg-gray-600"
        } border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center transition-colors duration-300`}
      >
        {tier.name === "Enterprise" ? "Contact Sales" : "Get started"}
      </a>
    </div>
    <div className="pt-6 pb-8 px-6">
      <h4 className="text-sm font-medium text-gray-300 tracking-wide uppercase">
        What's included
      </h4>
      <ul className="mt-6 space-y-4">
        {tier.features.map((feature) => (
          <li key={feature} className="flex space-x-3">
            <Check
              className="flex-shrink-0 h-5 w-5 text-green-400"
              aria-hidden="true"
            />
            <span className="text-sm text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const Pricing = () => {
  const tiers = [
    {
      name: "Free",
      price: "0",
      description: "For hobbyists and learners",
      features: [
        "100 Free submissions",
        "100MB storage",
        "Community support",
        "Basic IDE features",
      ],
    },
    {
      name: "Pro",
      price: "1,000৳",
      description: "For professional developers",
      features: [
        "1000 Submissions per day",
        "10GB storage",
        "Priority support",
        "Advanced IDE features",
        "Collaboration tools",
        "Custom themes",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For teams and organizations",
      features: [
        "Unlimited Submissions",
        "Unlimited storage",
        "24/7 dedicated support",
        "Advanced security features",
        "Team management",
        "API access",
        "Custom integrations",
      ],
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-20px)] bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Choose the Right Plan for You
          </h2>
          <p className="mt-4 text-xl text-gray-300">
            Whether you're a hobbyist, professional, or large team, we have a
            plan that fits your needs.
          </p>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
          {tiers.map((tier) => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
