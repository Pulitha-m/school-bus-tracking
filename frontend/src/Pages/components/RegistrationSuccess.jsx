import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const RegistrationSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      console.log("Stripe session completed:", sessionId);
      toast.success(
        "Stripe payment successful! Please check your email for verification."
      );
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-semibold text-green-600 mb-2">
          🎉 Payment Successful!
        </h1>
        <p className="text-gray-700">Thank you for your payment.</p>
        <p className="text-gray-600 mt-2">
          A verification email has been sent to your email address.
        </p>
        <p className="text-sm text-gray-400 mt-4">Session ID: {sessionId}</p>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
