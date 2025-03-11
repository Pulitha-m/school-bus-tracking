import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { BusIcon } from "lucide-react";
import { Dashboard } from "./Dashboard";
import { StudentManagement } from "./StudentManagement";
import { DriverManagement } from "./DriverManagement";
import { DriverProfile } from "./DriverProfile";
import { FinanceManagement } from "./FinanceManagement";
import { LocationTracking } from "./LocationTracking";
import { AttendanceLogs } from "./AttendanceLogs";
import { VehicleManagement } from "./VehicleManagement";
import { CareerManagement } from "./CareerManagement";
import { FeedbackManagement } from "./FeedbackManagement";
import { InquiryManagement } from "./InquiryManagement";
import { FeedbackAnalysis } from "./FeedbackAnalysis";
import { RouteManagement } from "./RouteManagement";

export function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "students":
        return <StudentManagement />;
      case "drivers":
        return <DriverManagement />;
      case "driver-profile":
        return <DriverProfile />;
      case "finance":
        return <FinanceManagement />;
      case "location":
        return <LocationTracking />;
      case "attendance":
        return <AttendanceLogs />;
      case "vehicles":
        return <VehicleManagement />;
      case "careers":
        return <CareerManagement />;
      case "feedback":
        return <FeedbackManagement />;
      case "inquiries":
        return <InquiryManagement />;
      case "feedback-analysis":
        return <FeedbackAnalysis />;
      case "route-management":
        return <RouteManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center border-b">
        <div className="flex items-center">
          <BusIcon className="h-6 w-6 text-amber-500" />
          <span className="ml-2 font-bold text-xl">SchoolBus</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-500 hover:text-gray-700"
        >
          {mobileMenuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">{renderPage()}</main>
    </div>
  );
}
