import React, { useEffect, useState, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const ScrollableTabs = ({ tabs, activeTab, onChange }) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef(null);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -200 : 200;
      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative flex items-center">
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 p-1 text-gray-500 bg-white rounded-full shadow-md"
        >
          <ChevronLeftIcon size={20} />
        </button>
      )}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide"
        onScroll={checkScroll}
      >
        <div className="flex space-x-2 px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`px-4 py-2 whitespace-nowrap text-sm font-medium rounded-full ${
                activeTab === tab.id
                  ? "bg-amber-500 text-white"
                  : "text-gray-600 bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 p-1 text-gray-500 bg-white rounded-full shadow-md"
        >
          <ChevronRightIcon size={20} />
        </button>
      )}
    </div>
  );
};

export default ScrollableTabs;
