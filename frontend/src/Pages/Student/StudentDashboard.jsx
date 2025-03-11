import React, { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { Sidebar } from "./SideBar";
import { StudentProfile } from "./StudentProfile";
import { AttendanceSection } from "./AttendanceSection";
import { LocationTracking } from "./LocationTracking";
import { DriverNotes } from "./DriverNotes";
import { NotificationsSection } from "./NotificationSection";
import { PaymentSection } from "./PaymentSection";
import { FeedbackSection } from "./FeedbackSection";

export function StudentDashboard() {
  const [activeSection, setActiveSection] = useState("profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <span className="text-xl font-bold text-gray-800">SchoolBus</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {isMobileMenuOpen ? (
            <XIcon className="h-6 w-6 text-gray-600" />
          ) : (
            <MenuIcon className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>
      {/* Sidebar - Desktop & Mobile */}
      <div
        className={`fixed md:static inset-y-0 left-0 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-200 ease-in-out z-30 md:z-0`}
      >
        <Sidebar
          activeSection={activeSection}
          setActiveSection={(section) => {
            setActiveSection(section);
            setIsMobileMenuOpen(false);
          }}
        />
      </div>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      {/* Main Content */}
      <div className="flex-1 min-w-0 w-full md:w-auto">
        <main className="relative h-full">
          {/* Mobile header spacing */}
          <div className="h-16 md:h-0" />
          {/* Content area */}
          <div className="px-4 py-4 md:px-8 md:py-6">
            {activeSection === "profile" && <StudentProfile />}
            {activeSection === "attendance" && <AttendanceSection />}
            {activeSection === "location" && <LocationTracking />}
            {activeSection === "notifications" && <NotificationsSection />}
            {activeSection === "payments" && <PaymentSection />}
            {activeSection === "feedback" && <FeedbackSection />}
            {activeSection === "notes" && <DriverNotes />}
          </div>
        </main>
      </div>
    </div>
  );
}
