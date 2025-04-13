import React from "react";
import { ArrowRightIcon } from "lucide-react";
export const PortalSection = () => {
  // Theme color is blue for the 10% requirement
  const themeColor = "#1a56db";
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Student Portal
          </h2>
          <div className="h-1 w-24 bg-yellow-400 mx-auto"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            Our intuitive student portal provides easy access to bus schedules,
            routes, and attendance history.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Portal Description */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Everything Students Need
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold mr-3 mt-1">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Real-time Bus Tracking</h4>
                  <p className="text-gray-600">
                    See exactly where your bus is and when it will arrive at
                    your stop.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold mr-3 mt-1">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Digital Bus Pass</h4>
                  <p className="text-gray-600">
                    Access your QR code bus pass for quick and easy boarding.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold mr-3 mt-1">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Schedule Changes</h4>
                  <p className="text-gray-600">
                    Receive instant notifications about any changes to your bus
                    schedule.
                  </p>
                </div>
              </li>
            </ul>
            <button className="mt-8 bg-yellow-400 text-gray-800 px-6 py-2 rounded-md font-medium inline-flex items-center hover:bg-yellow-500 transition-colors">
              Explore Student Portal
              <ArrowRightIcon size={18} className="ml-2" />
            </button>
          </div>
          {/* Portal Screenshot */}
          <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
            <div className="h-10 bg-gray-100 flex items-center px-4 border-b border-gray-200">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Student portal interface showing bus tracking map"
                className="w-full h-auto"
              />
              <div
                className="absolute inset-0 flex items-center justify-center bg-yellow-400/80 opacity-0 hover:opacity-100 transition-opacity"
                style={{
                  backdropFilter: "blur(2px)",
                }}
              >
                <button
                  className="bg-white text-gray-800 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
                  style={{
                    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                  }}
                >
                  View Demo
                </button>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="font-medium">Bus #42 - Morning Route</h5>
                  <p className="text-gray-500 text-sm">Arriving in 8 minutes</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-yellow-400 flex items-center justify-center">
                  <span className="text-gray-800 font-bold">8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
