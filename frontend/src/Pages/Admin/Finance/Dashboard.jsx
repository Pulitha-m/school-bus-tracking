import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  DollarSignIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  BarChart3Icon,
  PieChartIcon,
  LineChartIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [financialData, setFinancialData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    totalSalaries: 0,
    netProfit: 0,
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [timeFilter, setTimeFilter] = useState("year");

  const COLORS = ["#0088FE", "#FF8042", "#FFBB28", "#00C49F", "#FF00FF"];

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const [incomeRes, expenseRes, salaryRes] = await Promise.all([
        axios.get("http://localhost:8080/api/stripe/getAllPayments"),
        axios.get("http://localhost:8080/api/expenses"),
        axios.get("http://localhost:8080/api/salaries/calculate"),
      ]);

      console.log("Expense sample:", expenseRes.data[0]);
      console.log("Salary sample:", salaryRes.data[0]);

      const income = incomeRes.data
        .filter((p) => p.status === "PAID")
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const expenses = expenseRes.data.reduce(
        (sum, e) => sum + parseFloat(e.amount),
        0
      );
      const salaries = salaryRes.data.reduce(
        (sum, s) => sum + parseFloat(s.totalSalary),
        0
      );
      const netProfit = income - (expenses);

      setFinancialData({
        totalIncome: income,
        totalExpenses: expenses,
        totalSalaries: salaries,
        netProfit,
      });

      const monthlyBreakdown = calculateMonthlyBreakdown(
        incomeRes.data,
        expenseRes.data,
        salaryRes.data
      );
      setMonthlyData(monthlyBreakdown);

      const categoryData = calculateCategoryBreakdown(
        expenseRes.data,
        salaryRes.data
      );
      setCategoryBreakdown(categoryData);
    } catch (err) {
      toast.error("Failed to fetch financial data");
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyBreakdown = (incomeData, expenseData, salaryData) => {
    const months = [];
    const currentDate = new Date();

    const startDate =
      timeFilter === "year"
        ? new Date(currentDate.getFullYear(), 0, 1)
        : timeFilter === "quarter"
        ? new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1)
        : new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );

    for (
      let d = new Date(startDate);
      d < endDate;
      d.setMonth(d.getMonth() + 1)
    ) {
      const targetYear = d.getFullYear();
      const targetMonth = d.getMonth();

      const income = incomeData
        .filter(
          (p) =>
            p.status === "PAID" &&
            p.paymentDate &&
            new Date(p.paymentDate).getFullYear() === targetYear &&
            new Date(p.paymentDate).getMonth() === targetMonth
        )
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);

      const expenses = expenseData
        .filter(
          (e) =>
            e.date &&
            new Date(e.date).getFullYear() === targetYear &&
            new Date(e.date).getMonth() === targetMonth
        )
        .reduce((sum, e) => sum + parseFloat(e.amount), 0);

      const salaries = salaryData
        .filter(
          (s) =>
            s.month &&
            new Date(s.month).getFullYear() === targetYear &&
            new Date(s.month).getMonth() === targetMonth
        )
        .reduce((sum, s) => sum + parseFloat(s.totalSalary), 0);

      const label = `${targetYear}-${String(targetMonth + 1).padStart(2, "0")}`;

      months.push({
        name: label,
        Income: income,
        Expenses: expenses,
        Salaries: salaries,
        TotalExpenses: expenses + salaries,
        Profit: income - (expenses + salaries),
      });
    }

    return months;
  };

  const calculateCategoryBreakdown = (expenseData, salaryData) => {
    const categories = ["MAINTENANCE", "FUEL_COST", "OTHER", "SALARIES"];
    const breakdown = categories.map((category) => ({
      name: category,
      value:
        category === "SALARIES"
          ? salaryData.reduce((sum, s) => sum + parseFloat(s.totalSalary), 0)
          : expenseData
              .filter((e) => e.category === category)
              .reduce((sum, e) => sum + parseFloat(e.amount), 0),
    }));
    return breakdown.filter((cat) => cat.value > 0);
  };

  useEffect(() => {
    fetchFinancialData();
  }, [timeFilter]);

  const generateFinancialStatement = async () => {
    const doc = new jsPDF("landscape");
    let currentY = 10;
    const currentDate = new Date().toLocaleDateString();
  
    try {
      const logoUrl = "/logost.png"; // Replace with your actual logo path
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
  
    const title = `Financial Statement for ${timeFilter === "year"
      ? new Date().getFullYear()
      : timeFilter === "quarter"
      ? `Q${Math.floor(new Date().getMonth() / 3) + 1} ${new Date().getFullYear()}`
      : new Date().toLocaleString("default", { month: "long" }) + " " + new Date().getFullYear()
      }`;
    
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
  
    // Summary table
    autoTable(doc, {
      startY: currentY,
      head: [["Financial Metric", "Amount (LKR)"]],
      body: [
        ["Total Income", financialData.totalIncome.toFixed(2)],
        ["Total Expenses", financialData.totalExpenses.toFixed(2)],
        ["Total Salaries", financialData.totalSalaries.toFixed(2)],
        [
          "Net Profit",
          {
            content: financialData.netProfit.toFixed(2),
            styles: {
              textColor: financialData.netProfit >= 0 ? [0, 128, 0] : [255, 0, 0],
            },
          },
        ],
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
      columnStyles: {
        1: { halign: "right" },
      },
    });
  
    currentY = doc.lastAutoTable.finalY + 10;
  
    // Monthly data table
    autoTable(doc, {
      startY: currentY,
      head: [["Month", "Income", "Expenses", "Salaries", "Total Expenses", "Profit"]],
      body: monthlyData.map((month) => [
        month.name,
        month.Income.toFixed(2),
        month.Expenses.toFixed(2),
        month.Salaries.toFixed(2),
        month.TotalExpenses.toFixed(2),
        {
          content: month.Profit.toFixed(2),
          styles: {
            textColor: month.Profit >= 0 ? [0, 128, 0] : [255, 0, 0],
          },
        },
      ]),
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2,
        halign: "center",
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        1: { halign: "right" },
        2: { halign: "right" },
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right" },
      },
    });
  
    currentY = doc.lastAutoTable.finalY + 10;
  
    // Expense breakdown table
    autoTable(doc, {
      startY: currentY,
      head: [["Expense Category", "Amount (LKR)"]],
      body: categoryBreakdown.map((cat) => [
        cat.name,
        cat.value.toFixed(2),
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
      columnStyles: {
        1: { halign: "right" },
      },
    });
  
    doc.save(`Financial_Statement_${timeFilter}_${new Date().getFullYear()}.pdf`);
    toast.success("Financial statement generated and downloaded");
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Financial Dashboard
        </h1>
        <p className="text-gray-600">Comprehensive financial overview</p>
      </div>

      <div className="flex gap-4">
        {["month", "quarter", "year"].map((filter) => (
          <button
            key={filter}
            onClick={() => setTimeFilter(filter)}
            className={`px-4 py-2 rounded ${
              timeFilter === filter ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
        <button
          onClick={generateFinancialStatement}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Download Statement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm">Total Income</p>
              <h3 className="text-2xl font-bold text-blue-700">
                LKR {financialData.totalIncome.toFixed(2)}
              </h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUpIcon className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm">Total Expenses</p>
              <h3 className="text-2xl font-bold text-red-700">
                LKR {financialData.totalExpenses.toFixed(2)}
              </h3>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <TrendingDownIcon className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm">Total Salaries</p>
              <h3 className="text-2xl font-bold text-yellow-700">
                LKR {financialData.totalSalaries.toFixed(2)}
              </h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <DollarSignIcon className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm">Net Profit</p>
              <h3 className="text-2xl font-bold text-green-700">
                LKR {financialData.netProfit.toFixed(2)}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <BarChart3Icon className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Monthly Financial Performance
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Income" fill="#0088FE" name="Income" />
              <Bar dataKey="Expenses" fill="#FF8042" name="Total Expenses" />
              <Bar dataKey="Profit" fill="#00C49F" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Expense Category Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryBreakdown.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Monthly Revenue Trends
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Income"
                stroke="#0088FE"
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="Expenses"
                stroke="#FF8042"
                name="Expenses"
              />
              <Line
                type="monotone"
                dataKey="Salaries"
                stroke="#FFBB28"
                name="Salaries"
              />
              <Line
                type="monotone"
                dataKey="Profit"
                stroke="#00C49F"
                name="Profit"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Income vs Expense Comparison
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="Income"
                stackId="1"
                stroke="#0088FE"
                fill="#0088FE"
                name="Income"
              />
              <Area
                type="monotone"
                dataKey="Expenses"
                stackId="1"
                stroke="#FF8042"
                fill="#FF8042"
                name="Expenses"
              />
              <Area
                type="monotone"
                dataKey="Salaries"
                stackId="1"
                stroke="#FFBB28"
                fill="#FFBB28"
                name="Salaries"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
          Financial Statement Preview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-medium text-blue-600 mb-2">Revenue</p>
            <p className="flex justify-between">
              <span>Total Income:</span>
              <span className="font-bold text-blue-700">
                LKR {financialData.totalIncome.toFixed(2)}
              </span>
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-medium text-red-600 mb-2">Expenses</p>
            <p className="flex justify-between">
              <span>Total Operating Expenses:</span>
              <span className="font-bold text-red-700">
                LKR {financialData.totalExpenses.toFixed(2)}
              </span>
            </p>
            <ul className="mt-2 space-y-1">
              {categoryBreakdown.map((cat) => (
                <li key={cat.name} className="flex justify-between">
                  <span>{cat.name}:</span>
                  <span className="font-bold text-gray-800">
                    LKR {cat.value.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-medium text-yellow-600 mb-2">Salaries</p>
            <p className="flex justify-between">
              <span>Total Salaries:</span>
              <span className="font-bold text-yellow-700">
                LKR {financialData.totalSalaries.toFixed(2)}
              </span>
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-medium text-green-600 mb-2">Profitability</p>
            <p className="flex justify-between">
              <span>Net Profit:</span>
              <span
                className={`font-bold ${
                  financialData.netProfit >= 0
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                LKR {financialData.netProfit.toFixed(2)}
              </span>
            </p>
            <p className="flex justify-between">
              <span>Profit Margin:</span>
              <span
                className={`font-bold ${
                  (financialData.netProfit / financialData.totalIncome) * 100 >=
                  0
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {(
                  (financialData.netProfit / financialData.totalIncome) * 100 ||
                  0
                ).toFixed(2)}
                %
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
