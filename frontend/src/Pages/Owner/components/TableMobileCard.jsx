import React from "react";

const TableMobileCard = ({ data, config }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm mb-3">
      {config.map((field, index) => (
        <div key={field.key} className={index !== 0 ? "mt-3" : ""}>
          <div className="text-xs text-gray-500 mb-1">{field.label}</div>
          <div className="text-sm">
            {field.render ? field.render(data[field.key]) : data[field.key]}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableMobileCard;
