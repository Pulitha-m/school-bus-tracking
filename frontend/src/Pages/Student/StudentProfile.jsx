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
  PencilIcon,
  SaveIcon,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backendUrl from "../../config/config";
import QRCode from "react-qr-code";

export function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [busInfo, setBusInfo] = useState(null);
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const sessionData = sessionStorage.getItem("user");
        if (!sessionData) throw new Error("No session data found");

        const { id } = JSON.parse(sessionData);
        const response = await axios.get(`${backendUrl}/getStudentById/${id}`, {
          withCredentials: true,
        });

        const studentData = response.data;
        setStudent(studentData);
        setFormData({
          firstName: studentData.firstName || "",
          lastName: studentData.lastName || "",
          startLocation: studentData.startLocation || "",
          endLocation: studentData.endLocation || "",
          emergencyName: studentData.emergencyName || "",
          emergencyPhone: studentData.emergencyPhone || "",
          emergencyRelation: studentData.emergencyRelation || "",
          allergies: studentData.allergies || "",
          medicalNotes: studentData.medicalNotes || "",
        });

        if (studentData.busId) {
          const busResponse = await axios.get(
            `${backendUrl}/getBusById/${studentData.busId}`,
            {
              withCredentials: true,
            }
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

  const handleNameChange = (e) => {
    const { name, value } = e.target;
    // Only allow letters, spaces, hyphens, and apostrophes
    if (/^[a-zA-Z\s'-]*$/.test(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    // Only allow numbers, parentheses, hyphens, and plus sign
    if (/^[0-9+()\s-]*$/.test(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGenericChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const sessionData = sessionStorage.getItem("user");
    const { id } = JSON.parse(sessionData);

    try {
      const updatedStudent = {
        ...student,
        firstName: formData.firstName,
        lastName: formData.lastName,
        startLocation: formData.startLocation,
        endLocation: formData.endLocation,
        emergencyName: formData.emergencyName,
        emergencyPhone: formData.emergencyPhone,
        emergencyRelation: formData.emergencyRelation,
        allergies: formData.allergies,
        medicalNotes: formData.medicalNotes,
      };

      const res = await axios.put(
        `${backendUrl}/updateStudent/${id}`,
        updatedStudent,
        { withCredentials: true }
      );

      setStudent(res.data);
      toast.success("Profile updated successfully!");
      setEditMode(false);

      const existingUser = JSON.parse(sessionStorage.getItem("user"));
      const updatedUser = {
        ...existingUser,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        startLocation: res.data.startLocation,
        endLocation: res.data.endLocation,
        emergencyName: res.data.emergencyName,
        emergencyPhone: res.data.emergencyPhone,
        emergencyRelation: res.data.emergencyRelation,
        allergies: res.data.allergies,
        medicalNotes: res.data.medicalNotes,
      };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      toast.error("Failed to update student profile");
      console.error("Update error:", err.response?.data || err.message);
    }
  };

  if (loading)
    return <div className="text-center py-8">Loading student data...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!student)
    return <div className="text-center py-8">No student data found</div>;

  const formattedStudent = {
    id: student.id,
    name: `${formData.firstName} ${formData.lastName}`,
    grade: "Grade not provided",
    busRoute: busInfo ? `Route ${busInfo.routeId}` : "Not assigned",
    pickupTime: "Not specified",
    dropTime: "Not specified",
    address: formData.startLocation,
    phone: formData.emergencyPhone,
    email: student.user.username,
    imageUrl:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    status: student.registered ? "Active" : "Inactive",
    enrollmentDate: student.dob,
    medicalInfo: {
      allergies: formData.allergies || "None",
      medications: formData.medicalNotes || "None",
      bloodType: "Not specified",
    },
    emergencyContacts: [
      {
        name: formData.emergencyName,
        relation: formData.emergencyRelation,
        phone: formData.emergencyPhone,
      },
    ],
    qrCodeBase64: student.qrCodeBase64,
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Student Profile</h1>
          <p className="text-gray-500 mt-1">Manage your personal details</p>
        </div>
        <button
          onClick={editMode ? handleSave : () => setEditMode(true)}
          className="flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
        >
          {editMode ? (
            <SaveIcon className="mr-2" />
          ) : (
            <PencilIcon className="mr-2" />
          )}
          {editMode ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <UserIcon size={18} className="mr-2 text-amber-500" />
                Contact Information
              </h3>
              <div className="space-y-3">
                {[
                  {
                    label: "First Name",
                    name: "firstName",
                    onChange: handleNameChange,
                  },
                  {
                    label: "Last Name",
                    name: "lastName",
                    onChange: handleNameChange,
                  },
                  {
                    label: "Email",
                    name: "email",
                    value: formattedStudent.email,
                    editable: false,
                  },
                  {
                    label: "Phone",
                    name: "emergencyPhone",
                    onChange: handlePhoneChange,
                  },
                  {
                    label: "Address",
                    name: "startLocation",
                    editable: false,
                  },
                ].map((field) => (
                  <div key={field.name} className="flex items-center text-sm">
                    {field.name !== "email" &&
                      field.name !== "startLocation" && (
                        <HomeIcon size={16} className="mr-2 text-amber-500" />
                      )}
                    {field.name === "email" && (
                      <MailIcon size={16} className="mr-2 text-amber-500" />
                    )}
                    {field.name === "emergencyPhone" && (
                      <PhoneIcon size={16} className="mr-2 text-amber-500" />
                    )}
                    {field.name === "startLocation" && (
                      <HomeIcon size={16} className="mr-2 text-amber-500" />
                    )}
                    {editMode && field.editable !== false ? (
                      <input
                        type="text"
                        name={field.name}
                        value={formData[field.name]}
                        onChange={field.onChange || handleGenericChange}
                        className="w-full border rounded px-3 py-1"
                      />
                    ) : (
                      <span className="text-gray-600">
                        {field.value || formData[field.name] || "N/A"}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                {editMode && (
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <HomeIcon size={16} className="mr-2 text-amber-500" />
                      <span className="text-gray-600">
                        {formData.endLocation || "N/A"}
                      </span>
                    </div>
                  </div>
                )}
                {!editMode && formData.endLocation && (
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <HomeIcon size={16} className="mr-2 text-amber-500" />
                      <span className="text-gray-600">
                        {formData.endLocation}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
                    {editMode ? (
                      <>
                        <input
                          type="text"
                          name="emergencyName"
                          value={formData.emergencyName}
                          onChange={handleNameChange}
                          className="w-full border rounded px-3 py-1 mb-2"
                          placeholder="Emergency Contact Name"
                        />
                        <input
                          type="text"
                          name="emergencyRelation"
                          value={formData.emergencyRelation}
                          onChange={handleGenericChange}
                          className="w-full border rounded px-3 py-1"
                          placeholder="Relation"
                        />
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-gray-900">
                          {contact.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {contact.relation}
                        </p>
                      </>
                    )}
                  </div>
                  {editMode ? (
                    <input
                      type="text"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handlePhoneChange}
                      className="border rounded px-3 py-1"
                      placeholder="Phone"
                    />
                  ) : (
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                    >
                      {contact.phone}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

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
              {editMode ? (
                <input
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleGenericChange}
                  className="w-full border rounded px-3 py-1"
                  placeholder="Allergies"
                />
              ) : (
                <p className="font-medium text-gray-900">
                  {formattedStudent.medicalInfo.allergies}
                </p>
              )}
            </div>
            <div className="p-3 bg-gray-50 rounded-lg col-span-2">
              <p className="text-xs text-gray-500">Medications</p>
              {editMode ? (
                <input
                  type="text"
                  name="medicalNotes"
                  value={formData.medicalNotes}
                  onChange={handleGenericChange}
                  className="w-full border rounded px-3 py-1"
                  placeholder="Medical Notes"
                />
              ) : (
                <p className="font-medium text-gray-900">
                  {formattedStudent.medicalInfo.medications}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
