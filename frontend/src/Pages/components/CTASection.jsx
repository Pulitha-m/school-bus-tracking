import React from "react";

export const CTASection = () => {
  return (
    <section className="py-16 bg-yellow-400">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            Join Us in Making School Bus Travel Safer
          </h2>
          <p className="text-lg text-gray-800 mb-8 max-w-2xl mx-auto">
            Start tracking your school buses today and provide peace of mind to
            parents, students, and administrators.
          </p>
          <button
            className="bg-white text-gray-800 px-8 py-3 rounded-md font-medium text-lg hover:bg-gray-100 transition-colors"
            style={{
              boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
            }}
          >
            Sign Up Now
          </button>
          {/* Bus icon illustration */}
          <div className="mt-12 relative">
            <div className="h-1 bg-gray-800/20 w-full absolute top-1/2 transform -translate-y-1/2"></div>
            <div className="relative z-10 inline-block bg-yellow-400 px-4">
              <svg
                width="60"
                height="60"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 15V12H20V15"
                  stroke="#1a56db"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 8H22V18C22 18.5304 21.7893 19.0391 21.4142 19.4142C21.0391 19.7893 20.5304 20 20 20H4C3.46957 20 2.96086 19.7893 2.58579 19.4142C2.21071 19.0391 2 18.5304 2 18V8Z"
                  stroke="#1a56db"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 8L19 3H5L2 8"
                  stroke="#1a56db"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 16H7.01"
                  stroke="#1a56db"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 16H17.01"
                  stroke="#1a56db"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
