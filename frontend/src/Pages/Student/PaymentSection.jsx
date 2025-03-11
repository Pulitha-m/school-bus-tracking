import React, { useState } from "react";
import {
  CreditCardIcon,
  CalendarIcon,
  CheckCircleIcon,
  DownloadIcon,
  PlusIcon,
  DollarSignIcon,
} from "lucide-react";

export function PaymentSection() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("credit_card");

  const paymentHistory = [
    {
      id: "PAY-001",
      date: "2023-06-01",
      amount: 150,
      status: "paid",
      method: "Credit Card",
      description: "June 2023 Bus Service Fee",
    },
    {
      id: "PAY-002",
      date: "2023-05-01",
      amount: 150,
      status: "paid",
      method: "Bank Transfer",
      description: "May 2023 Bus Service Fee",
    },
    {
      id: "PAY-003",
      date: "2023-04-01",
      amount: 150,
      status: "paid",
      method: "Credit Card",
      description: "April 2023 Bus Service Fee",
    },
  ];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Payments</h1>
        <p className="text-gray-500 mt-1">Manage your bus service payments</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Current Balance</p>
            <p className="text-2xl font-bold text-gray-900">$0.00</p>
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Payment History</h2>
        <button
          onClick={() => setShowPaymentModal(true)}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" /> Make Payment
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paymentHistory.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(payment.date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {payment.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                        payment.status
                      )}`}
                    >
                      {payment.status.charAt(0).toUpperCase() +
                        payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-amber-600 hover:text-amber-700 font-medium flex items-center">
                      <DownloadIcon className="h-4 w-4 mr-1" /> Receipt
                    </button>
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
