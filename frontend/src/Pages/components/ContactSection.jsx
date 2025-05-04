import React, { useState } from "react";
import { SendIcon, CheckCircleIcon } from "lucide-react";

export const ContactSection = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }, 3000);
    }, 500);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
          {/* Left: Black Panel Inside Card */}
          <div className="w-full lg:w-1/2 bg-black text-white p-8 lg:p-10 flex flex-col justify-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">
              GET IN TOUCH
            </h2>
            <div className="h-1 w-16 bg-yellow-400 mb-6"></div>
            <p className="text-white/80 text-lg">
              Have questions about our school transport solution? We’re here to
              help. Fill out the form and our team will get back to you shortly.
            </p>
          </div>

          {/* Right: Form Panel Inside Same Card */}
          <div className="w-full lg:w-1/2 bg-white p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 flex items-center text-black">
              <SendIcon className="mr-3 text-yellow-400 w-5 h-5 sm:w-6 sm:h-6" />
              Send us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-yellow-400 focus:border-yellow-400"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-yellow-400 focus:border-yellow-400"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              {/* New Mobile Number Field */}
              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="mobile"
                  value={formData.mobile || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-yellow-400 focus:border-yellow-400"
                  placeholder="+94 712 345 678"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-yellow-400 focus:border-yellow-400"
                  placeholder="How can we help?"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-yellow-400 focus:border-yellow-400 resize-none"
                  placeholder="Your message here..."
                  required
                ></textarea>
              </div>

              {/* Improved Send Button */}
              <button
                type="submit"
                disabled={isSubmitted}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold rounded-full transition-all duration-200 ${
                  isSubmitted
                    ? "bg-green-500 text-white cursor-not-allowed"
                    : "bg-yellow-400 hover:bg-yellow-500 text-black"
                }`}
              >
                {isSubmitted ? (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    Message Sent!
                  </>
                ) : (
                  <>
                    <SendIcon className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
