import React from "react";

function MetricCard({ label, value, icon, color }) {
  return (
    <div className={`bg-${color}-50 p-4 rounded-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-${color}-600 text-sm`}>{label}</p>
          <h3 className={`text-2xl font-bold text-${color}-700`}>{value}</h3>
        </div>
        <div className={`bg-${color}-100 p-3 rounded-full`}>{icon}</div>
      </div>
    </div>
  );
}

export default MetricCard;
