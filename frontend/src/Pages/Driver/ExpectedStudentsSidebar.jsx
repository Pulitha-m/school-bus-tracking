import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CheckCircleIcon,
  XCircleIcon,
  RefreshCcw,
  CalendarIcon,
  UsersIcon,
  SearchIcon,
} from 'lucide-react';
import backendUrl from '../../config/config';

export const ExpectedStudentsSidebar = () => {
  const [expectedStudents, setExpectedStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStudents = async () => {
    const sessionData = sessionStorage.getItem('user');
    if (!sessionData) return;

    const { id: driverId } = JSON.parse(sessionData);

    try {
      const driverResponse = await axios.get(`${backendUrl}/getDriverById/${driverId}`, {
        withCredentials: true,
      });
      const busId = driverResponse.data.busId;

      const studentResponse = await axios.get(`${backendUrl}/api/availability/bus/${busId}`, {
        withCredentials: true,
      });
      const students = studentResponse.data;
      const today = new Date().toISOString().split('T')[0];
      const filteredStudents = students.filter((student) => student.date === today);

      setExpectedStudents(filteredStudents);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const comingToday = expectedStudents.filter((s) => s.coming);
  const notComingToday = expectedStudents.filter((s) => !s.coming);

  const filteredList = expectedStudents.filter((s) =>
    s.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredComing = filteredList.filter((s) => s.coming);
  const filteredNotComing = filteredList.filter((s) => !s.coming);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <CalendarIcon size={16} />
          <span>{todayFormatted}</span>
        </div>
        <button
          onClick={fetchStudents}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-700 font-medium">Total Students</p>
            <p className="text-2xl font-bold text-black">{expectedStudents.length}</p>
          </div>
          <UsersIcon size={24} className="text-blue-500" />
        </div>

        <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-700 font-medium">Coming Today</p>
            <p className="text-2xl font-bold text-black">{comingToday.length}</p>
          </div>
          <CheckCircleIcon size={24} className="text-green-600" />
        </div>

        <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-700 font-medium">Not Coming Today</p>
            <p className="text-2xl font-bold text-black">{notComingToday.length}</p>
          </div>
          <XCircleIcon size={24} className="text-red-600" />
        </div>
      </div>

      {/* Attendance Table Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Student Attendance Details</h2>
        <p className="text-sm text-gray-600 mb-4">
          Today's expected students for your route
        </p>

        {/* Search */}
        <div className="flex items-center mb-4 border border-gray-300 rounded-md overflow-hidden w-64">
          <div className="px-3 text-gray-500">
            <SearchIcon size={18} />
          </div>
          <input
            type="text"
            className="w-full px-2 py-1 outline-none text-sm"
            placeholder="Search by student name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
  <table className="min-w-full border-collapse bg-white rounded-lg">
    <thead>
      <tr className="text-left text-sm text-gray-500 uppercase border-b border-gray-200">
        <th className="px-4 py-3">Status</th>
        <th className="px-4 py-3">Student Name</th>
        <th className="px-4 py-3">Attendance Type</th>
        
      </tr>
    </thead>
    <tbody>
      {/* Coming Today */}
      {filteredComing.length > 0 && (
        <>
          <tr>
            <td colSpan="4" className="bg-green-100/50 text-green-800 px-4 py-2 font-semibold">
              Coming Today
            </td>
          </tr>
          {filteredComing.map((student) => (
            <tr key={student.id} className="border-b border-gray-200 hover:bg-green-50 transition">
              <td className="px-4 py-2">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                  Coming
                </span>
              </td>
              <td className="px-4 py-2 text-gray-900 font-semibold">{student.studentName}</td>
              <td className="px-4 py-2 text-gray-600">{student.attendanceType || 'N/A'}</td>
              
            </tr>
          ))}
        </>
      )}

      {/* Not Coming Today */}
      {filteredNotComing.length > 0 && (
        <>
          <tr>
            <td colSpan="4" className="bg-red-100/50 text-red-800 px-4 py-2 font-semibold">
              Not Coming Today
            </td>
          </tr>
          {filteredNotComing.map((student) => (
            <tr key={student.id} className="border-b border-gray-200 hover:bg-red-50 transition">
              <td className="px-4 py-2">
                <span className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full">
                  Not Coming
                </span>
              </td>
              <td className="px-4 py-2 text-gray-900 font-semibold">{student.studentName}</td>
              <td className="px-4 py-2 text-gray-600">{student.attendanceType || 'N/A'}</td>
             
            </tr>
          ))}
        </>
      )}
    </tbody>
  </table>
</div>

      </div>
    </div>
  );
};