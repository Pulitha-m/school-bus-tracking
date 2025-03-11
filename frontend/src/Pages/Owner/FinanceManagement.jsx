import React, { useState } from "react";
import {
  SearchIcon,
  FilterIcon,
  DownloadIcon,
  CreditCardIcon,
  DollarSignIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CalendarIcon,
  PlusIcon,
} from "lucide-react";
import Modal from "./components/Modal";

const FinanceManagement = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    driver: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const drivers = [
    { id: 1, name: "Michael Davis" },
    { id: 2, name: "Sarah Johnson" },
    { id: 3, name: "Robert Chen" },
    { id: 4, name: "Emily Wilson" },
  ];

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    console.log("Payment submitted:", paymentForm);
    setIsPaymentModalOpen(false);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Finance Management
            </h1>
            <p className="text-gray-600">
              Manage payments, expenses, and financial reports
            </p>
          </div>
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600"
          >
            <PlusIcon size={16} className="mr-2" />
            Make Payment
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 mr-3 text-white bg-green-500 rounded-md">
              <TrendingUpIcon size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Revenue</p>
              <h3 className="text-xl font-bold">$24,500</h3>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 mr-3 text-white bg-red-500 rounded-md">
              <TrendingDownIcon size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Expenses</p>
              <h3 className="text-xl font-bold">$18,300</h3>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 mr-3 text-white bg-amber-500 rounded-md">
              <DollarSignIcon size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Net Profit</p>
              <h3 className="text-xl font-bold">$6,200</h3>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 mr-3 text-white bg-blue-500 rounded-md">
              <CreditCardIcon size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Payments</p>
              <h3 className="text-xl font-bold">$3,450</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Make Payment to Driver"
      >
        <form onSubmit={handlePaymentSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Driver
              </label>
              <select
                value={paymentForm.driver}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, driver: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-amber-500"
                required
              >
                <option value="">Select a driver</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, amount: e.target.value })
                  }
                  className="w-full pl-7 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-amber-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={paymentForm.description}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-amber-500"
                placeholder="Payment description"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Date
              </label>
              <input
                type="date"
                value={paymentForm.date}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, date: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div className="flex space-x-2 pt-4">
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600"
              >
                Make Payment
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex flex-col p-4 space-y-4 border-b md:space-y-0 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-medium">Recent Transactions</h2>
          <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2">
            <div className="flex items-center p-2 bg-gray-100 rounded-md">
              <SearchIcon size={16} className="mr-2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="text-sm bg-transparent outline-none"
              />
            </div>
            <button className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md">
              <FilterIcon size={16} className="mr-2" />
              <span>Filter</span>
            </button>
            <button className="flex items-center px-4 py-2 text-white bg-amber-500 rounded-md">
              <DownloadIcon size={16} className="mr-2" />
              <span>Export</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Description</th>
                <th className="p-4">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <span className="text-sm font-medium">TRX-7829</span>
                </td>
                <td className="p-4 text-sm">Payment to Michael Davis</td>
                <td className="p-4 text-sm">2025-03-08</td>
                <td className="p-4 text-sm">$2,500</td>
                <td className="p-4 text-sm text-green-500">Completed</td>
                <td className="p-4">
                  <button className="text-blue-500">View Details</button>
                </td>
              </tr>
              {/* Add more transactions here */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinanceManagement;
