import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  DollarSignIcon,
  UploadIcon,
  XIcon,
  SaveIcon,
  FileTextIcon,
  EyeIcon,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SalaryManagement = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [slipFile, setSlipFile] = useState(null);
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMonth, setFilterMonth] = useState(null);

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:8080/api/salaries/calculate"
      );
      console.log("Fetched salaries:", res.data);
      setSalaries(res.data);
    } catch (err) {
      console.error("Error fetching salaries:", err);
      toast.error("Failed to fetch salaries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  const openSlipModal = (base64) => {
    setSelectedSlip(base64);
    setShowSlipModal(true);
  };

  const handleUploadClick = (driverId) => {
    setSelectedDriverId(driverId);
    setSelectedMonth(new Date().toISOString().slice(0, 7));
    setShowUploadModal(true);
  };

  const handleFileChange = (e) => {
    setSlipFile(e.target.files[0]);
  };

  const handleUploadSubmit = async () => {
    if (!slipFile || !selectedMonth) {
      toast.error("Please select a file and month");
      return;
    }

    const formData = new FormData();
    formData.append("driverId", selectedDriverId);
    formData.append("month", selectedMonth);
    formData.append("slip", slipFile);

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:8080/api/salaries/upload-slip",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Salary slip uploaded successfully");
      setShowUploadModal(false);
      fetchSalaries();
    } catch (err) {
      console.error("Error uploading slip:", err);
      toast.error("Failed to upload salary slip");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSlip = async (salary) => {
    try {
      console.log("Generating slip for:", salary);
  
      if (
        !salary ||
        !salary.driverId ||
        !salary.username ||
        !salary.month ||
        salary.basicSalary == null ||
        salary.overtimePay == null ||
        salary.epf == null ||
        salary.etf == null ||
        salary.totalSalary == null
      ) {
        throw new Error("Invalid or incomplete salary data");
      }
  
      const doc = new jsPDF();
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
  
      const title = `Salary Slip for ${salary.username} - ${salary.month.toString().slice(0, 7)}`;
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
  
      autoTable(doc, {
        startY: currentY,
        head: [["Description", "Amount (LKR)"]],
        body: [
          ["Basic Salary", salary.basicSalary.toFixed(2)],
          ["Overtime Pay", salary.overtimePay.toFixed(2)],
          ["EPF (8% Employee + 12% Employer)", salary.epf.toFixed(2)],
          ["ETF (3% Employer)", salary.etf.toFixed(2)],
          ["Net Salary", salary.totalSalary.toFixed(2)],
        ],
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
  
      const fileName = `Salary_Slip_${salary.driverId}_${salary.month.toString().slice(0, 7)}.pdf`;
      doc.save(fileName);
  
      toast.success("Salary slip generated successfully");
    } catch (err) {
      console.error("Error generating salary slip:", err);
      toast.error(`Failed to generate salary slip: ${err.message}`);
    }
  };

  const handleUpdateStatus = async (driverId, month, status) => {
    try {
      setLoading(true);
      console.log("Sending status update:", { driverId, month, status });
      const response = await axios.put(
        "http://localhost:8080/api/salaries/update-status",
        null,
        {
          params: { driverId, month, status },
        }
      );
      console.log("Status update response:", response.data);
      toast.success("Payment status updated");
      fetchSalaries();
    } catch (err) {
      console.error("Error updating status:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      toast.error(
        `Failed to update payment status: ${err.response?.data || err.message}`
      );
    } finally {
      setLoading(false);
    }
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
  
    const filteredSalaries = salaries.filter((s) => {
      const matchesStatus = filterStatus === "all" || s.status === filterStatus;
      const matchesSearch =
        searchQuery === "" ||
        s.driverId.toString().includes(searchQuery) ||
        s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.month.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.basicSalary.toString().includes(searchQuery) ||
        s.overtimePay.toString().includes(searchQuery) ||
        s.epf.toString().includes(searchQuery) ||
        s.etf.toString().includes(searchQuery) ||
        s.totalSalary.toString().includes(searchQuery) ||
        s.status.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMonth =
        !filterMonth ||
        s.month.toString().slice(0, 7) === filterMonth.toISOString().slice(0, 7);
      return matchesStatus && matchesSearch && matchesMonth;
    });
  
    const title = `Salary Report - ${currentDate}`;
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
    currentY += 10;
  
    const filterText = `Filters: Status - ${filterStatus === "all" ? "All" : filterStatus}, Month - ${
      filterMonth ? filterMonth.toISOString().slice(0, 7) : "All"
    }, Search - ${searchQuery || "None"}`;
    doc.setFontSize(10);
    doc.text(filterText, 14, currentY);
    currentY += 15;
  
    autoTable(doc, {
      startY: currentY,
      head: [
        [
          "Driver ID",
          "Username",
          "Month",
          "Basic Salary (LKR)",
          "Overtime Pay (LKR)",
          "EPF (LKR)",
          "ETF (LKR)",
          "Net Salary (LKR)",
          "Status",
          "Salary Slip",
        ],
      ],
      body: filteredSalaries.map((s) => [
        s.driverId,
        s.username,
        s.month.toString().slice(0, 7),
        s.basicSalary.toFixed(2),
        s.overtimePay.toFixed(2),
        s.epf.toFixed(2),
        s.etf.toFixed(2),
        s.totalSalary.toFixed(2),
        s.status,
        s.slipImage ? "Available" : "Not Uploaded",
      ]),
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 2,
        halign: "center",
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: "bold",
      },
    });
  
    doc.save(`Salary_Report_${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("Report generated and downloaded");
  };

  const filteredSalaries = salaries.filter((s) => {
    const matchesStatus = filterStatus === "all" || s.status === filterStatus;
    const matchesSearch =
      searchQuery === "" ||
      s.driverId.toString().includes(searchQuery) ||
      s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.month.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.basicSalary.toString().includes(searchQuery) ||
      s.overtimePay.toString().includes(searchQuery) ||
      s.epf.toString().includes(searchQuery) ||
      s.etf.toString().includes(searchQuery) ||
      s.totalSalary.toString().includes(searchQuery) ||
      s.status.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMonth =
      !filterMonth ||
      s.month.toString().slice(0, 7) === filterMonth.toISOString().slice(0, 7);
    return matchesStatus && matchesSearch && matchesMonth;
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Salary Management</h1>
        <p className="text-gray-600">Manage and track driver salaries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm">Total Salaries</p>
              <h3 className="text-2xl font-bold text-blue-700">
                Rs{" "}
                {salaries.reduce((sum, s) => sum + s.totalSalary, 0).toFixed(2)}
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
              <p className="text-green-600 text-sm">Basic Salaries</p>
              <h3 className="text-2xl font-bold text-green-700">
                Rs{" "}
                {salaries.reduce((sum, s) => sum + s.basicSalary, 0).toFixed(2)}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSignIcon className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm">Overtime Pay</p>
              <h3 className="text-2xl font-bold text-yellow-700">
                Rs{" "}
                {salaries.reduce((sum, s) => sum + s.overtimePay, 0).toFixed(2)}
              </h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <DollarSignIcon className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm">EPF + ETF</p>
              <h3 className="text-2xl font-bold text-red-700">
                Rs{" "}
                {salaries.reduce((sum, s) => sum + s.epf + s.etf, 0).toFixed(2)}
              </h3>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <DollarSignIcon className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex space-x-4">
            <h2 className="font-medium text-gray-800">Driver Salaries</h2>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="all">All</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="PAID">Paid</option>
            </select>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded px-2 py-1"
            />
            <DatePicker
              selected={filterMonth}
              onChange={(date) => setFilterMonth(date)}
              placeholderText="Select Month"
              className="border rounded px-2 py-1"
              dateFormat="yyyy-MM"
              showMonthYearPicker
              isClearable
            />
            <button
              onClick={generateReport}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Generate Report
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Driver ID
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Username
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Month
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Basic Salary (LKR)
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Overtime Pay (LKR)
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  EPF (LKR)
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  ETF (LKR)
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Net Salary (LKR)
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Salary Slip
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSalaries.map((salary) => (
                <tr
                  key={`${salary.driverId}-${salary.month}`}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {salary.driverId}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {salary.username}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {salary.month.toString().slice(0, 7)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {salary.basicSalary.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {salary.overtimePay.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {salary.epf.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {salary.etf.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {salary.totalSalary.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    <select
                      value={salary.status}
                      onChange={(e) =>
                        handleUpdateStatus(
                          salary.driverId,
                          salary.month.toString().slice(0, 7),
                          e.target.value
                        )
                      }
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="PAID">Paid</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {salary.slipImage ? (
                      <button onClick={() => openSlipModal(salary.slipImage)}>
                        <img
                          src={`data:image/jpeg;base64,${salary.slipImage}`}
                          alt="Slip"
                          className="w-16 h-16 object-cover border rounded hover:opacity-75"
                        />
                      </button>
                    ) : (
                      <span className="text-gray-400 italic">Not Uploaded</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm flex gap-2">
                    <button
                      onClick={() => handleUploadClick(salary.driverId)}
                      className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                      <UploadIcon className="w-4 h-4" />
                      Upload Slip
                    </button>
                    <button
                      onClick={() => handleGenerateSlip(salary)}
                      className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                      <FileTextIcon className="w-4 h-4" />
                      Generate Slip
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSalaries.length === 0 && (
                <tr>
                  <td
                    colSpan="11"
                    className="text-center py-4 text-sm text-gray-500"
                  >
                    No salaries available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

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
                        Salary Slip Preview
                      </DialogTitle>
                      <div className="mt-4">
                        <img
                          src={`data:image/jpeg;base64,${selectedSlip}`}
                          alt="Salary Slip"
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
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Upload Salary Slip
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Driver ID
                </label>
                <input
                  type="text"
                  value={selectedDriverId}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Month
                </label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Salary Slip (PNG/JPEG)
                </label>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <XIcon size={16} />
                Cancel
              </button>
              <button
                onClick={handleUploadSubmit}
                disabled={loading}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <SaveIcon size={16} />
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryManagement;
