import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { DriverProfile } from "./DriverProfile";
import { StudentManagement } from "./StudentManagement";
import { Payments } from "./Payments";
import { Notifications } from "./Notifications";
import { VehicleInfo } from "./VehicleInfo";
import { StudentLocationTracking } from "./StudentLocationTracking";
import { ShareLocation } from "./ShareLocation";

export const DriverDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen h-screen flex flex-col md:flex-row bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-20 md:pt-6">
        {activeTab === "profile" && <DriverProfile />}
        {activeTab === "students" && <StudentManagement />}
        {activeTab === "location" && <StudentLocationTracking />}
        {activeTab === "sharelocation" && <ShareLocation />}
        {activeTab === "payments" && <Payments />}
        {activeTab === "notifications" && <Notifications />}
        {activeTab === "vehicle" && <VehicleInfo />}
      </main>
    </div>
  );
};
