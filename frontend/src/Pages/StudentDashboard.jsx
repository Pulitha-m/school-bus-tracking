import React from "react";

const StudentDashboard = () => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-1/4 bg-black text-white p-6">
        <h1 className="text-2xl font-semibold mb-6">Student Dashboard</h1>
        <nav>
          <ul>
            <li className="mb-4">
              <a href="#" className="text-yellow-400 hover:text-white">
                Home
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="text-yellow-400 hover:text-white">
                Attendance
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="text-yellow-400 hover:text-white">
                Bus Location
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="text-yellow-400 hover:text-white">
                Upcoming Events
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="w-3/4 bg-white p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-black">Welcome, Student</h1>
          <button className="bg-yellow-400 text-black py-2 px-4 rounded-lg">
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Bus Location Card */}
          <div className="bg-white border-2 border-gray-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-black">
              Bus Location
            </h2>
            <div className="text-black">
              <h3 className="text-lg">Current Bus Location:</h3>
              <p className="mt-2">Latitude: 12.9716</p>
              <p>Longitude: 77.5946</p>
              <p>Bus Status: On Time</p>
            </div>
          </div>

          {/* Attendance Card */}
          <div className="bg-white border-2 border-gray-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-black">
              Attendance
            </h2>
            <div className="text-black">
              <h3 className="text-lg">Today's Attendance</h3>
              <p className="mt-2">Status: Present</p>
              <button className="bg-yellow-400 text-black py-2 px-4 rounded-lg mt-4 w-full">
                Mark Attendance
              </button>
            </div>
          </div>

          {/* Upcoming Events Card */}
          <div className="bg-white border-2 border-gray-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-black">
              Upcoming Events
            </h2>
            <div className="text-black">
              <h3 className="text-lg">Next Event: School Bus Ride</h3>
              <p className="mt-2">Date: 2025-03-10</p>
              <p className="mt-2">Time: 8:00 AM</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
