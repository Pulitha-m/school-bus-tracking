import React, { useEffect, useState } from "react";
import { StarIcon } from "lucide-react";
import axios from "axios";
import backendUrl from "../../config/config";

export const TestimonialsSection = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchLatestFeedbacks = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/feedback`);
        const sorted = res.data
          .filter(fb => fb.message) // only include feedbacks with a message
          .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
          .slice(0, 3); // take latest 3
        setFeedbacks(sorted);
      } catch (err) {
        console.error("Failed to load feedbacks", err);
      }
    };

    fetchLatestFeedbacks();
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-black">
          What People Are Saying
        </h2>
        <div className="h-1 w-24 bg-yellow-400 mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12 text-lg">
          Hear directly from parents, school administrators, and drivers using
          our system every day.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {feedbacks.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    size={18}
                    fill={i < (testimonial.rating || 0) ? "#FBBF24" : "none"}
                    stroke={i < (testimonial.rating || 0) ? "#FBBF24" : "#D1D5DB"}
                    className="mr-1"
                  />
                ))}
              </div>
              <p className="text-gray-700 italic mb-6 leading-relaxed">
                “{testimonial.message || "No message provided"}”
              </p>
              <div className="flex items-center">
                <img
                  src={
                    testimonial.image ||
                    "https://ui-avatars.com/api/?name=" + encodeURIComponent(testimonial.name || "Anonymous")
                  }
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover mr-4 border-2 border-yellow-400"
                />
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name || "Anonymous"}
                  </h4>
                  <p className="text-sm text-gray-500">Feedback User</p>
                </div>
              </div>
              <div className="mt-4 h-1 w-12 bg-yellow-400 rounded-full"></div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <button className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold shadow-md hover:bg-yellow-500 transition">
            See More Stories
          </button>
        </div>
      </div>
    </section>
  );
};

