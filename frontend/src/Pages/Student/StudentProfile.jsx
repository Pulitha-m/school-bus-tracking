import React from "react";
import QRCode from "react-qr-code";
import {
  PhoneIcon,
  MailIcon,
  HomeIcon,
  BookOpenIcon,
  BusIcon,
  GraduationCapIcon,
  ClockIcon,
  UserIcon,
  HeartIcon,
  ShieldCheckIcon,
} from "lucide-react";

export function StudentProfile() {
  // Mock student data
  const student = {
    id: "ST12345",
    name: "Alex Johnson",
    grade: "9th Grade",
    busRoute: "Route B-42",
    pickupTime: "7:30 AM",
    dropTime: "3:45 PM",
    address: "123 Maple Street, Springfield",
    phone: "(555) 123-4567",
    email: "alex.j@schoolmail.edu",
    imageUrl:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    status: "Active",
    enrollmentDate: "2022-09-01",
    medicalInfo: {
      allergies: "None",
      medications: "None",
      bloodType: "O+",
    },
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Student Profile</h1>
        <p className="text-gray-500 mt-1">
          Manage student information and details
        </p>
      </div>
      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-500/90 to-amber-600/90 px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-white">
              <img
                src={student.imageUrl}
                alt={student.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{student.name}</h2>
              <div className="flex items-center mt-1 text-amber-50">
                <GraduationCapIcon size={16} className="mr-1" />
                <span>{student.grade}</span>
                <span className="mx-2">•</span>
                <span>ID: {student.id}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <ShieldCheckIcon size={14} className="mr-1" />
                {student.status}
              </span>
            </div>
          </div>
        </div>
        {/* Profile Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <UserIcon size={18} className="mr-2 text-amber-500" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <PhoneIcon size={16} className="mr-2 text-amber-500" />
                  <span className="text-gray-600">{student.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MailIcon size={16} className="mr-2 text-amber-500" />
                  <span className="text-gray-600">{student.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <HomeIcon size={16} className="mr-2 text-amber-500" />
                  <span className="text-gray-600">{student.address}</span>
                </div>
              </div>
            </div>
            {/* Transportation Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <BusIcon size={18} className="mr-2 text-amber-500" />
                Transportation Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <BookOpenIcon size={16} className="mr-2 text-amber-500" />
                  <span className="text-gray-600">
                    Bus Route: <strong>{student.busRoute}</strong>
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <ClockIcon size={16} className="mr-2 text-amber-500" />
                  <div className="flex flex-col">
                    <span className="text-gray-600">
                      Pickup: <strong>{student.pickupTime}</strong>
                    </span>
                    <span className="text-gray-600">
                      Drop-off: <strong>{student.dropTime}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* QR Code */}
            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-sm font-medium text-gray-500 mb-4">
                Student ID QR Code
              </p>
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <QRCode
                  value={`STUDENT:${student.id}:${student.name}`}
                  size={120}
                  level="H"
                />
              </div>
              <p className="mt-3 text-xs text-center text-gray-500">
                Scan for quick attendance
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Emergency Contacts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 flex items-center mb-4">
            <HeartIcon size={18} className="mr-2 text-amber-500" />
            Emergency Contacts
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-amber-50/50 rounded-lg border border-amber-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-600">Mother</p>
                </div>
                <a
                  href="tel:(555) 987-6543"
                  className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                >
                  (555) 987-6543
                </a>
              </div>
            </div>
            <div className="p-4 bg-amber-50/50 rounded-lg border border-amber-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">Michael Johnson</p>
                  <p className="text-sm text-gray-600">Father</p>
                </div>
                <a
                  href="tel:(555) 876-5432"
                  className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                >
                  (555) 876-5432
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Medical Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 flex items-center mb-4">
            <HeartIcon size={18} className="mr-2 text-amber-500" />
            Medical Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Blood Type</p>
              <p className="font-medium text-gray-900">
                {student.medicalInfo.bloodType}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Allergies</p>
              <p className="font-medium text-gray-900">
                {student.medicalInfo.allergies}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg col-span-2">
              <p className="text-xs text-gray-500">Medications</p>
              <p className="font-medium text-gray-900">
                {student.medicalInfo.medications}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
