import React, { useState } from "react";
import { MessageSquareIcon, StarIcon, SendIcon } from "lucide-react";

export function FeedbackSection() {
  const [newFeedback, setNewFeedback] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [rating, setRating] = useState(0);

  // Mock feedback data
  const feedbackHistory = [
    {
      id: "FB-001",
      date: "2023-06-10",
      category: "Driver",
      message: "The bus driver is very professional and always on time.",
      rating: 5,
      status: "resolved",
      response:
        "Thank you for your positive feedback! We're glad to hear about your experience.",
    },
    {
      id: "FB-002",
      date: "2023-06-05",
      category: "Service",
      message: "The bus was a bit late today due to traffic.",
      rating: 3,
      status: "responded",
      response:
        "We apologize for the delay. We're working on optimizing our routes.",
    },
    {
      id: "FB-003",
      date: "2023-06-01",
      category: "General",
      message: "Would it be possible to add a new stop near the library?",
      rating: 4,
      status: "pending",
    },
  ];

  const categories = [
    { id: "general", label: "General" },
    { id: "driver", label: "Driver" },
    { id: "service", label: "Service" },
    { id: "route", label: "Route" },
    { id: "safety", label: "Safety" },
  ];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "responded":
        return "bg-amber-100 text-amber-800";
      case "pending":
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSubmitFeedback = () => {
    setNewFeedback("");
    setRating(0);
    setSelectedCategory("general");
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Feedback</h1>
        <p className="text-gray-500 mt-1">
          Share your experience with our bus service
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Submit Feedback
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-1 rounded-full transition-colors ${
                  star <= rating ? "text-amber-500" : "text-gray-300"
                }`}
              >
                <StarIcon
                  className="h-6 w-6"
                  fill={star <= rating ? "currentColor" : "none"}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-amber-100 text-amber-800 border-2 border-amber-300"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Feedback
          </label>
          <textarea
            value={newFeedback}
            onChange={(e) => setNewFeedback(e.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <button
          onClick={handleSubmitFeedback}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center"
        >
          <SendIcon className="h-4 w-4 mr-2" />
          Submit Feedback
        </button>
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Feedback History
      </h2>
      <div className="space-y-4">
        {feedbackHistory.map((feedback) => (
          <div
            key={feedback.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-900">
                    {feedback.category}
                  </span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-sm text-gray-500">
                    {new Date(feedback.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-4 w-4 ${
                        i < feedback.rating ? "text-amber-500" : "text-gray-300"
                      }`}
                      fill={i < feedback.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                  feedback.status
                )}`}
              >
                {feedback.status.charAt(0).toUpperCase() +
                  feedback.status.slice(1)}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{feedback.message}</p>
            {feedback.response && (
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <div className="flex items-center text-sm font-medium text-gray-900 mb-2">
                  <MessageSquareIcon className="h-4 w-4 mr-2 text-amber-500" />{" "}
                  Response
                </div>
                <p className="text-gray-600">{feedback.response}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
