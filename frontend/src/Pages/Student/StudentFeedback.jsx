import React, { useEffect, useState } from "react";
import {
  BusIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldIcon,
  UserIcon,
  MessageSquareIcon,
  StarIcon,
  ThumbsUpIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from "lucide-react";

const FeedbackForm = ({ initialData = null, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    punctuality: "",
    punctualityComment: "",
    driverBehavior: "",
    driverExperience: "",
    vehicleCondition: "",
    vehicleNotes: "",
    safety: "",
    safetyExplanation: "",
    safetyProtocols: "",
    safetyConcerns: "",
    communication: "",
    communicationSuggestions: "",
    overallRating: 0,
    generalFeedback: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData.feedback);
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, overallRating: rating });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting feedback:", formData);
    setIsSubmitted(true);
    if (onSubmitSuccess) {
      onSubmitSuccess();
    }
    setFormData({
      punctuality: "",
      punctualityComment: "",
      driverBehavior: "",
      driverExperience: "",
      vehicleCondition: "",
      vehicleNotes: "",
      safety: "",
      safetyExplanation: "",
      safetyProtocols: "",
      safetyConcerns: "",
      communication: "",
      communicationSuggestions: "",
      overallRating: 0,
      generalFeedback: "",
    });
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">
            Thank You for Your Feedback!
          </h2>
          <p className="text-gray-600 mb-6">
            Your feedback has been submitted successfully and will help us
            improve our bus service.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-md transition-colors"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <BusIcon className="text-orange-500 mr-2 h-8 w-8" />
        <h1 className="text-2xl font-bold">School Bus Feedback Form</h1>
      </div>
      <p className="text-gray-600 mb-6">
        Your feedback helps us improve our transportation services. Please take
        a moment to share your experience.
      </p>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Punctuality Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <ClockIcon className="text-orange-500 mr-2" />
            <h2 className="text-xl font-semibold">1. Punctuality</h2>
          </div>
          <div className="mb-4">
            <p className="mb-2">
              🕒 Was the bus on time for pickup and drop-off?
            </p>
            <div className="space-y-2">
              {[
                "Always on time",
                "Sometimes late",
                "Often late",
                "Early pickup/drop-off",
              ].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="punctuality"
                    value={option}
                    checked={formData.punctuality === option}
                    onChange={handleInputChange}
                    className="mr-2 accent-orange-500"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-2">📌 Optional comment:</label>
            <textarea
              name="punctualityComment"
              value={formData.punctualityComment}
              onChange={handleInputChange}
              className="w-full border border-gray-300 roundedѕ-md p-2 h-24 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Please share any additional comments about punctuality..."
            />
          </div>
        </section>
        {/* Driver Behavior */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <UserIcon className="text-orange-500 mr-2" />
            <h2 className="text-xl font-semibold">2. Driver Behavior</h2>
          </div>
          <div className="mb-4">
            <p className="mb-2">
              👨‍✈️ Was the driver courteous and professional?
            </p>
            <div className="space-y-2">
              {["Yes", "No"].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="driverBehavior"
                    value={option}
                    checked={formData.driverBehavior === option}
                    onChange={handleInputChange}
                    className="mr-2 accent-orange-500"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-2">📌 Describe the experience:</label>
            <textarea
              name="driverExperience"
              value={formData.driverExperience}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2 h-24 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Please describe your experience with the driver..."
            />
          </div>
        </section>
        {/* Vehicle Condition */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <BusIcon className="text-orange-500 mr-2" />
            <h2 className="text-xl font-semibold">3. Vehicle Condition</h2>
          </div>
          <div className="mb-4">
            <p className="mb-2">🚍 Was the bus clean and comfortable?</p>
            <div className="space-y-2">
              {["Very clean", "Acceptable", "Poor condition"].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="vehicleCondition"
                    value={option}
                    checked={formData.vehicleCondition === option}
                    onChange={handleInputChange}
                    className="mr-2 accent-orange-500"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-2">📌 Additional notes:</label>
            <textarea
              name="vehicleNotes"
              value={formData.vehicleNotes}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2 h-24 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Please share any additional notes about the vehicle condition..."
            />
          </div>
        </section>
        {/* Student Safety */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <ShieldIcon className="text-orange-500 mr-2" />
            <h2 className="text-xl font-semibold">4. Student Safety</h2>
          </div>
          <div className="mb-4">
            <p className="mb-2">🛡️ Did you feel safe during the trip?</p>
            <div className="space-y-2">
              {["Yes", "No"].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="safety"
                    value={option}
                    checked={formData.safety === option}
                    onChange={handleInputChange}
                    className="mr-2 accent-orange-500"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-2">📌 If no, explain why:</label>
            <textarea
              name="safetyExplanation"
              value={formData.safetyExplanation}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2 h-24 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Please explain any safety concerns..."
            />
          </div>
          <div className="mb-4">
            <p className="mb-2">
              🪖 Were safety protocols (e.g., seatbelts, supervised entry/exit)
              followed?
            </p>
            <div className="space-y-2">
              {["Yes", "No"].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="safetyProtocols"
                    value={option}
                    checked={formData.safetyProtocols === option}
                    onChange={handleInputChange}
                    className="mr-2 accent-orange-500"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-2">📌 Any concerns: (optional)</label>
            <textarea
              name="safetyConcerns"
              value={formData.safetyConcerns}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2 h-24 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Please share any concerns about safety protocols..."
            />
          </div>
        </section>
        {/* Communication */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <MessageSquareIcon className="text-orange-500 mr-2" />
            <h2 className="text-xl font-semibold">5. Communication</h2>
          </div>
          <div className="mb-4">
            <p className="mb-2">
              📞 Are you satisfied with how issues or delays are communicated?
            </p>
            <div className="space-y-2">
              {["Yes", "No"].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="communication"
                    value={option}
                    checked={formData.communication === option}
                    onChange={handleInputChange}
                    className="mr-2 accent-orange-500"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-2">📌 Suggestions:</label>
            <textarea
              name="communicationSuggestions"
              value={formData.communicationSuggestions}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2 h-24 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Please share any suggestions for improving communication..."
            />
          </div>
        </section>
        {/* Overall Satisfaction */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <ThumbsUpIcon className="text-orange-500 mr-2" />
            <h2 className="text-xl font-semibold">6. Overall Satisfaction</h2>
          </div>
          <div className="mb-4">
            <p className="mb-2">⭐ Rate your overall experience (1–5 stars)</p>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRatingChange(rating)}
                  className="focus:outline-none mr-1"
                >
                  <StarIcon
                    className={`h-8 w-8 ${
                      formData.overallRating >= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-2">📌 Open feedback/suggestions:</label>
            <textarea
              name="generalFeedback"
              value={formData.generalFeedback}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2 h-24 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Please share any additional feedback or suggestions..."
            />
          </div>
        </section>
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3 rounded-md transition-colors"
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
};

const Rating = ({ rating }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ))}
  </div>
);

const FeedbackList = ({ feedbacks, onEdit, onAdd, onView, onDelete }) => {
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      onDelete(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BusIcon className="text-orange-500 mr-2 h-8 w-8" />
          <h1 className="text-2xl font-bold">Feedback Management</h1>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Feedback
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bus Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {feedbacks.map((feedback) => (
                <tr key={feedback.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {feedback.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {feedback.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {feedback.busRoute}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Rating rating={feedback.feedback.overallRating} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Submitted
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onView(feedback)}
                      className="text-orange-500 hover:text-orange-600 mr-3"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEdit(feedback)}
                      className="text-blue-500 hover:text-blue-600 mr-3"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(feedback.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const FeedbackSection = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
    <div className="flex items-center mb-4">
      <Icon className="text-orange-500 mr-2 h-5 w-5" />
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
    {children}
  </div>
);

const FeedbackView = ({ feedback }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-orange-500 text-white rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">Feedback Report</h1>
          <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full">
            Submitted
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p>Feedback ID: {feedback.id}</p>
            <p>Date: {feedback.date}</p>
          </div>
          <div>
            <p>Bus Route: {feedback.busRoute}</p>
            <p>Bus Plate: {feedback.busPlate}</p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <FeedbackSection icon={ClockIcon} title="Punctuality">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium">
                {feedback.feedback.punctuality}
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              {feedback.feedback.punctualityComment}
            </p>
          </div>
        </FeedbackSection>
        <FeedbackSection icon={UserIcon} title="Driver Behavior">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Courteous and Professional:</span>
              <span className="font-medium">
                {feedback.feedback.driverBehavior}
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              {feedback.feedback.driverExperience}
            </p>
          </div>
        </FeedbackSection>
        <FeedbackSection icon={BusIcon} title="Vehicle Condition">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Condition:</span>
              <span className="font-medium">
                {feedback.feedback.vehicleCondition}
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              {feedback.feedback.vehicleNotes}
            </p>
          </div>
        </FeedbackSection>
        <FeedbackSection icon={ShieldIcon} title="Safety">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Felt Safe:</span>
              <span className="font-medium">{feedback.feedback.safety}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Safety Protocols Followed:</span>
              <span className="font-medium">
                {feedback.feedback.safetyProtocols}
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              {feedback.feedback.safetyConcerns}
            </p>
          </div>
        </FeedbackSection>
        <FeedbackSection icon={MessageSquareIcon} title="Communication">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Satisfaction:</span>
              <span className="font-medium">
                {feedback.feedback.communication}
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              {feedback.feedback.communicationSuggestions}
            </p>
          </div>
        </FeedbackSection>
        <FeedbackSection icon={ThumbsUpIcon} title="Overall Satisfaction">
          <div className="space-y-4">
            <div>
              <span className="text-gray-600 block mb-2">Rating:</span>
              <Rating rating={feedback.feedback.overallRating} />
            </div>
            <div>
              <span className="text-gray-600 block mb-2">
                General Feedback:
              </span>
              <p className="text-gray-600 text-sm">
                {feedback.feedback.generalFeedback}
              </p>
            </div>
          </div>
        </FeedbackSection>
      </div>
    </div>
  );
};

const Feedback = () => {
  const [view, setView] = useState("list");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);

  const handleEdit = (feedback) => {
    setSelectedFeedback(feedback);
    setView("form");
  };

  const handleAdd = () => {
    setSelectedFeedback(null);
    setView("form");
  };

  const handleView = (feedback) => {
    setSelectedFeedback(feedback);
    setView("view");
  };

  const handleDelete = (id) => {
    setFeedbacks(feedbacks.filter((feedback) => feedback.id !== id));
  };

  return (
    <div className="bg-gray-100 min-h-screen w-full">
      {view === "list" && (
        <FeedbackList
          feedbacks={feedbacks}
          onEdit={handleEdit}
          onAdd={handleAdd}
          onView={handleView}
          onDelete={handleDelete}
        />
      )}
      {view === "form" && (
        <div>
          <div className="max-w-3xl mx-auto pt-4 px-4">
            <button
              onClick={() => setView("list")}
              className="text-orange-500 hover:text-orange-600 mb-4 flex items-center"
            >
              ← Back to List
            </button>
          </div>
          <FeedbackForm
            initialData={selectedFeedback}
            onSubmitSuccess={() => setView("list")}
          />
        </div>
      )}
      {view === "view" && (
        <div>
          <div className="max-w-4xl mx-auto pt-4 px-4">
            <button
              onClick={() => setView("list")}
              className="text-orange-500 hover:text-orange-600 mb-4 flex items-center"
            >
              ← Back to List
            </button>
          </div>
          <FeedbackView feedback={selectedFeedback} />
        </div>
      )}
    </div>
  );
};

export default Feedback;
