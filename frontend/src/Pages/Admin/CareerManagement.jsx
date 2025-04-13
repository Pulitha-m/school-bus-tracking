import React, { useEffect, useState } from "react";
import axios from "axios";
import backendUrl from "../../config/config";
import {
  Trash2Icon,
  EyeIcon,
  MailIcon,
  UserPlusIcon,
  DownloadIcon,
  XIcon,
  UsersIcon,
  CheckCircleIcon,
  HourglassIcon,
  ClipboardCheckIcon,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "react-toastify/dist/ReactToastify.css";

const CareerManagement = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchCareers = async () => {
    try {
      const res = await axios.get(`${backendUrl}/getAllCareerReq`);
      setCareers(res.data);
    } catch (err) {
      toast.error("Failed to load career requests");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await axios.delete(`${backendUrl}/deleteCareer/${id}`);
      setCareers((prev) => prev.filter((c) => c.id !== id));
      toast.success("Career request deleted.");
    } catch {
      toast.error("Failed to delete request.");
    }
  };

  const sendInterviewEmails = async () => {
    try {
      await axios.post(`${backendUrl}/callInterview`);
      toast.success("Interview invitations sent.");
      fetchCareers();
    } catch {
      toast.error("Failed to send interview invitations.");
    }
  };

  const handleCreateAccount = async (career) => {
    try {
      const res = await axios.post(
        `${backendUrl}/createDriAccount/${career.id}`
      );
      toast.success(res.data || `Account created for ${career.name}`);

      setCareers((prev) =>
        prev.map((c) =>
          c.id === career.id ? { ...c, accountCreated: true } : c
        )
      );
    } catch (err) {
      toast.error(
        "Failed to create account: " + (err.response?.data || err.message)
      );
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${backendUrl}/updateCareerStatus/${id}`, null, {
        params: { status: newStatus },
      });
      setCareers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(careers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Careers");
    XLSX.writeFile(wb, "Career_Applications.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Career Applications", 14, 16);
    const tableData = careers.map((c) => [c.name, c.email, c.phone, c.status]);
    doc.autoTable({
      head: [["Name", "Email", "Phone", "Status"]],
      body: tableData,
      startY: 20,
    });
    doc.save("Career_Applications.pdf");
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  const pendingCareers = careers.filter((c) => c.status === "PENDING");
  const acceptedCareers = careers.filter((c) => c.status === "ACCEPTED");
  const interviewCalledCareers = careers.filter(
    (c) => c.status === "INTERVIEW CALLED"
  );

  return (
    <div className="p-6">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Career Management</h1>
        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
          >
            Excel
          </button>
          <button
            onClick={exportToPDF}
            className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
          >
            PDF
          </button>
          <button
            onClick={sendInterviewEmails}
            className={`px-4 py-2 rounded text-white ${
              careers.some((c) => c.status !== "INTERVIEW CALLED")
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!careers.some((c) => c.status !== "INTERVIEW CALLED")}
          >
            <MailIcon className="inline w-4 h-4 mr-1" /> Send Interviews
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border p-4 rounded shadow flex items-center gap-3">
          <UsersIcon className="w-6 h-6 text-blue-600" />
          <div>
            <p className="text-gray-600 text-sm">Total Requests</p>
            <h3 className="text-lg font-semibold">{careers.length}</h3>
          </div>
        </div>
        <div className="bg-white border p-4 rounded shadow flex items-center gap-3">
          <HourglassIcon className="w-6 h-6 text-yellow-600" />
          <div>
            <p className="text-gray-600 text-sm">Pending</p>
            <h3 className="text-lg font-semibold">{pendingCareers.length}</h3>
          </div>
        </div>
        <div className="bg-white border p-4 rounded shadow flex items-center gap-3">
          <CheckCircleIcon className="w-6 h-6 text-green-600" />
          <div>
            <p className="text-gray-600 text-sm">Accepted</p>
            <h3 className="text-lg font-semibold">{acceptedCareers.length}</h3>
          </div>
        </div>
        <div className="bg-white border p-4 rounded shadow flex items-center gap-3">
          <ClipboardCheckIcon className="w-6 h-6 text-purple-600" />
          <div>
            <p className="text-gray-600 text-sm">Interview Called</p>
            <h3 className="text-lg font-semibold">
              {interviewCalledCareers.length}
            </h3>
          </div>
        </div>
      </div>

      {/* Applicants Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">CV</th>
              <th className="px-6 py-3">License</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {careers.map((career) => (
              <tr key={career.id} className="border-t">
                <td className="px-6 py-4">{career.name}</td>
                <td className="px-6 py-4">{career.email}</td>
                <td className="px-6 py-4">{career.phone}</td>
                <td className="px-6 py-4">
                  <select
                    value={career.status}
                    onChange={(e) => updateStatus(career.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="ACCEPTED">ACCEPTED</option>
                    <option value="INTERVIEW CALLED">INTERVIEW CALLED</option>
                  </select>
                </td>
                <td className="px-6 py-3">
                  {career.cvImage ? (
                    <img
                      src={`data:image/jpeg;base64,${career.cvImage}`}
                      alt="CV"
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="px-6 py-3">
                  {career.drivers_license ? (
                    <img
                      src={`data:image/jpeg;base64,${career.drivers_license}`}
                      alt="License"
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => {
                      setSelectedCareer(career);
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <EyeIcon className="w-4 h-4 mr-1" /> View
                  </button>
                  <button
                    onClick={() => handleDelete(career.id)}
                    className="text-red-600 hover:underline flex items-center"
                  >
                    <Trash2Icon className="w-4 h-4 mr-1" /> Delete
                  </button>
                  {career.status === "ACCEPTED" && (
                    <button
                      onClick={() => handleCreateAccount(career)}
                      disabled={career.accountCreated}
                      className={`px-2 py-1 rounded flex items-center text-white ${
                        career.accountCreated
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      <UserPlusIcon className="w-4 h-4 inline mr-1" />
                      {career.accountCreated ? "Account Created" : "Create"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {showModal && selectedCareer && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              <XIcon className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Applicant Details
            </h2>
            <p>
              <strong>Name:</strong> {selectedCareer.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedCareer.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedCareer.phone}
            </p>
            <p>
              <strong>Status:</strong> {selectedCareer.status}
            </p>
            <p>
              <strong>Date:</strong> {selectedCareer.date}
            </p>
            {selectedCareer.cvImage && (
              <div className="mt-4">
                <p className="font-medium text-gray-700 mb-1">CV Preview:</p>
                <img
                  src={`data:image/jpeg;base64,${selectedCareer.cvImage}`}
                  alt="CV Preview"
                  className="w-full rounded shadow"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerManagement;
