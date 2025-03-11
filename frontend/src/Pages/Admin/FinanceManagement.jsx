import React, { useState } from "react";
import {
  DollarSignIcon,
  SearchIcon,
  FilterIcon,
  DownloadIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  BarChart3Icon,
  WalletIcon,
  ReceiptIcon,
  PieChartIcon,
} from "lucide-react";

export function FinanceManagement() {
  const [activeTab, setActiveTab] = useState("overview");

  const financialOverview = {
    totalRevenue: 24500,
    totalExpenses: 18750,
    netProfit: 5750,
    pendingPayments: 3250,
    outstandingBalance: 1800,
    pettyCash: 1000,
  };

  const monthlyTrends = {
    revenue: [19500, 21000, 23000, 24500],
    expenses: [15000, 16500, 17800, 18750],
    profit: [4500, 4500, 5200, 5750],
  };

  const expenseBreakdown = [
    {
      category: "Fuel",
      amount: 8500,
      percentage: 45,
    },
    {
      category: "Maintenance",
      amount: 4500,
      percentage: 24,
    },
    {
      category: "Staff Salary",
      amount: 3750,
      percentage: 20,
    },
    {
      category: "Others",
      amount: 2000,
      percentage: 11,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Finance Management</h1>
        <p className="text-gray-600">
          Comprehensive financial overview and management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-green-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-700">
                ${financialOverview.totalRevenue}
              </p>
              <p className="text-sm text-green-600">This Month</p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <TrendingUpIcon className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600">
            +12.5% from last month
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-red-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-700">
                ${financialOverview.totalExpenses}
              </p>
              <p className="text-sm text-red-600">This Month</p>
            </div>
            <div className="bg-red-100 p-2 rounded-full">
              <TrendingDownIcon className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <div className="mt-2 text-sm text-red-600">+5.3% from last month</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-blue-600">Net Profit</p>
              <p className="text-2xl font-bold text-blue-700">
                ${financialOverview.netProfit}
              </p>
              <p className="text-sm text-blue-600">This Month</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <BarChart3Icon className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-2 text-sm text-blue-600">
            +8.2% from last month
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex space-x-4 px-4" aria-label="Tabs">
            {["overview", "p&l", "expenses", "petty-cash"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? "border-amber-500 text-amber-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace("-", " ")}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Monthly Trends
                </h3>
                <div className="h-64 flex items-end justify-between px-2">
                  {monthlyTrends.revenue.map((revenue, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center space-y-1"
                    >
                      <div
                        className="w-12 bg-green-200 rounded-t"
                        style={{
                          height: `${(revenue / 30000) * 100}%`,
                        }}
                      ></div>
                      <span className="text-xs text-gray-600">
                        Month {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Expense Breakdown
                </h3>
                <div className="space-y-3">
                  {expenseBreakdown.map((expense) => (
                    <div key={expense.category} className="flex items-center">
                      <div className="w-32 text-sm text-gray-600">
                        {expense.category}
                      </div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500"
                            style={{
                              width: `${expense.percentage}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-24 text-right text-sm text-gray-600">
                        ${expense.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === "p&l" && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Profit & Loss Statement
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Revenue</span>
                    <span className="text-green-600">
                      ${financialOverview.totalRevenue}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Expenses</span>
                    <span className="text-red-600">
                      ${financialOverview.totalExpenses}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Net Profit</span>
                    <span className="text-blue-600">
                      ${financialOverview.netProfit}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "petty-cash" && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Petty Cash Management
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm text-gray-600">
                      Available Balance
                    </div>
                    <div className="text-2xl font-bold">
                      ${financialOverview.pettyCash}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm text-gray-600">
                      Last Replenishment
                    </div>
                    <div className="text-2xl font-bold">$500</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-medium text-gray-800">Recent Transactions</h2>
          <button className="text-sm text-blue-600">View All</button>
        </div>
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
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  2023-08-01
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Monthly Fee - Emma Johnson
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Revenue
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  +$150
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
