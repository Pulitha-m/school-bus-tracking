import React from "react";
import { MenuIcon, TruckIcon, BellIcon } from "lucide-react";

const MobileHeader = ({ onMenuClick }) => {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between w-full px-4 py-3 bg-white border-b border-gray-100">
      <button
        onClick={onMenuClick}
        className="p-2 -ml-2 rounded-lg hover:bg-gray-50 touch-manipulation"
      >
        <MenuIcon size={22} />
      </button>
      <div className="flex items-center">
        <div className="p-1.5 mr-2 bg-amber-500 rounded-md">
          <TruckIcon className="text-white w-5 h-5" />
        </div>
        <span className="text-lg font-bold">SchoolBus</span>
      </div>
      <button className="relative p-2 -mr-2 rounded-lg hover:bg-gray-50 touch-manipulation">
        <BellIcon size={22} />
        <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full">
          3
        </span>
      </button>
    </div>
  );
};

export default MobileHeader;
