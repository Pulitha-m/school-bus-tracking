import React, { useEffect, useState } from "react";
import axios from "axios";
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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backendUrl from "../../config/config";
import QRCode from "react-qr-code";

export function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [busInfo, setBusInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Get student ID from session storage
        const sessionData = sessionStorage.getItem("user");
        if (!sessionData) {
          throw new Error("No session data found");
        }

        const { id } = JSON.parse(sessionData);

        // Fetch student data
        const response = await axios.get(`${backendUrl}/getStudentById/${id}`, {
          withCredentials: true,
        });
        const studentData = response.data;
        setStudent(studentData);

        // Fetch bus info if available
        if (studentData.busId) {
          const busResponse = await axios.get(
            `${backendUrl}/getBusById/${studentData.busId}`,
            { withCredentials: true }
          );
          setBusInfo(busResponse.data);
        }
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (loading)
    return <div className="text-center py-8">Loading student data...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!student)
    return <div className="text-center py-8">No student data found</div>;

  // Format the data to match the component's expected structure
  const formattedStudent = {
    id: student.id,
    name: `${student.firstName} ${student.lastName}`,
    grade: "Grade not provided", // You might need to add this field to your API
    busRoute: busInfo ? `Route ${busInfo.routeId}` : "Not assigned",
    pickupTime: "Not specified", // You might need to add this field to your API
    dropTime: "Not specified", // You might need to add this field to your API
    address: student.startLocation,
    phone: student.emergencyPhone,
    email: student.user.username,
    imageUrl:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    status: student.registered ? "Active" : "Inactive",
    enrollmentDate: student.dob, // Using DOB as enrollment date for now
    medicalInfo: {
      allergies: student.allergies || "None",
      medications: student.medicalNotes || "None",
      bloodType: "Not specified", // You might need to add this field to your API
    },
    emergencyContacts: [
      {
        name: student.emergencyName,
        relation: student.emergencyRelation,
        phone: student.emergencyPhone,
      },
    ],
    qrCodeBase64: student.qrCodeBase64,
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ToastContainer />
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
                src={formattedStudent.imageUrl}
                alt={formattedStudent.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">
                {formattedStudent.name}
              </h2>
              <div className="flex items-center mt-1 text-amber-50">
                <GraduationCapIcon size={16} className="mr-1" />
                <span>{formattedStudent.grade}</span>
                <span className="mx-2">•</span>
                <span>ID: {formattedStudent.id}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <ShieldCheckIcon size={14} className="mr-1" />
                {formattedStudent.status}
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
                  <span className="text-gray-600">
                    {formattedStudent.phone}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <MailIcon size={16} className="mr-2 text-amber-500" />
                  <span className="text-gray-600">
                    {formattedStudent.email}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <HomeIcon size={16} className="mr-2 text-amber-500" />
                  <span className="text-gray-600">
                    {formattedStudent.address}
                  </span>
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
                    Bus Route: <strong>{formattedStudent.busRoute}</strong>
                  </span>
                </div>
                {busInfo && (
                  <div className="flex items-center text-sm">
                    <span className="text-gray-600">
                      Bus Plate: <strong>{busInfo.noPlate}</strong>
                    </span>
                  </div>
                )}
                <div className="flex items-center text-sm">
                  <ClockIcon size={16} className="mr-2 text-amber-500" />
                  <div className="flex flex-col">
                    <span className="text-gray-600">
                      Pickup: <strong>{formattedStudent.pickupTime}</strong>
                    </span>
                    <span className="text-gray-600">
                      Drop-off: <strong>{formattedStudent.dropTime}</strong>
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
              {formattedStudent.qrCodeBase64 ? (
                <img
                  src={`data:image/png;base64,${formattedStudent.qrCodeBase64}`}
                  alt="QR Code"
                  className="w-32 h-32"
                />
              ) : (
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <QRCode
                    value={`STUDENT:${formattedStudent.id}:${formattedStudent.name}`}
                    size={120}
                    level="H"
                  />
                </div>
              )}
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
            {formattedStudent.emergencyContacts.map((contact, index) => (
              <div
                key={index}
                className="p-4 bg-amber-50/50 rounded-lg border border-amber-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.relation}</p>
                  </div>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>
            ))}
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
                {formattedStudent.medicalInfo.bloodType}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Allergies</p>
              <p className="font-medium text-gray-900">
                {formattedStudent.medicalInfo.allergies}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg col-span-2">
              <p className="text-xs text-gray-500">Medications</p>
              <p className="font-medium text-gray-900">
                {formattedStudent.medicalInfo.medications}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
