import React, { useEffect, useState } from "react";
import axios from "axios";
import backendUrl from "../../config/config";
import { UsersIcon, Trash2Icon } from "lucide-react";

export default function Inquiry() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/inquiry`, {
          withCredentials: true,
        });
        setInquiries(response.data);
      } catch (err) {
        setError("Failed to fetch inquiry data.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      try {
        await axios.delete(`${backendUrl}/api/inquiry/${id}`);
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete inquiry.");
      }
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const query = searchQuery.toLowerCase();
    const subject = inq.subject.toLowerCase();
    const email = inq.email.toLowerCase();
    return (
      inq.id.toString().includes(query) ||
      subject.includes(query) ||
      email.includes(query)
    );
  });

  // Sort filtered inquiries by id in descending order
  const sortedInquiries = filteredInquiries.sort((a, b) => b.id - a.id);

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
        Inquiries
      </h2>

      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search by Inquiry ID, Subject, or Email"
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Record Count Card */}
      <div className="bg-white rounded-lg shadow-md p-5 max-w-sm mx-auto flex items-center justify-between border border-blue-200">
        <div>
          <p className="text-blue-600 font-medium">Total Inquiries</p>
          <h3 className="text-3xl font-bold text-blue-700">
            {filteredInquiries.length}
          </h3>
        </div>
        <div className="bg-blue-100 p-3 rounded-full">
          <UsersIcon className="h-6 w-6 text-blue-500" />
        </div>
      </div>

      {/* Table Display */}
      {loading && (
        <p className="text-center text-gray-600">Loading inquiries...</p>
      )}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && !error && inquiries.length === 0 && (
        <p className="text-center text-gray-600">No inquiries found.</p>
      )}

      {!loading && !error && sortedInquiries.length > 0 && (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white border border-gray-100 rounded-lg">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="py-3 px-4 border-b">Inquiry ID</th>
                <th className="py-3 px-4 border-b">Subject</th>
                <th className="py-3 px-4 border-b">Message</th>
                <th className="py-3 px-4 border-b">Email</th>
                <th className="py-3 px-4 border-b text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedInquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-blue-50 transition-colors">
                  <td className="py-3 px-4 border-b border-gray-300">
                    {inq.id}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300">
                    {inq.subject}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300">
                    {inq.message}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300">
                    {inq.email}
                  </td>
                  <td className="py-3 px-4 border-b text-right space-x-2 border-gray-300">
                    <button
                      onClick={() => handleDelete(inq.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition duration-200"
                    >
                      <Trash2Icon size={14} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
