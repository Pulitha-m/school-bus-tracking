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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function IncomeManagement() {
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalIncome: 0,
    paid: 0,
    pendingApproval: 0,
    unpaid: 0,
  });

  const fetchPayments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/stripe/getAllPayments"
      );
      setPayments(res.data);
      calculateAnalytics(res.data);
    } catch (err) {
      toast.error("Failed to fetch payments");
    }
  };

  const calculateAnalytics = (data) => {
    const totalIncome = data.reduce(
      (sum, payment) => sum + parseFloat(payment.amount),
      0
    );
    const paid = data
      .filter((payment) => payment.status === "PAID")
      .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
    const pendingApproval = data
      .filter((payment) => payment.status === "PENDING_APPROVAL")
      .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
    const unpaid = data
      .filter((payment) => payment.status === "UNPAID")
      .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

    setAnalytics({ totalIncome, paid, pendingApproval, unpaid });
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

  const generateReport = async () => {
    const doc = new jsPDF("landscape");
    let currentY = 10;
    const currentDate = new Date().toLocaleDateString();
  
    try {
      const logoUrl = "/logost.png";
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = logoUrl;
  
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
  
      const imgWidth = 50;
      const imgHeight = (img.height * imgWidth) / img.width;
      const pageWidth = doc.internal.pageSize.getWidth();
      const logoX = (pageWidth - imgWidth) / 2;
  
      doc.addImage(img, "PNG", logoX, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 10;
    } catch (error) {
      console.warn("Logo could not be loaded:", error);
      currentY += 10;
    }
  
    const title = `Payment Report for ${currentDate} - Status: ${filterStatus === "all" ? "All" : filterStatus}`;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const titleWidth = doc.getTextWidth(title);
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text(title, (pageWidth - titleWidth) / 2, currentY);
    currentY += 10;
  
    const generatedDate = `Generated on: ${currentDate}`;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const dateWidth = doc.getTextWidth(generatedDate);
    doc.text(generatedDate, (pageWidth - dateWidth) / 2, currentY);
    currentY += 15;
  
    const filteredPayments = payments.filter((p) => {
      const matchesStatus = filterStatus === "all" || p.status === filterStatus;
      const matchesSearch =
        searchQuery === "" ||
        p.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.amount.toString().includes(searchQuery) ||
        p.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.paymentDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.nextDueDate &&
          p.nextDueDate.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDate =
        !filterDate ||
        new Date(p.paymentDate).toISOString().split("T")[0] ===
          filterDate.toISOString().split("T")[0];
      return matchesStatus && matchesSearch && matchesDate;
    });
  
    autoTable(doc, {
      startY: currentY,
      head: [
        [
          "Student Email",
          "Amount (LKR)",
          "Method",
          "Status",
          "Payment Date",
          "Next Due",
          "Slip Image",
        ],
      ],
      body: filteredPayments.map((p) => [
        p.studentEmail,
        p.amount,
        p.method,
        p.status,
        p.paymentDate,
        p.nextDueDate || "N/A",
        p.slipImage ? "Available" : "N/A",
      ]),
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 3,
        halign: "center",
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: "bold",
      },
    });
  
    doc.save(`Payment_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success("Report generated and downloaded");
  };

  const filteredPayments = payments.filter((p) => {
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    const matchesSearch =
      searchQuery === "" ||
      p.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.amount.toString().includes(searchQuery) ||
      p.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.paymentDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.nextDueDate &&
        p.nextDueDate.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDate =
      !filterDate ||
      new Date(p.paymentDate).toISOString().split("T")[0] ===
        filterDate.toISOString().split("T")[0];
    return matchesStatus && matchesSearch && matchesDate;
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Finance Management</h1>
        <p className="text-gray-600">
          Comprehensive financial overview and management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm">Total Income</p>
              <h3 className="text-2xl font-bold text-blue-700">
                Rs {analytics.totalIncome.toFixed(2)}
              </h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSignIcon className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm">Paid</p>
              <h3 className="text-2xl font-bold text-green-700">
                Rs {analytics.paid.toFixed(2)}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUpIcon className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm">Pending Approval</p>
              <h3 className="text-2xl font-bold text-yellow-700">
                Rs {analytics.pendingApproval.toFixed(2)}
              </h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <BarChart3Icon className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm">Unpaid</p>
              <h3 className="text-2xl font-bold text-red-700">
                Rs {analytics.unpaid.toFixed(2)}
              </h3>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <TrendingDownIcon className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex space-x-4">
            <h2 className="font-medium text-gray-800">All Payments</h2>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="all">All</option>
              <option value="PAID">Paid</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="UNPAID">Unpaid</option>
            </select>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded px-2 py-1"
            />
            <DatePicker
              selected={filterDate}
              onChange={(date) => setFilterDate(date)}
              placeholderText="Select Payment Date"
              className="border rounded px-2 py-1"
              dateFormat="yyyy-MM-dd"
              isClearable
            />
            <button
              onClick={generateReport}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Generate Report
            </button>
          </div>
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
              {filteredPayments.map((p) => (
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
              {filteredPayments.length === 0 && (
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
