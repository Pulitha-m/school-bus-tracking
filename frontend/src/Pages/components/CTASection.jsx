import React from "react";

export const CTASection = () => {
  return (
    <section className="py-24 bg-yellow-400">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center flex flex-col items-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-black mb-6 leading-tight">
            Give Your Child a Safer Ride to School
          </h2>
          <p className="text-lg sm:text-xl text-black/80 mb-10 max-w-2xl">
            With real-time tracking, instant alerts, and smart route monitoring,
            our platform ensures your child’s journey is always safe — and
            you’re always informed.
          </p>

          <button className="bg-black text-yellow-400 px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-gray-900 transition-all">
            Start Tracking Today
          </button>

          {/* Bus icon with underline */}
          <div className="mt-14 relative">
            <div className="h-1 bg-black/30 w-full absolute top-1/2 left-0 transform -translate-y-1/2"></div>
            <div className="relative z-10 bg-yellow-400 px-6">
              <svg
                width="60"
                height="60"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 15V12H20V15"
                  stroke="#000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 8H22V18C22 18.5304 21.7893 19.0391 21.4142 19.4142C21.0391 19.7893 20.5304 20 20 20H4C3.46957 20 2.96086 19.7893 2.58579 19.4142C2.21071 19.0391 2 18.5304 2 18V8Z"
                  stroke="#000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 8L19 3H5L2 8"
                  stroke="#000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 16H7.01"
                  stroke="#000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 16H17.01"
                  stroke="#000"
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
