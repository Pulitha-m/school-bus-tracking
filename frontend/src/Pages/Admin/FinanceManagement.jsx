import React, { useState } from "react";
import { IncomeManagement } from "./Finance/IncomeManagement";
// import Dashboard from "./Dashboard";
// import Income from "./Income";
// import Expenses from "./Expenses";
// import Salaries from "./Salaries";
import ExpenseManagement from "./Finance/ExpenseManagement";
import SalaryManagement from "./Finance/SalaryManagement";
import Dashboard from "./Finance/Dashboard";

const FinanceManagement = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "income":
        return <IncomeManagement />;
      case "expenses":
        return <ExpenseManagement />;
      case "salaries":
        return <SalaryManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        {["dashboard", "income", "expenses", "salaries"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
      <div>{renderContent()}</div>
    </div>
  );
};

export default FinanceManagement;
