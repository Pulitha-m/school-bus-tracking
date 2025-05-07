import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Trash2Icon,
  Edit2Icon,
  PlusIcon,
  DollarSignIcon,
  XIcon,
  SaveIcon,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [analytics, setAnalytics] = useState({
    total: 0,
    maintenance: 0,
    fuelCost: 0,
    other: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpense, setCurrentExpense] = useState({
    id: null,
    description: "",
    amount: "",
    date: "",
    category: "MAINTENANCE",
  });
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState(null);

  const expenseCategories = ["MAINTENANCE", "FUEL_COST", "OTHER"];

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/api/expenses");
      setExpenses(res.data);
      calculateAnalytics(res.data);
    } catch (err) {
      toast.error("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalAmount = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/expenses/total");
      setTotalAmount(res.data);
    } catch (err) {
      toast.error("Failed to fetch total amount");
    }
  };

  const calculateAnalytics = (data) => {
    const total = data.reduce(
      (sum, expense) => sum + parseFloat(expense.amount),
      0
    );
    const maintenance = data
      .filter((expense) => expense.category === "MAINTENANCE")
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const fuelCost = data
      .filter((expense) => expense.category === "FUEL_COST")
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const other = data
      .filter((expense) => expense.category === "OTHER")
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    setAnalytics({ total, maintenance, fuelCost, other });
  };

  useEffect(() => {
    fetchExpenses();
    fetchTotalAmount();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentExpense({
      id: null,
      description: "",
      amount: "",
      date: "",
      category: "MAINTENANCE",
    });
    setShowModal(true);
  };

  const openEditModal = (expense) => {
    setIsEditing(true);
    setCurrentExpense({
      id: expense.id,
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentExpense((prev) => ({ ...prev, [name]: value }));
  };

  const saveExpense = async () => {
    try {
      setLoading(true);
      const payload = {
        description: currentExpense.description,
        amount: parseFloat(currentExpense.amount),
        date: currentExpense.date,
        category: currentExpense.category,
      };

      if (isEditing) {
        await axios.put(
          `http://localhost:8080/api/expenses/${currentExpense.id}`,
          payload
        );
        toast.success("Expense updated successfully");
      } else {
        await axios.post("http://localhost:8080/api/expenses", payload);
        toast.success("Expense added successfully");
      }
      fetchExpenses();
      fetchTotalAmount();
      setShowModal(false);
    } catch (err) {
      toast.error(
        isEditing ? "Failed to update expense" : "Failed to add expense"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8080/api/expenses/${id}`);
      toast.success("Expense deleted successfully");
      fetchExpenses();
      fetchTotalAmount();
    } catch (err) {
      toast.error("Failed to delete expense");
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
  
    const title = `Expense Report for ${currentDate} - Category: ${filterCategory === "all" ? "All" : filterCategory}`;
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
  
    const filteredExpenses = expenses.filter((e) => {
      const matchesCategory =
        filterCategory === "all" || e.category === filterCategory;
      const matchesSearch =
        searchQuery === "" ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.amount.toString().includes(searchQuery) ||
        e.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDate =
        !filterDate ||
        new Date(e.date).toISOString().split("T")[0] ===
          filterDate.toISOString().split("T")[0];
      return matchesCategory && matchesSearch && matchesDate;
    });
  
    autoTable(doc, {
      startY: currentY,
      head: [["Description", "Amount (LKR)", "Date", "Category"]],
      body: filteredExpenses.map((e) => [
        e.description || "N/A",
        e.amount || "N/A",
        e.date || "N/A",
        e.category || "N/A",
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
  
    doc.save(`Expense_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success("Report generated and downloaded");
  };

  const filteredExpenses = expenses.filter((e) => {
    const matchesCategory =
      filterCategory === "all" || e.category === filterCategory;
    const matchesSearch =
      searchQuery === "" ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.amount.toString().includes(searchQuery) ||
      e.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate =
      !filterDate ||
      new Date(e.date).toISOString().split("T")[0] ===
        filterDate.toISOString().split("T")[0];
    return matchesCategory && matchesSearch && matchesDate;
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Expense Management</h1>
        <p className="text-gray-600">Manage and track all expenses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm">Total Expenses</p>
              <h3 className="text-2xl font-bold text-blue-700">
                Rs {analytics.total.toFixed(2)}
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
              <p className="text-green-600 text-sm">Maintenance</p>
              <h3 className="text-2xl font-bold text-green-700">
                Rs {analytics.maintenance.toFixed(2)}
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
              <p className="text-yellow-600 text-sm">Fuel Cost</p>
              <h3 className="text-2xl font-bold text-yellow-700">
                Rs {analytics.fuelCost.toFixed(2)}
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
              <p className="text-red-600 text-sm">Other</p>
              <h3 className="text-2xl font-bold text-red-700">
                Rs {analytics.other.toFixed(2)}
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
            <h2 className="font-medium text-gray-800">
              Total Expenses: Rs {totalAmount}
            </h2>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="all">All</option>
              {expenseCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
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
              placeholderText="Select Date"
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
            onClick={openAddModal}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add Expense
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount (LKR)
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {expense.description}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {expense.amount}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {expense.date}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {expense.category}
                  </td>
                  <td className="px-4 py-2 text-sm flex gap-2">
                    <button
                      onClick={() => openEditModal(expense)}
                      className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                      <Edit2Icon className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                      <Trash2Icon className="w-4 h-4" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-4 text-sm text-gray-500"
                  >
                    No expenses available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              {isEditing ? "Edit Expense" : "Add Expense"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={currentExpense.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amount (LKR)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={currentExpense.amount}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={currentExpense.date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  value={currentExpense.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {expenseCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <XIcon size={16} />
                Cancel
              </button>
              <button
                onClick={saveExpense}
                disabled={loading}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <SaveIcon size={16} />
                {loading ? "Saving..." : isEditing ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseManagement;
