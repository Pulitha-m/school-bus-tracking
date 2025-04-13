import React from "react";
import { ArrowRightIcon } from "lucide-react";
import sbs from "./sbs.png";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-4 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="z-10 ml-4 md:ml-8 lg:ml-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              Smart School Bus Tracking Made Easy
            </h1>
            <p className="text-base md:text-lg text-gray-700 mb-6 md:mb-8 max-w-lg">
              Real-time location tracking, attendance, and optimized routes for
              safety and efficiency. Keep your students safe and parents
              informed.
            </p>
            <button
              className="bg-yellow-400 text-gray-800 px-6 py-2 md:px-8 md:py-3 rounded-md font-medium text-base md:text-lg inline-flex items-center hover:bg-yellow-500 transition-colors"
              style={{
                boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
              }}
            >
              Get Started
              <ArrowRightIcon size={18} className="ml-2" />
            </button>
          </div>

          {/* Circular Image Container - Increased Width */}
          <div className="relative z-10 flex justify-center md:justify-end mr-4 md:mr-8 lg:mr-12">
            <div className="relative h-83 w-86 sm:h-[23rem] sm:w-[26rem] md:h-[27rem] md:w-[30rem] lg:h-[31rem] lg:w-[34rem] rounded-full overflow-hidden border-4 border-white shadow-xl">
              <img
                src={sbs}
                alt="School bus tracking map interface"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-yellow-400/20 pointer-events-none rounded-full"></div>
              {/* Animated bus marker */}
              <div
                className="absolute"
                style={{
                  top: "40%",
                  left: "60%",
                  animation: "pulse 2s infinite",
                }}
              >
                <div className="h-4 w-4 md:h-5 md:w-5 rounded-full bg-yellow-400 ring-3 md:ring-4 ring-yellow-400/30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-yellow-400/10 -skew-x-12 transform origin-top-right"></div>

      {/* Move the animation to a global CSS file or use inline style */}
      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(0.95);
          }
          70% {
            transform: scale(1.1);
            box-shadow: 0 0 0 10px rgba(255, 204, 0, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(255, 204, 0, 0);
          }
        }
      `}</style>
    </section>
  );
};
