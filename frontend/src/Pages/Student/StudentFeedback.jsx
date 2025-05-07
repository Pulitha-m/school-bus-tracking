import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BusIcon,
  TrashIcon,
  EyeIcon,
  ThumbsUpIcon,
  ClockIcon,
  UserIcon,
  MessageSquareIcon,
  ShieldIcon,
  EditIcon,
} from "lucide-react";
import backendUrl from "../../config/config";

const Rating = ({ rating }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <span
        key={i}
        className={`text-sm ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
      >
        ★
      </span>
    ))}
  </div>
);

const FeedbackSection = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
    <div className="flex items-center mb-4">
      <Icon className="text-orange-500 mr-2 h-5 w-5" />
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
    {children}
  </div>
);

const FeedbackView = ({ feedback, onBack }) => (
  <div className="max-w-4xl mx-auto p-6">
    <div className="bg-orange-500 text-white rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Feedback Report</h1>
        <button onClick={onBack} className="text-white underline text-sm">
          ← Back to list
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <p>Feedback ID: {feedback.id}</p>
        <p>Submitted At: {new Date(feedback.submittedAt).toLocaleString()}</p>
        <p>Name: {feedback.name}</p>
      </div>
    </div>
    <div className="space-y-4">
      <FeedbackSection icon={ClockIcon} title="Punctuality">
        <div className="space-y-1 text-sm">
          <p>Status: {feedback.punctuality || "N/A"}</p>
          <p>Comment: {feedback.punctualityComment || "No comment provided"}</p>
        </div>
      </FeedbackSection>
      <FeedbackSection icon={UserIcon} title="Driver Behavior">
        <div className="space-y-1 text-sm">
          <p>Was the driver polite? {feedback.driverBehavior || "No"}</p>
          <p>Comment: {feedback.driverExperience || "No comment provided"}</p>
        </div>
      </FeedbackSection>
      <FeedbackSection icon={BusIcon} title="Vehicle Condition">
        <div className="space-y-1 text-sm">
          <p>Condition: {feedback.vehicleCondition || "N/A"}</p>
          <p>Comment: {feedback.vehicleNotes || "No comment provided"}</p>
        </div>
      </FeedbackSection>
      <FeedbackSection icon={ShieldIcon} title="Safety">
        <div className="space-y-1 text-sm">
          <p>Concerns: {feedback.safetyConcerns || "N/A"}</p>
          <p>Was safety ensured? {feedback.safety || "No"}</p>
          <p>Protocols followed: {feedback.safetyProtocols || "No"}</p>
          <p>Explanation: {feedback.safetyExplanation || "No explanation provided"}</p>
        </div>
      </FeedbackSection>
      <FeedbackSection icon={MessageSquareIcon} title="Communication">
        <div className="space-y-1 text-sm">
          <p>Was communication clear? {feedback.communication || "No"}</p>
          <p>Suggestions: {feedback.communicationSuggestions || "No suggestions provided"}</p>
        </div>
      </FeedbackSection>
      <FeedbackSection icon={ThumbsUpIcon} title="Overall">
        <Rating rating={feedback.rating || 0} />
        <p className="text-sm mt-1">Message: {feedback.message || "No message provided"}</p>
      </FeedbackSection>
    </div>
  </div>
);

const Feedback = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const fetchFeedbacks = async () => {
    try {
      const session = JSON.parse(sessionStorage.getItem("user"));
      const studentId = session?.id;
      if (!studentId) {
        console.error("No student ID found in session.");
        return;
      }
      const res = await axios.get(`${backendUrl}/api/feedback/student/${studentId}`);
      setFeedbacks(res.data);
    } catch (err) {
      console.error("Failed to fetch feedbacks:", err);
    }
  };

  const deleteFeedback = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    try {
      await axios.delete(`${backendUrl}/api/feedback/${id}`);
      setFeedbacks(feedbacks.filter((f) => f.id !== id));
    } catch (err) {
      console.error("Failed to delete feedback:", err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  if (selectedFeedback) {
    return <FeedbackView feedback={selectedFeedback} onBack={() => setSelectedFeedback(null)} />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <BusIcon className="text-orange-500 mr-2" />
          Your Feedback History
        </h1>
        <button
          onClick={() => navigate("/student/add-feedback")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
        >
          + Add Feedback
        </button>
      </div>

      {feedbacks.length === 0 ? (
        <p className="text-gray-600">You haven’t submitted any feedback yet.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((fb) => (
                <tr key={fb.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm">{fb.id}</td>
                  <td className="px-6 py-3 text-sm">{new Date(fb.submittedAt).toLocaleString()}</td>
                  <td className="px-6 py-3 text-sm">
                    <Rating rating={fb.rating} />
                  </td>
                  <td className="px-6 py-3 text-sm text-right space-x-3">
                    <button onClick={() => setSelectedFeedback(fb)} className="text-blue-600 hover:underline">
                      <EyeIcon className="inline w-4 h-4" />
                    </button>

                    <button
                    onClick={() => navigate(`/student/feedback/edit/${fb.id}`)}
                    className="text-green-600 hover:text-green-700"
                    title="Edit"
                  >
                    <EditIcon className="inline w-4 h-4" />
                  </button>
                    <button
                      onClick={() => deleteFeedback(fb.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <TrashIcon className="inline w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Feedback;