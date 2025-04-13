import React, { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";

const ForgotPasswordForm = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    setIsLoading(false);
  };

  if (isSubmitted) {
    return (
      <div className="text-center animate-fadeIn">
        <div className="bg-green-50 rounded-lg p-6 mb-6">
          <h3 className="text-green-800 font-medium mb-2">Check your email</h3>
          <p className="text-green-700 text-sm">
            We've sent password reset instructions to <strong>{email}</strong>
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-sm font-medium text-yellow-600 hover:text-yellow-500 transition-colors"
        >
          Back to login
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <button
        onClick={onBack}
        className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeftIcon size={16} className="mr-2" />
        Back to login
      </button>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition-shadow"
            placeholder="you@example.com"
            required
          />
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
                Sending...
              </span>
            ) : (
              "Send Reset Instructions"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
