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
    <section
      className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white"
      id="contact"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Get in Touch
          </h2>
          <div className="h-1 w-20 md:w-24 bg-yellow-400 mx-auto"></div>
          <p className="mt-4 md:mt-6 text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            Have questions about our services? We're here to help and would love
            to hear from you.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 flex items-center">
              <SendIcon className="mr-3 text-yellow-400 w-5 h-5 sm:w-6 sm:h-6" />
              Send us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="relative">
                  <label
                    className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2"
                    htmlFor="name"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="relative">
                  <label
                    className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              <div className="relative">
                <label
                  className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2"
                  htmlFor="subject"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                  placeholder="How can we help?"
                  required
                />
              </div>
              <div className="relative">
                <label
                  className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2"
                  htmlFor="message"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Your message here..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitted}
                className={`w-full bg-yellow-400 text-gray-800 px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-yellow-500 transition-all duration-200 flex items-center justify-center space-x-2 ${
                  isSubmitted ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitted ? (
                  <>
                    <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Message Sent!</span>
                  </>
                ) : (
                  <>
                    <SendIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Send Message</span>
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
