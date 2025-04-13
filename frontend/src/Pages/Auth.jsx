import React, { useState } from "react";
import { BusIcon, MapPinIcon, UsersIcon, RouterIcon } from "lucide-react";
import LoginForm from "./components/LoginForm";
import MultiStepRegisterForm from "./components/RegisterForm";
import ForgotPasswordForm from "./components/ForgotPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Auth = () => {
  const [currentView, setCurrentView] = useState("login");
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: <MapPinIcon size={20} />,
      text: "Real-time GPS tracking",
      description: "Track your buses with live location updates",
    },
    {
      icon: <UsersIcon size={20} />,
      text: "Student attendance management",
      description: "Monitor student presence in real-time",
    },
    {
      icon: <RouterIcon size={20} />,
      text: "Route optimization",
      description: "Get the most efficient routes automatically",
    },
  ];

  const getFormTitle = () => {
    switch (currentView) {
      case "login":
        return {
          title: "Sign in to your account",
          subtitle: "Enter your credentials to access your account",
        };
      case "register":
        return {
          title: "Create your account",
          subtitle: "Fill in the information to get started",
        };
      case "forgot":
        return {
          title: "Reset your password",
          subtitle: "We'll send you instructions to reset your password",
        };
      default:
        return { title: "", subtitle: "" };
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Left - Branding Panel */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-zinc-900 to-black text-white p-8 flex flex-col justify-center items-center relative overflow-hidden rounded-xl md:rounded-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] rounded-xl md:rounded-none" />
        <div className="max-w-md mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6 transform hover:scale-105 transition-transform duration-300">
            <div className="bg-yellow-400 p-4 rounded-2xl shadow-lg hover:shadow-yellow-400/50 transition-shadow">
              <BusIcon size={48} className="text-black" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            SafeTrack
          </h1>
          <p className="text-lg mb-8 text-gray-300">
            {currentView === "register"
              ? "Register your student and proceed to pay the fare online."
              : "Track and manage your school buses in real-time with our platform."}
          </p>
          <div className="h-px w-20 mx-auto mb-8 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center group p-3 rounded-xl transition-all duration-300 hover:bg-white/5"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="bg-yellow-400 p-2 rounded-xl mr-4 transform group-hover:scale-110 transition-transform">
                  <div className="text-black">{feature.icon}</div>
                </div>
                <div className="text-left">
                  <p className="font-medium">{feature.text}</p>
                  {hoveredFeature === index && (
                    <p className="text-sm text-gray-400 mt-1 animate-fadeIn">
                      {feature.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form Panel */}
      <div className="w-full md:w-1/2 bg-white p-8 flex items-center justify-center rounded-xl md:rounded-none">
        <div className="w-full max-w-md">
          {currentView !== "register" && (
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-black animate-fadeIn">
                {getFormTitle().title}
              </h2>
              <p className="text-gray-600 mt-2 animate-fadeIn">
                {getFormTitle().subtitle}
              </p>
            </div>
          )}

          {currentView === "login" && (
            <div className="animate-fadeIn">
              <div className="flex border border-gray-300 rounded-xl mb-8">
                <button className="flex-1 py-3 bg-yellow-400 text-black font-medium rounded-xl transition-colors">
                  Login
                </button>
                <button
                  className="flex-1 py-3 bg-white text-gray-600 rounded-xl transition-colors hover:bg-gray-50"
                  onClick={() => setCurrentView("register")}
                >
                  Register
                </button>
              </div>
              <LoginForm onForgotPassword={() => setCurrentView("forgot")} />
            </div>
          )}

          {currentView === "register" && (
            <div className="animate-fadeIn">
              <MultiStepRegisterForm />
              <p className="text-sm text-center text-gray-500 mt-6">
                Already have an account?{" "}
                <button
                  className="text-yellow-600 font-medium"
                  onClick={() => setCurrentView("login")}
                >
                  Login here
                </button>
              </p>
            </div>
          )}

          {currentView === "forgot" && (
            <div className="animate-fadeIn">
              <ForgotPasswordForm onBack={() => setCurrentView("login")} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
