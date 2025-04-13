import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CreditCard, Loader } from "lucide-react";

const StripePayment = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const email = searchParams.get("email");
  const amount = searchParams.get("amount");

  const handleStripeCheckout = async () => {
    if (!email || !amount) {
      toast.error("Missing email or amount");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, amount }),
        }
      );

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to create Stripe session");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error initiating payment");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md text-center">
        <CreditCard className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          Secure Payment
        </h2>
        <p className="text-gray-600 mb-6">You're about to pay:</p>
        <div className="text-3xl font-semibold text-green-600 mb-4">
          Rs. {amount}
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Email: <span className="font-medium">{email}</span>
        </p>
        <button
          onClick={handleStripeCheckout}
          disabled={loading}
          className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
        >
          {loading ? (
            <span className="flex justify-center items-center gap-2">
              <Loader className="animate-spin" size={18} />
              Redirecting...
            </span>
          ) : (
            "Pay with Stripe"
          )}
        </button>
      </div>
    </div>
  );
};

export default StripePayment;
