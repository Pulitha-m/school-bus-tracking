import React from "react";
import {
  DollarSignIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  DownloadIcon,
} from "lucide-react";

export const Payments = () => {
  const payments = [
    {
      id: "1",
      date: "Oct 15, 2023",
      amount: 1250.0,
      status: "completed",
      description: "Monthly Salary",
    },
    {
      id: "2",
      date: "Sep 15, 2023",
      amount: 1250.0,
      status: "completed",
      description: "Monthly Salary",
    },
    {
      id: "3",
      date: "Aug 15, 2023",
      amount: 1250.0,
      status: "completed",
      description: "Monthly Salary",
    },
    {
      id: "4",
      date: "Jul 15, 2023",
      amount: 1250.0,
      status: "completed",
      description: "Monthly Salary",
    },
    {
      id: "5",
      date: "Oct 5, 2023",
      amount: 75.0,
      status: "pending",
      description: "Fuel Reimbursement",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payments</h1>
        <p className="text-gray-600">
          View your payment history and upcoming payments
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSignIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                Next Payment
              </h3>
              <p className="text-xl font-bold text-gray-900">$1,250.00</p>
            </div>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-500">Due on Nov 15, 2023</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSignIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                Year to Date
              </h3>
              <p className="text-xl font-bold text-gray-900">$12,575.00</p>
            </div>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-500">Jan 1 - Oct 31, 2023</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <ClockIcon className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                Pending Payments
              </h3>
              <p className="text-xl font-bold text-gray-900">$75.00</p>
            </div>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-500">1 pending payment</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Payment History
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Receipt
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.status === "completed" ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        <CheckCircleIcon size={16} className="mr-1" /> Completed
                      </span>
                    ) : (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        <ClockIcon size={16} className="mr-1" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {payment.status === "completed" && (
                      <button className="text-amber-600 hover:text-amber-900">
                        <DownloadIcon size={16} className="inline mr-1" />
                        Download
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
