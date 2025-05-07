import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TrashIcon,
  EyeIcon,
  ThumbsUpIcon,
  ClockIcon,
  UserIcon,
  MessageSquareIcon,
  ShieldIcon,
  AlertTriangleIcon
} from "lucide-react";
import backendUrl from "../../config/config";

const Rating = ({ rating = 0 }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={`text-sm ${i < rating ? "text-yellow-400" : "text-gray-300"}`}>
        ★
      </span>
    ))}
  </div>
);

const FeedbackSection = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
    <div className="flex items-center mb-4">
      <Icon className="text-orange-500 mr-2 h-5 w-5" />
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </div>
    {children}
  </div>
);

const FeedbackView = ({ feedback, onBack }) => (
  <div className="max-w-4xl mx-auto p-6">
    <div className="bg-orange-100 text-gray-800 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Feedback Report</h1>
        <button onClick={onBack} className="text-orange-500 underline text-sm">← Back to list</button>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <p>Feedback ID: {feedback.id}</p>
        <p>Submitted At: {feedback.submittedAt ? new Date(feedback.submittedAt).toLocaleString() : "N/A"}</p>
        <p>Name: {feedback.name || "N/A"}</p>
      </div>
    </div>

    <div className="space-y-4">
      <FeedbackSection icon={ClockIcon} title="Punctuality">
        <p>Status: {feedback.punctuality || "N/A"}</p>
        <p>Comment: {feedback.punctualityComment || "No comment provided"}</p>
      </FeedbackSection>

      <FeedbackSection icon={UserIcon} title="Driver Behavior">
        <p>Was the driver polite? {feedback.driverBehavior || "No"}</p>
        <p>Comment: {feedback.driverExperience || "No comment provided"}</p>
      </FeedbackSection>

      <FeedbackSection icon={MessageSquareIcon} title="Communication">
        <p>Was communication clear? {feedback.communication || "No"}</p>
        <p>Suggestions: {feedback.communicationSuggestions || "No suggestions provided"}</p>
      </FeedbackSection>

      <FeedbackSection icon={ThumbsUpIcon} title="Overall">
        <Rating rating={feedback.rating || 0} />
        <p className="text-sm mt-1">Message: {feedback.message || "No message provided"}</p>
      </FeedbackSection>
    </div>
  </div>
);

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [filters, setFilters] = useState({ name: "" });

  const fetchAllFeedbacks = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/feedback`);
      setFeedbacks(res.data);
      setFilteredFeedbacks(res.data);
    } catch (err) {
      console.error("Failed to fetch feedbacks:", err);
    }
  };

  useEffect(() => {
    fetchAllFeedbacks();
  }, []);

  useEffect(() => {
    let filtered = [...feedbacks];
    if (filters.name) {
      filtered = filtered.filter(f =>
        f.name?.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    setFilteredFeedbacks(filtered);
  }, [filters, feedbacks]);

  const deleteFeedback = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    try {
      await axios.delete(`${backendUrl}/api/feedback/${id}`);
      setFeedbacks(feedbacks.filter(f => f.id !== id));
    } catch (err) {
      console.error("Failed to delete feedback:", err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (selectedFeedback) {
    return <FeedbackView feedback={selectedFeedback} onBack={() => setSelectedFeedback(null)} />;
  }

  const totalFeedbacks = 4;
  const lowRatedFeedbacks = 0;
  const highRatedFeedbacks = 3;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Feedback</h1>
      <p className="text-gray-600 mb-6">View and manage all user feedback</p>

      <div className="flex space-x-4 mb-6">
  {/* Total Feedbacks */}
  <div className="bg-blue-50 p-4 rounded-lg flex-1">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-blue-600 text-sm">Total Feedbacks</p>
        <h3 className="text-2xl font-bold text-blue-700">{totalFeedbacks}</h3>
      </div>
      <div className="bg-blue-100 p-3 rounded-full">
        <MessageSquareIcon className="h-6 w-6 text-blue-500" />
      </div>
    </div>
  </div>

  {/* Low Rated */}
  <div className="bg-red-50 p-4 rounded-lg flex-1">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-red-600 text-sm">Low Rated</p>
        <h3 className="text-2xl font-bold text-red-700">{lowRatedFeedbacks}</h3>
      </div>
      <div className="bg-red-100 p-3 rounded-full">
        <AlertTriangleIcon className="h-6 w-6 text-red-500" />
      </div>
    </div>
  </div>

  {/* High Rated */}
  <div className="bg-green-50 p-4 rounded-lg flex-1">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-green-600 text-sm">High Rated</p>
        <h3 className="text-2xl font-bold text-green-700">{highRatedFeedbacks}</h3>
      </div>
      <div className="bg-green-100 p-3 rounded-full">
        <ThumbsUpIcon className="h-6 w-6 text-green-500" />
      </div>
    </div>
  </div>
</div>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          className="border border-gray-300 p-2 rounded w-1/3"
          placeholder="Search feedbacks..."
        />
        
      </div>

      {filteredFeedbacks.length === 0 ? (
        <p className="text-gray-600">No feedbacks match the selected criteria.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Feedback ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted At</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.map((fb) => (
                <tr key={fb.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-800">{fb.name || "N/A"}</td>
                  <td className="px-6 py-3 text-sm text-gray-800">{fb.id}</td>
                  <td className="px-6 py-3 text-sm">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${fb.rating >= 4 ? "bg-green-100 text-green-800" : fb.rating <= 2 ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
                      <Rating rating={fb.rating || 0} />
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-800">
                    {fb.submittedAt ? new Date(fb.submittedAt).toLocaleString() : "N/A"}
                  </td>
                  <td className="px-6 py-3 text-sm text-right space-x-3">
                    <button onClick={() => setSelectedFeedback(fb)} className="text-orange-500 hover:text-orange-600">
                      <EyeIcon className="inline w-4 h-4" /> View
                    </button>
                    <button onClick={() => deleteFeedback(fb.id)} className="text-red-500 hover:text-red-600">
                      <TrashIcon className="inline w-4 h-4" /> Delete
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

export default AdminFeedback;