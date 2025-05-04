import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return setMessage("New passwords do not match.");
    }

    try {
      const response = await fetch(
        `/auth/reset-password?email=${encodeURIComponent(
          email
        )}&newPassword=${encodeURIComponent(newPassword)}`,
        {
          method: "POST",
        }
      );

      const data = await response.text();

      if (response.ok) {
        setMessage("✅ Password successfully updated.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data || "❌ Failed to reset password.");
      }
    } catch (err) {
      setMessage("❌ Error connecting to server.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg shadow-md bg-white mt-10">
      <h2 className="text-2xl font-semibold mb-4">Reset Your Password</h2>
      {message && <p className="text-sm text-red-500 mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
