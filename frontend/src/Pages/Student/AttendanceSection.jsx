import React from "react";
import { CalendarIcon, CheckIcon, XIcon } from "lucide-react";

export function AttendanceSection() {
  const attendance = [
    {
      date: "2023-06-05",
      status: "present",
      pickupTime: "7:32 AM",
      dropTime: "3:47 PM",
    },
    {
      date: "2023-06-06",
      status: "present",
      pickupTime: "7:29 AM",
      dropTime: "3:45 PM",
    },
    { date: "2023-06-07", status: "absent", pickupTime: "-", dropTime: "-" },
    {
      date: "2023-06-08",
      status: "present",
      pickupTime: "7:35 AM",
      dropTime: "3:46 PM",
    },
    {
      date: "2023-06-09",
      status: "present",
      pickupTime: "7:30 AM",
      dropTime: "3:44 PM",
    },
    {
      date: "2023-06-12",
      status: "present",
      pickupTime: "7:28 AM",
      dropTime: "3:45 PM",
    },
    {
      date: "2023-06-13",
      status: "late",
      pickupTime: "7:45 AM",
      dropTime: "3:45 PM",
    },
    {
      date: "2023-06-14",
      status: "present",
      pickupTime: "7:31 AM",
      dropTime: "3:46 PM",
    },
  ];

  const stats = {
    present: attendance.filter((a) => a.status === "present").length,
    absent: attendance.filter((a) => a.status === "absent").length,
    late: attendance.filter((a) => a.status === "late").length,
    total: attendance.length,
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Attendance History
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Object.entries(stats).map(([key, value]) => (
          <div
            key={key}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          >
            <p className="text-sm text-gray-500">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </p>
            <div className="flex items-center">
              <p
                className={
                  key === "present"
                    ? "text-green-600"
                    : key === "absent"
                    ? "text-red-600"
                    : "text-amber-600"
                }
              >
                {value}
              </p>
              <span className="ml-2 text-sm text-gray-500">
                ({Math.round((value / stats.total) * 100)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pickup Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Drop-off Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendance.map((record, index) => (
                <tr
                  key={index}
                  className={
                    record.status === "absent"
                      ? "bg-red-50"
                      : record.status === "late"
                      ? "bg-amber-50"
                      : ""
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    <div className="flex items-center">
                      <CalendarIcon size={16} className="mr-2 text-gray-400" />
                      {formatDate(record.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {record.status === "present" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckIcon size={12} className="mr-1" /> Present
                      </span>
                    )}
                    {record.status === "absent" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XIcon size={12} className="mr-1" /> Absent
                      </span>
                    )}
                    {record.status === "late" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        <span className="mr-1">⏱</span> Late
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {record.pickupTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {record.dropTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AttendanceSection;
