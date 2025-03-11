import React from "react";
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  BadgeIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
  FileTextIcon,
  TruckIcon,
} from "lucide-react";

export const DriverProfile = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Driver Profile</h1>
        <p className="text-gray-600">
          Manage your personal information and details
        </p>
      </div>
      <div className="bg-amber-400 rounded-lg p-6 mb-6">
        <div className="flex items-center">
          <div className="mr-4">
            <img
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&h=120&q=80"
              alt="Driver"
              className="w-20 h-20 rounded-full border-4 border-white object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Michael Davis</h2>
            <div className="flex items-center text-amber-50">
              <BadgeIcon size={16} className="mr-2" />
              <span>ID: DR78945 • Licensed since 2018</span>
            </div>
          </div>
          <div className="ml-auto">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              On Duty
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <UserIcon size={20} className="mr-2 text-amber-500" />
            Personal Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <PhoneIcon size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="text-gray-800">(555) 234-5678</p>
              </div>
            </div>
            <div className="flex items-center">
              <MailIcon size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800">michael.davis@schoolbus.com</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPinIcon size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-gray-800">456 Driver Lane, Springfield</p>
              </div>
            </div>
            <div className="flex items-center">
              <CalendarIcon size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="text-gray-800">March 15, 1985</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <TruckIcon size={20} className="mr-2 text-amber-500" />
            Assigned Vehicle
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Bus Number</p>
              <p className="text-gray-800 font-medium">Bus #42</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">License Plate</p>
              <p className="text-gray-800">SCH-2023</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Route</p>
              <p className="text-gray-800">North Springfield - Route B</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Capacity</p>
              <p className="text-gray-800">42 students</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <ClockIcon size={20} className="mr-2 text-amber-500" />
            Schedule
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Morning Pickup</p>
                <p className="text-gray-800 font-medium">6:30 AM - 8:00 AM</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Afternoon Drop-off</p>
                <p className="text-gray-800 font-medium">2:45 PM - 4:15 PM</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Working Days</p>
              <p className="text-gray-800">Monday - Friday</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <FileTextIcon size={20} className="mr-2 text-amber-500" />
            Documents & Certifications
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-800">Driver's License</p>
                <p className="text-sm text-gray-500">Expires: May 12, 2025</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Valid
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-800">Commercial Driver's License</p>
                <p className="text-sm text-gray-500">Expires: June 30, 2024</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Valid
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-800">First Aid Certification</p>
                <p className="text-sm text-gray-500">
                  Expires: December 15, 2023
                </p>
              </div>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Renew Soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
