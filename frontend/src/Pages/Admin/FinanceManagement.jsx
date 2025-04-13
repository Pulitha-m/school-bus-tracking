import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import {
  DollarSignIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  BarChart3Icon,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";

export function FinanceManagement() {
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/stripe/getAllPayments"
      );
      setPayments(res.data);
    } catch (err) {
      toast.error("Failed to fetch payments");
    }
  };

  const approveSlip = async (paymentId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/stripe/approve-slip/${paymentId}`
      );
      toast.success("Payment approved");
      fetchPayments();
    } catch (err) {
      toast.error("Approval failed");
    }
  };

  const markOverdueUnpaid = async () => {
    setLoading(true);
    try {
      const res = await axios.put(
        "http://localhost:8080/api/stripe/mark-unpaid-overdue"
      );
      toast.success(res.data);
      fetchPayments();
    } catch (err) {
      toast.error("Failed to update overdue payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const openSlipModal = (base64) => {
    setSelectedSlip(base64);
    setShowSlipModal(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Finance Management</h1>
        <p className="text-gray-600">
          Comprehensive financial overview and management
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-medium text-gray-800">All Payments</h2>
          <button
            onClick={markOverdueUnpaid}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Updating..." : "Mark Overdue as Unpaid"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Student Email
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount (LKR)
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Method
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Payment Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Next Due
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Slip Image
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {p.studentEmail}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {p.amount}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {p.method}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span
                      className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                        p.status === "PAID"
                          ? "bg-green-100 text-green-800"
                          : p.status === "PENDING_APPROVAL"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {p.paymentDate}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {p.nextDueDate}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {p.slipImage ? (
                      <button onClick={() => openSlipModal(p.slipImage)}>
                        <img
                          src={`data:image/jpeg;base64,${p.slipImage}`}
                          alt="Slip"
                          className="w-20 h-20 object-contain border rounded hover:opacity-75"
                        />
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {p.status === "PENDING_APPROVAL" && (
                      <button
                        onClick={() => approveSlip(p.id)}
                        className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-4 text-sm text-gray-500"
                  >
                    No payments available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Transition appear show={showSlipModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowSlipModal(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Payment Slip Preview
                  </DialogTitle>
                  <div className="mt-4">
                    <img
                      src={`data:image/jpeg;base64,${selectedSlip}`}
                      alt="Slip Preview"
                      className="w-full h-auto rounded border"
                    />
                  </div>
                  <div className="mt-4 text-right">
                    <button
                      onClick={() => setShowSlipModal(false)}
                      className="text-sm text-white bg-red-500 hover:bg-red-600 px-4 py-1 rounded"
                    >
                      Close
                    </button>
                  </div>
                </DialogPanel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
