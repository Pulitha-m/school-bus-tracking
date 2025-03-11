import React, { useState } from "react";
import {
  Search,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  FileEditIcon,
  PlusIcon,
  SaveIcon,
  XIcon,
} from "lucide-react";
import { QRScanner } from "./QRScanner";

export const StudentManagement = () => {
  const [activeTab, setActiveTab] = useState("attendance");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showQRScanner, setShowQRScanner] = useState(false);

  const students = [
    {
      id: "1",
      name: "Alex Johnson",
      grade: "9th",
      status: "present",
      route: "B-42",
      notes: "Needs assistance getting on/off the bus",
    },
    {
      id: "2",
      name: "Emma Wilson",
      grade: "7th",
      status: "absent",
      route: "B-42",
      notes: "",
    },
    {
      id: "3",
      name: "Tyler Brown",
      grade: "8th",
      status: "present",
      route: "B-42",
      notes: "Carries musical instrument on Tuesdays",
    },
    {
      id: "4",
      name: "Sophia Davis",
      grade: "6th",
      status: "present",
      route: "B-42",
      notes: "",
    },
    {
      id: "5",
      name: "Jacob Martinez",
      grade: "9th",
      status: "absent",
      route: "B-42",
      notes: "Alternative drop-off on Fridays",
    },
  ];

  const openNoteModal = (studentId) => {
    setSelectedStudent(studentId);
    setShowNoteModal(true);
  };

  const handleQRScan = (data) => {
    console.log("QR Code scanned:", data);
    // Implement attendance marking logic here
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
        <p className="text-gray-600">Manage attendance and student notes</p>
      </div>
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "attendance"
                ? "border-b-2 border-amber-500 text-amber-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("attendance")}
          >
            Attendance
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "notes"
                ? "border-b-2 border-amber-500 text-amber-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("notes")}
          >
            Student Notes
          </button>
        </div>
        <div className="p-4">
          <div className="flex mb-4">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search students..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="ml-2">
              <select className="border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option value="">All Grades</option>
                <option value="6">6th Grade</option>
                <option value="7">7th Grade</option>
                <option value="8">8th Grade</option>
                <option value="9">9th Grade</option>
              </select>
            </div>
          </div>
          {activeTab === "attendance" && (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Morning Pickup
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Afternoon Drop-off
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <UserIcon className="h-10 w-10 rounded-full bg-gray-100 p-2 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: ST{student.id}2345
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.grade} Grade
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.route}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setShowQRScanner(true)}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 hover:bg-amber-200"
                          >
                            Scan QR
                          </button>
                          <button className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200">
                            <XCircleIcon size={16} className="inline mr-1" />
                            Manual
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200">
                            <CheckCircleIcon
                              size={16}
                              className="inline mr-1"
                            />
                            Present
                          </button>
                          <button className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200">
                            <XCircleIcon size={16} className="inline mr-1" />
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === "notes" && (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <UserIcon className="h-10 w-10 rounded-full bg-gray-100 p-2 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: ST{student.id}2345
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.grade} Grade
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {student.notes || "No notes added"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openNoteModal(student.id)}
                          className="text-amber-600 hover:text-amber-900"
                        >
                          <FileEditIcon size={18} className="inline" />
                          <span className="ml-1">Edit Note</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Edit Notes</h2>
              <button
                onClick={() => setShowNoteModal(false)}
                className="text-gray-600"
              >
                <XIcon size={18} />
              </button>
            </div>
            <textarea
              className="w-full mt-4 p-3 border rounded-lg"
              rows="4"
              placeholder="Enter student notes..."
            />
            <div className="mt-4 text-right">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 ml-2 bg-amber-600 text-white rounded-lg"
              >
                <SaveIcon size={18} className="inline mr-2" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {showQRScanner && <QRScanner onScan={handleQRScan} />}
    </div>
  );
};
