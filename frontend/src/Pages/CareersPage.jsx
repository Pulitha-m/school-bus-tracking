import React, { useState } from "react";
import axios from "axios";
import backendUrl from "../config/config";
import {
  BriefcaseIcon,
  GraduationCapIcon,
  HeartIcon,
  TruckIcon,
  ShieldIcon,
  DollarSignIcon,
  Upload,
  FileText,
  Send,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const CareersPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Pending",
    date: new Date().toISOString().split("T")[0],
  });
  const [cvImg, setCvImg] = useState(null);
  const [licenseImg, setLicenseImg] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cvImg || !licenseImg) {
      toast.error("Please upload CV and driving license.");
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([key, val]) => data.append(key, val));
    data.append("cvImg", cvImg);
    data.append("driving_license", licenseImg);

    try {
      await axios.post(`${backendUrl}/applyCareer`, data);
      toast.success("Application submitted successfully!");
      setForm({
        name: "",
        email: "",
        phone: "",
        status: "Pending",
        date: form.date,
      });
      setCvImg(null);
      setLicenseImg(null);
    } catch (err) {
      toast.error("Failed to submit application.");
    }
  };

  const positions = [
    {
      title: "Bus Driver",
      type: "Full Time",
      location: "Multiple Locations",
      description:
        "Looking for experienced bus drivers with a clean driving record and passion for safety.",
      icon: <TruckIcon size={32} className="text-yellow-400" />,
    },
    {
      title: "Route Planner",
      type: "Full Time",
      location: "Head Office",
      description:
        "Seeking a detail-oriented professional to optimize bus routes and schedules.",
      icon: <BriefcaseIcon size={32} className="text-yellow-400" />,
    },
    {
      title: "Safety Coordinator",
      type: "Full Time",
      location: "Regional Offices",
      description:
        "Join our team ensuring the highest safety standards in student transportation.",
      icon: <ShieldIcon size={32} className="text-yellow-400" />,
    },
  ];

  const benefits = [
    {
      icon: <HeartIcon size={32} className="text-yellow-400" />,
      title: "Health Benefits",
      description:
        "Comprehensive medical, dental, and vision coverage for you and your family",
    },
    {
      icon: <DollarSignIcon size={32} className="text-yellow-400" />,
      title: "Competitive Pay",
      description:
        "Industry-leading compensation with regular performance reviews",
    },
    {
      icon: <GraduationCapIcon size={32} className="text-yellow-400" />,
      title: "Professional Development",
      description: "Ongoing training and career growth opportunities",
    },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <ToastContainer />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Team</h1>
          <div className="h-1 w-24 bg-yellow-400 mx-auto"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            Be part of a team that's revolutionizing school transportation
            safety. We're always looking for talented individuals to join our
            mission.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Why Work With Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="mb-4 flex justify-center">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Open Positions
          </h2>
          <div className="space-y-6">
            {positions.map((position, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start">
                  <div className="mr-6">{position.icon}</div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">
                          {position.title}
                        </h3>
                        <p className="text-gray-600">
                          {position.type} • {position.location}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600">{position.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 transform transition-all hover:shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
            <BriefcaseIcon className="mr-2 text-yellow-500" size={24} />
            Apply for a Position
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Personal Info */}
              <div className="space-y-5">
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all"
                    required
                  />
                  <label className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all pointer-events-none">
                    Full Name
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all"
                    required
                  />
                  <label className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all pointer-events-none">
                    Email Address
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all"
                    required
                  />
                  <label className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all pointer-events-none">
                    Phone Number
                  </label>
                </div>
              </div>

              {/* Right Column - Uploads Side by Side */}
              <div className="grid grid-cols-2 gap-4 h-full">
                {/* CV Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center transition-colors hover:border-yellow-400 hover:bg-yellow-50 h-full flex flex-col">
                  <label className="cursor-pointer flex flex-col items-center justify-center h-full">
                    <Upload className="text-yellow-500 mb-2" size={24} />
                    <span className="font-medium text-gray-700">
                      {cvImg ? cvImg.name : "Upload CV"}
                    </span>
                    <span className="text-sm text-gray-500">PDF or Image</span>
                    <input
                      type="file"
                      onChange={(e) => setCvImg(e.target.files[0])}
                      accept="application/pdf,image/*"
                      className="hidden"
                      required
                    />
                  </label>
                </div>

                {/* License Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center transition-colors hover:border-yellow-400 hover:bg-yellow-50 h-full flex flex-col">
                  <label className="cursor-pointer flex flex-col items-center justify-center h-full">
                    <FileText className="text-yellow-500 mb-2" size={24} />
                    <span className="font-medium text-gray-700">
                      {licenseImg ? licenseImg.name : "Upload License"}
                    </span>
                    <span className="text-sm text-gray-500">Image only</span>
                    <input
                      type="file"
                      onChange={(e) => setLicenseImg(e.target.files[0])}
                      accept="image/*"
                      className="hidden"
                      required
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button - Full width below columns */}
            <button
              type="submit"
              className="mt-6 w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 flex items-center justify-center"
            >
              <Send className="mr-2" size={18} />
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
