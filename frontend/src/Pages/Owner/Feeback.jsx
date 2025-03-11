import React from "react";
import { MessageCircleIcon, StarIcon, SearchIcon } from "lucide-react";

const Feedback = () => {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Feedback</h1>
        <p className="text-gray-600">
          View and manage parent and student feedback
        </p>
      </div>
      <div className="flex mb-6">
        <div className="flex items-center flex-1 p-2 bg-white rounded-md shadow-sm">
          <SearchIcon size={20} className="mr-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search feedback..."
            className="w-full outline-none"
          />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Recent Feedback</h2>
        </div>
        <div className="divide-y">
          <div className="p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="p-2 mr-3 text-white bg-amber-500 rounded-full">
                  <MessageCircleIcon size={16} />
                </div>
                <h3 className="font-medium">Sarah Thompson</h3>
              </div>
              <div className="flex text-amber-500">
                <StarIcon size={16} fill="currentColor" />
                <StarIcon size={16} fill="currentColor" />
                <StarIcon size={16} fill="currentColor" />
                <StarIcon size={16} fill="currentColor" />
                <StarIcon size={16} />
              </div>
            </div>
            <p className="text-gray-600">
              The new bus tracking system has been very helpful for keeping
              track of my child's transportation...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
