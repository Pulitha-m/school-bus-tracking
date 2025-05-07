import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  BusIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldIcon,
  UserIcon,
  MessageSquareIcon,
  StarIcon,
  ThumbsUpIcon,
} from "lucide-react";
import backendUrl from "../../../config/config";

const EditFeedback = () => {
  const { feedbackId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
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
  const [errors, setErrors] = useState({}); // Track validation errors

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/feedback/${feedbackId}`);
        setFormData(response.data);
      } catch (err) {
        console.error("Error fetching feedback:", err);
        alert("Failed to load feedback. Please try again.");
      }
    };

    fetchFeedback();
  }, [feedbackId]);

  const validateField = (name, value) => {
    let error = "";
    if (name === "name") {
      const sanitizedValue = value.replace(/[^A-Za-z\s]/g, ""); // Only letters and spaces
      if (sanitizedValue.length < 2) error = "Name must be at least 2 characters long";
      if (sanitizedValue.length > 50) error = "Name cannot exceed 50 characters";
      return { value: sanitizedValue.slice(0, 50), error };
    }
    if (["punctualityComment", "driverExperience", "vehicleNotes", "safetyExplanation", "safetyConcerns", "communicationSuggestions"].includes(name)) {
      const sanitizedValue = value.replace(/<[^>]+>/g, ""); // Remove HTML tags
      if (sanitizedValue.length > 500) error = "Comment cannot exceed 500 characters";
      return { value: sanitizedValue.slice(0, 500), error };
    }
    if (name === "generalFeedback") {
      const sanitizedValue = value.replace(/<[^>]+>/g, "");
      if (sanitizedValue.length > 1000) error = "Feedback cannot exceed 1000 characters";
      return { value: sanitizedValue.slice(0, 1000), error };
    }
    return { value, error };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const { value: validatedValue, error } = validateField(name, value);
    setFormData({ ...formData, [name]: validatedValue });
    setErrors({ ...errors, [name]: error });
  };

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, overallRating: rating });
    setErrors({ ...errors, overallRating: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.name.length < 2) newErrors.name = "Name must be at least 2 characters long";
    if (!formData.punctuality) newErrors.punctuality = "Please select a punctuality option";
    if (!formData.driverBehavior) newErrors.driverBehavior = "Please select a driver behavior option";
    if (!formData.vehicleCondition) newErrors.vehicleCondition = "Please select a vehicle condition option";
    if (!formData.safety) newErrors.safety = "Please select a safety option";
    if (!formData.safetyProtocols) newErrors.safetyProtocols = "Please select a safety protocols option";
    if (!formData.communication) newErrors.communication = "Please select a communication option";
    if (formData.overallRating === 0) newErrors.overallRating = "Please provide a rating";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please correct the errors before submitting.");
      return;
    }
    try {
      await axios.put(`${backendUrl}/api/feedback/${feedbackId}`, {
        ...formData,
        rating: formData.overallRating,
        message: formData.generalFeedback,
      });

      setIsSubmitted(true);
      setTimeout(() => {
        navigate(-1); // Go back to previous page after submission
      }, 2000);
    } catch (err) {
      console.error("Feedback update failed:", err);
      alert("Feedback update failed. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">
            Feedback Updated Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Your feedback has been updated successfully.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <BusIcon className="text-orange-500 mr-2 h-8 w-8" />
        <h1 className="text-2xl font-bold">Edit School Bus Feedback</h1>
      </div>
      <p className="text-gray-600 mb-6">
        Update your feedback to help us improve our transportation services.
      </p>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="mb-6">
          <label className="block mb-2 font-medium">Your Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full border rounded-md p-2 focus:ring-orange-500 focus:border-orange-500 ${errors.name ? "border-red-500" : "border-gray-300"}`}
            placeholder="Enter your name"
            required
            title="Only letters and spaces are allowed"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Punctuality Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <ClockIcon className="text-orange-500 mr-2" />
            <h2 className="text-xl font-semibold">1. Punctuality</h2>
          </div>
          <div className="mb-4">
            <p className="mb-2">Was the bus on time for pickup and drop-off?</p>
            <div className="space-y-2">
              {["Always on time", "Sometimes late", "Often late", "Early pickup/drop-off"].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="punctuality"
                    value={option}
                    checked={formData.punctuality === option}
                    onChange={handleInputChange}
                    className="mr-2 accent-orange-500"
                    required
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {errors.punctuality && <p className="text-red-500 text-sm mt-1">{errors.punctuality}</p>}
          </div>
          <div>
            <label className="block mb-2">Optional comment:</label>
            <textarea
              name="punctualityComment"
              value={formData.punctualityComment}
              onChange={handleInputChange}
              className={`w-full border rounded-md p-2 h-24 focus:ring-orange-500 focus:border-orange-500 ${errors.punctualityComment ? "border-red-500" : "border-gray-300"}`}
              placeholder="Please share any additional comments about punctuality..."
            />
            {errors.punctualityComment && <p className="text-red-500 text-sm mt-1">{errors.punctualityComment}</p>}
          </div>
        </section>

        {/* Driver Behavior */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <UserIcon className="text-orange-500 mr-2" />
            <h2 className="text-xl font-semibold">2. Driver Behavior</h2>
          </div>
          <div className="mb-4">
            <p className="mb-2">Was the driver courteous and professional?</p>
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
                    required
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {errors.driverBehavior && <p className="text-red-500 text-sm mt-1">{errors.driverBehavior}</p>}
          </div>
          <div>
            <label className="block mb-2">Describe the experience:</label>
            <textarea
              name="driverExperience"
              value={formData.driverExperience}
              onChange={handleInputChange}
              className={`w-full border rounded-md p-2 h-24 focus:ring-orange-500 focus:border-orange-500 ${errors.driverExperience ? "border-red-500" : "border-gray-300"}`}
              placeholder="Please describe your experience with the driver..."
            />
            {errors.driverExperience && <p className="text-red-500 text-sm mt-1">{errors.driverExperience}</p>}
          </div>
        </section>

        {/* Vehicle Condition */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <BusIcon className="text-orange-500 mr-2" />
            <h2 className="text-xl font-semibold">3. Vehicle Condition</h2>
          </div>
          <div className="mb-4">
            <p className="mb-2">Was the bus clean and comfortable?</p>
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
                    required
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {errors.vehicleCondition && <p className="text-red-500 text-sm mt-1">{errors.vehicleCondition}</p>}
          </div>
          <div>
            <label className="block mb-2">Additional notes:</label>
            <textarea
              name="vehicleNotes"
              value={formData.vehicleNotes}
              onChange={handleInputChange}
              className={`w-full border rounded-md p-2 h-24 focus:ring-orange-500 focus:border-orange-500 ${errors.vehicleNotes ? "border-red-500" : "border-gray-300"}`}
              placeholder="Please share any additional notes about the vehicle condition..."
            />
            {errors.vehicleNotes && <p className="text-red-500 text-sm mt-1">{errors.vehicleNotes}</p>}
          </div>
        </section>

        {/* Student Safety */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <ShieldIcon className="text-orange-500 mr-2" />
            <h2 className="text-xl font-semibold">4. Student Safety</h2>
          </div>
          <div className="mb-4">
            <p className="mb-2">Did you feel safe during the trip?</p>
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
                    required
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {errors.safety && <p className="text-red-500 text-sm mt-1">{errors.safety}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-2">If no, explain why:</label>
            <textarea
              name="safetyExplanation"
              value={formData.safetyExplanation}
              onChange={handleInputChange}
              className={`w-full border rounded-md p-2 h-24 focus:ring-orange-500 focus:border-orange-500 ${errors.safetyExplanation ? "border-red-500" : "border-gray-300"}`}
              placeholder="Please explain any safety concerns..."
            />
            {errors.safetyExplanation && <p className="text-red-500 text-sm mt-1">{errors.safetyExplanation}</p>}
          </div>
          <div className="mb-4">
            <p className="mb-2">Were safety protocols (e.g., seatbelts, supervised entry/exit) followed?</p>
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
                    required
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {errors.safetyProtocols && <p className="text-red-500 text-sm mt-1">{errors.safetyProtocols}</p>}
          </div>
          <div>
            <label className="block mb-2">Any concerns: (optional)</label>
            <textarea
              name="safetyConcerns"
              value={formData.safetyConcerns}
              onChange={handleInputChange}
              className={`w-full border rounded-md p-2 h-24 focus:ring-orange-500 focus:border-orange-500 ${errors.safetyConcerns ? "border-red-500" : "border-gray-300"}`}
              placeholder="Please share any concerns about safety protocols..."
            />
            {errors.safetyConcerns && <p className="text-red-500 text-sm mt-1">{errors.safetyConcerns}</p>}
          </div>
        </section>

        {/* Communication */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <MessageSquareIcon className="text-orange-500 mr-2" />
            <h2 className="text-xl font-semibold">5. Communication</h2>
          </div>
          <div className="mb-4">
            <p className="mb-2">Are you satisfied with how issues or delays are communicated?</p>
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
                    required
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {errors.communication && <p className="text-red-500 text-sm mt-1">{errors.communication}</p>}
          </div>
          <div>
            <label className="block mb-2">Suggestions:</label>
            <textarea
              name="communicationSuggestions"
              value={formData.communicationSuggestions}
              onChange={handleInputChange}
              className={`w-full border rounded-md p-2 h-24 focus:ring-orange-500 focus:border-orange-500 ${errors.communicationSuggestions ? "border-red-500" : "border-gray-300"}`}
              placeholder="Please share any suggestions for improving communication..."
            />
            {errors.communicationSuggestions && <p className="text-red-500 text-sm mt-1">{errors.communicationSuggestions}</p>}
          </div>
        </section>

        {/* Overall Satisfaction */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <ThumbsUpIcon className="text-orange-500 mr-2" />
            <h2 className="text-xl font-semibold">6. Overall Satisfaction</h2>
          </div>
          <div className="mb-4">
            <p className="mb-2">Rate your overall experience (1-5 stars)</p>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRatingChange(rating)}
                  className="focus:outline-none mr-1"
                >
                  <StarIcon
                    className={`h-8 w-8 ${formData.overallRating >= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                </button>
              ))}
            </div>
            {errors.overallRating && <p className="text-red-500 text-sm mt-1">{errors.overallRating}</p>}
          </div>
          <div>
            <label className="block mb-2">Open feedback/suggestions:</label>
            <textarea
              name="generalFeedback"
              value={formData.generalFeedback}
              onChange={handleInputChange}
              className={`w-full border rounded-md p-2 h-24 focus:ring-orange-500 focus:border-orange-500 ${errors.generalFeedback ? "border-red-500" : "border-gray-300"}`}
              placeholder="Please share any additional feedback or suggestions..."
            />
            {errors.generalFeedback && <p className="text-red-500 text-sm mt-1">{errors.generalFeedback}</p>}
          </div>
        </section>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-8 py-3 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3 rounded-md transition-colors"
          >
            Update Feedback
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFeedback;