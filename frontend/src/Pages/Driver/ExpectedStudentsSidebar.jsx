import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircleIcon, XCircleIcon, RefreshCcw } from 'lucide-react'; // Added Refresh Icon
import backendUrl from '../../config/config';

export const ExpectedStudentsSidebar = () => {
  const [expectedStudents, setExpectedStudents] = useState([]);
  const [comingStudents, setComingStudents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const fetchStudents = async () => {
    const sessionData = sessionStorage.getItem('user');
    if (!sessionData) return;

    const { id: driverId } = JSON.parse(sessionData);

    try {
      const driverResponse = await axios.get(`${backendUrl}/getDriverById/${driverId}`, { withCredentials: true });
      const busId = driverResponse.data.busId;

      const studentResponse = await axios.get(`${backendUrl}/api/availability/bus/${busId}`, { withCredentials: true });
      const students = studentResponse.data;
      const today = new Date().toISOString().split('T')[0];
      const filteredStudents = students.filter((student) => student.date === today);

      setExpectedStudents(filteredStudents);
      setComingStudents(filteredStudents.filter((student) => student.isComing));
      setTotalCount(filteredStudents.length);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-gray-800">Expected Students</h2>
        <button
          onClick={fetchStudents}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Today's expected students for your route
      </p>

      <div className="flex justify-end items-center bg-yellow-100 p-2 rounded-lg mb-4">
        <span className="font-medium text-yellow-800">
          {comingStudents.length}/{totalCount} Students Coming
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="text-left text-sm text-gray-500 uppercase">
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Student Name</th>
              <th className="px-4 py-2">Attendance Type</th>
              <th className="px-4 py-2">Reason</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {expectedStudents.map((student) => (
              <tr
                key={student.id}
                className={`border-t ${student.coming ? 'bg-green-50' : 'bg-gray-50'}`}
              >
                <td className="px-4 py-2">
                  <div className="flex items-center">
                    {student.coming ? (
                      <div className="flex items-center text-green-500">
                        <CheckCircleIcon size={20} />
                        <span className="ml-2 text-green-600">Coming</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-400">
                        <XCircleIcon size={20} />
                        <span className="ml-2 text-gray-500">Not Coming</span>
                      </div>
                    )}
                  </div>
                </td>
                <td
                  className={`px-4 py-2 font-medium ${
                    student.coming ? 'text-gray-800' : 'text-gray-500'
                  }`}
                >
                  {student.studentName}
                </td>
                <td className="px-4 py-2 text-gray-500">{student.attendanceType}</td>
                <td className="px-4 py-2 text-gray-500">{student.reason || '-'}</td>
                <td className="px-4 py-2 text-gray-500">{student.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

