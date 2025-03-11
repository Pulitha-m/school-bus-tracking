import React from "react";

const InfoCard = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

export default InfoCard;
