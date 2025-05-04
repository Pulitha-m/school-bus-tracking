import React, { useRef, useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Parallax } from "react-scroll-parallax";

const KeyFeaturesSection = () => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % features.length;
        scrollToIndex(newIndex);
        return newIndex;
      });
    }, 5000); // 5000ms = 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const features = [
    {
      title: "Live Tracking",
      subtitle:
        "Track your child’s bus in real-time with live GPS updates and route visibility.",
      image: "/track.jpg",
    },
    {
      title: "Smart Attendance",
      subtitle:
        "Get instant alerts when your child boards or exits the bus, ensuring safety and accountability.",
      image: "/attendance2.jpg",
    },
    {
      title: "Secure Payments",
      subtitle:
        "Easily manage transport fees with transparent, digital payment options and receipts.",
      image: "/payment.jpg",
    },
    {
      title: "Instant Notifications",
      subtitle:
        "Receive real-time alerts about delays, bus arrivals, or unexpected route changes.",
      image: "/notifications.jpg",
    },
    {
      title: "Optimized Routes",
      subtitle:
        "Reduce waiting times with intelligently planned bus routes for faster pickups and drop-offs.",
      image: "/optimized-routes.jpg",
    },
  ];

  const scrollToIndex = (index) => {
    const container = scrollRef.current;
    if (!container) return;
    const width = container.offsetWidth;
    container.scrollTo({ left: width * index, behavior: "smooth" });
    setActiveIndex(index);
  };

  const handlePrev = () => {
    const newIndex = activeIndex === 0 ? features.length - 1 : activeIndex - 1;
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = (activeIndex + 1) % features.length;
    scrollToIndex(newIndex);
  };

  return (
    <section className="w-full bg-white text-black py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch h-auto lg:h-[600px]">
        {/* Left: Scrollable Images with Parallax */}
        <div className="relative w-full lg:w-2/3 h-[300px] sm:h-[400px] lg:h-[600px] mb-10 lg:mb-0">
          {/* Scroll Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white text-black p-2 rounded-full shadow-md hover:bg-gray-200"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white text-black p-2 rounded-full shadow-md hover:bg-gray-200"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-hidden snap-x snap-mandatory scroll-smooth h-full"
          >
            {features.map((feature, index) => (
              <Parallax
                key={index}
                speed={-5}
                className="flex-none w-full snap-start relative"
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                />
              </Parallax>
            ))}
          </div>
        </div>

        {/* Right: Static Description */}
        <div className="w-full lg:w-1/3 bg-black text-white flex flex-col justify-center px-6 sm:px-10 py-8 rounded-2xl">
          <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4">
            KEY <br /> FEATURES
          </p>
          <h2 className="text-2xl font-bold mb-2">
            {features[activeIndex].title}
          </h2>
          <p className="text-white/80 text-lg">
            {features[activeIndex].subtitle}
          </p>
        </div>
      </div>
    </section>
  );
};

export default KeyFeaturesSection;
