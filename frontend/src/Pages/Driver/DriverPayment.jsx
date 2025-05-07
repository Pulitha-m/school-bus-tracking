import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DollarSignIcon, FileTextIcon, EyeIcon } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
 Dialog,
 DialogPanel,
 DialogTitle,
 Transition,
} from "@headlessui/react";
import backendUrl from "../../config/config";

const DriverPayment = () => {
 const [salaries, setSalaries] = useState([]);
 const [loading, setLoading] = useState(false);
 const [showSlipModal, setShowSlipModal] = useState(false);
 const [selectedSlip, setSelectedSlip] = useState(null);
 const [username, setUsername] = useState("");

 // Fetch session username and salaries
 useEffect(() => {
  const sessionData = sessionStorage.getItem("user");
  if (!sessionData) {
   toast.error("No user session found");
   return;
  }

  const { username } = JSON.parse(sessionData);
  setUsername(username);

  const fetchSalaries = async () => {
   try {
    setLoading(true);
    const res = await axios.get(`${backendUrl}/api/salaries/getAll`, {
     withCredentials: true,
    });
    // Filter salaries by username
    const filteredSalaries = res.data.filter(
     (salary) => salary.username === username
    );
    setSalaries(filteredSalaries);
   } catch (err) {
    console.error("Error fetching salaries:", err);
    toast.error("Failed to fetch salaries");
   } finally {
    setLoading(false);
   }
  };

  fetchSalaries();
 }, []);

 // Open salary slip modal
 const openSlipModal = (base64) => {
  setSelectedSlip(base64);
  setShowSlipModal(true);
 };

 // Generate PDF slip
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

 return (
  <div className="container mx-auto p-4 space-y-6">
   <ToastContainer />
   <div>
    <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
    <p className="text-gray-600">View your salary details</p>
   </div>

   {/* Summary Cards */}
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
   </div>

   {/* Salaries Table */}
   <div className="bg-white rounded-lg shadow">
    <div className="p-4 border-b">
     <h2 className="font-medium text-gray-800">Your Salaries</h2>
    </div>
    <div className="overflow-x-auto">
     <table className="w-full">
      <thead>
       <tr className="bg-gray-50">
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
       {loading ? (
        <tr>
         <td
          colSpan="9"
          className="text-center py-4 text-sm text-gray-500"
         >
          Loading...
         </td>
        </tr>
       ) : salaries.length === 0 ? (
        <tr>
         <td
          colSpan="9"
          className="text-center py-4 text-sm text-gray-500"
         >
          No salaries found
         </td>
        </tr>
       ) : (
        salaries.map((salary) => (
         <tr
          key={`${salary.driverId}-${salary.month}`}
          className="hover:bg-gray-50"
         >
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
           {salary.status}
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
            <span className="text-gray-400 italic">
             Not Uploaded
            </span>
           )}
          </td>
          <td className="px-4 py-2 text-sm">
           <button
            onClick={() => handleGenerateSlip(salary)}
            className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
           >
            <FileTextIcon className="w-4 h-4" />
            Generate Slip
           </button>
          </td>
         </tr>
        ))
       )}
      </tbody>
     </table>

     {/* Salary Slip Modal */}
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
  </div>
 );
};

export default DriverPayment;

