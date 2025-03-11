import React from "react";
import {
  UserIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  FileTextIcon,
  TruckIcon,
  UsersIcon,
} from "lucide-react";

export function DriverProfile() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Driver Profile</h1>
        <p className="text-gray-600">
          Manage your personal information and details
        </p>
      </div>
      {/* Driver Header */}
      <div className="bg-amber-400 rounded-lg p-4 md:p-6 text-white flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <div className="h-20 w-20 rounded-full bg-white overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
              alt="Driver"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold">Michael Davis</h2>
            <div className="flex items-center text-amber-100">
              <span>ID: DR78945 • Licensed since 2018</span>
            </div>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            On Duty
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <UserIcon className="h-5 w-5 text-amber-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-800">
              Personal Information
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start">
              <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium">(555) 234-5678</p>
              </div>
            </div>
            <div className="flex items-start">
              <MailIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">michael.davis@schoolbus.com</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">456 Driver Lane, Springfield</p>
              </div>
            </div>
            <div className="flex items-start">
              <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">March 15, 1985</p>
              </div>
            </div>
          </div>
        </div>
        {/* Assigned Vehicle */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <TruckIcon className="h-5 w-5 text-amber-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-800">
              Assigned Vehicle
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="h-5 w-5 flex justify-center items-center mr-3">
                <span className="text-gray-400">#</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bus Number</p>
                <p className="font-medium">Bus #42</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="h-5 w-5 flex justify-center items-center mr-3">
                <span className="text-gray-400">LP</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">License Plate</p>
                <p className="font-medium">SCH-2023</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Route</p>
                <p className="font-medium">North Springfield - Route B</p>
              </div>
            </div>
            <div className="flex items-start">
              <UsersIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Capacity</p>
                <p className="font-medium">42 students</p>
              </div>
            </div>
          </div>
        </div>
        {/* Schedule */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <ClockIcon className="h-5 w-5 text-amber-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-800">Schedule</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Morning Pickup</p>
              <p className="font-medium">7:30 AM - 8:30 AM</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Afternoon Drop-off</p>
              <p className="font-medium">3:45 PM - 4:45 PM</p>
            </div>
            <div className="col-span-1 md:col-span-2">
              <p className="text-sm text-gray-500">Working Days</p>
              <div className="flex space-x-2 mt-1">
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                  Monday
                </span>
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                  Tuesday
                </span>
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                  Wednesday
                </span>
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                  Thursday
                </span>
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                  Friday
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Documents & Certifications */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <FileTextIcon className="h-5 w-5 text-amber-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-800">
              Documents & Certifications
            </h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Driver's License</p>
                <p className="text-sm text-gray-500">Expires: Jan 15, 2025</p>
              </div>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                Valid
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Commercial Driver's License</p>
                <p className="text-sm text-gray-500">Expires: Mar 22, 2024</p>
              </div>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                Valid
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">First Aid Certification</p>
                <p className="text-sm text-gray-500">Expires: Sep 10, 2023</p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                Renew Soon
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Background Check</p>
                <p className="text-sm text-gray-500">
                  Last completed: May 5, 2023
                </p>
              </div>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                Passed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
