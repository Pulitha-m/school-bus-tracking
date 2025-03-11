import React from "react";
import { MessageSquareIcon, SearchIcon } from "lucide-react";

const Messages = () => {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Messages</h1>
        <p className="text-gray-600">
          Manage communications with administrators
        </p>
      </div>
      <div className="flex mb-6">
        <div className="flex items-center flex-1 p-2 bg-white rounded-md shadow-sm">
          <SearchIcon size={20} className="mr-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full outline-none"
          />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Recent Messages</h2>
        </div>
        <div className="divide-y">
          <div className="flex items-start p-4 hover:bg-gray-50">
            <div className="p-2 mr-4 text-white bg-amber-500 rounded-full">
              <MessageSquareIcon size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium">Route Change Notification</h3>
                <span className="text-sm text-gray-500">2h ago</span>
              </div>
              <p className="text-gray-600">
                Important update regarding the North Springfield route
                changes...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
