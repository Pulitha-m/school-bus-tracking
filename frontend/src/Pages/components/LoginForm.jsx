import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import axios from "axios";
import backendUrl from "../../config/config";

const LoginForm = ({ onForgotPassword }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        backendUrl + "/auth/login" ||
          "http://localhost:8080/auth/login" ||
          "https://36f5-2402-d000-813c-1628-dd5b-b31d-b16b-4aba.ngrok-free.app/auth/login",
        {
          username,
          password,
        }
      );

      console.log("Login successful:", response.data);

      // Save user info in sessionStorage
      const userData = response.data;
      sessionStorage.setItem("user", JSON.stringify(userData));

      // Handle remember me functionality
      if (rememberMe) {
        localStorage.setItem(
          "rememberedUser",
          JSON.stringify({
            username,
            rememberMe: true,
          })
        );
      } else {
        localStorage.removeItem("rememberedUser");
      }

      // Redirect based on role
      const role = userData.role;
      if (role === "ADMIN") {
        window.location.href = "/admin/dashboard";
      } else if (role === "DRIVER") {
        window.location.href = "/driver/profile";
      } else if (role === "STUDENT") {
        window.location.href = "/student/profile";
      }
    } catch (error) {
      console.error("Error during login:", error.response || error.message);
      setErrorMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="mb-4 p-3 text-red-600 bg-red-100 rounded-lg text-center text-sm">
          {errorMessage}
        </div>
      )}

      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
          placeholder="Enter your username"
          required
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="h-4 w-4 text-yellow-500 focus:ring-yellow-400 border-gray-300 rounded"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-700"
          >
            Remember me
          </label>
        </div>
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm font-medium text-yellow-600 hover:text-yellow-500 transition-colors"
        >
          Forgot password?
        </button>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.99]"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing in...
            </span>
          ) : (
            "Sign in"
          )}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
