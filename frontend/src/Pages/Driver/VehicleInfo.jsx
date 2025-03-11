import React from "react";
import {
  TruckIcon,
  FuelIcon,
  GaugeIcon,
  CalendarIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  XCircleIcon,
  BarChart3Icon,
} from "lucide-react";

export const VehicleInfo = () => {
  const maintenanceItems = [
    {
      name: "Oil Change",
      status: "good",
      nextDate: "Dec 15, 2023",
      mileage: 5000,
    },
    {
      name: "Tire Rotation",
      status: "warning",
      nextDate: "Nov 5, 2023",
      mileage: 1200,
    },
    {
      name: "Brake Inspection",
      status: "good",
      nextDate: "Jan 20, 2024",
      mileage: 8000,
    },
    {
      name: "Air Filter",
      status: "critical",
      nextDate: "Oct 25, 2023",
      mileage: 200,
    },
    {
      name: "Fluid Check",
      status: "good",
      nextDate: "Dec 1, 2023",
      mileage: 4500,
    },
  ];

  return React.createElement(
    "div",
    null,
    React.createElement(
      "div",
      { className: "mb-6" },
      React.createElement(
        "h1",
        { className: "text-2xl font-bold text-gray-800" },
        "Vehicle Information"
      ),
      React.createElement(
        "p",
        { className: "text-gray-600" },
        "Monitor your bus health and maintenance schedule"
      )
    ),
    React.createElement(
      "div",
      { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" },
      React.createElement(
        "div",
        { className: "bg-white rounded-lg shadow p-6" },
        React.createElement(
          "div",
          { className: "flex items-center mb-4" },
          React.createElement(TruckIcon, {
            className: "h-8 w-8 text-amber-500",
          }),
          React.createElement(
            "h2",
            { className: "ml-3 text-xl font-semibold text-gray-800" },
            "Bus #42"
          )
        ),
        React.createElement(
          "div",
          { className: "grid grid-cols-2 gap-4" },
          React.createElement(
            "div",
            null,
            React.createElement(
              "p",
              { className: "text-sm text-gray-500" },
              "Make/Model"
            ),
            React.createElement(
              "p",
              { className: "font-medium" },
              "Blue Bird All American"
            )
          ),
          React.createElement(
            "div",
            null,
            React.createElement(
              "p",
              { className: "text-sm text-gray-500" },
              "Year"
            ),
            React.createElement("p", { className: "font-medium" }, "2019")
          ),
          React.createElement(
            "div",
            null,
            React.createElement(
              "p",
              { className: "text-sm text-gray-500" },
              "License Plate"
            ),
            React.createElement("p", { className: "font-medium" }, "SCH-2023")
          ),
          React.createElement(
            "div",
            null,
            React.createElement(
              "p",
              { className: "text-sm text-gray-500" },
              "VIN"
            ),
            React.createElement(
              "p",
              { className: "font-medium" },
              "1HVBBAAN5XH2..."
            )
          ),
          React.createElement(
            "div",
            null,
            React.createElement(
              "p",
              { className: "text-sm text-gray-500" },
              "Seating Capacity"
            ),
            React.createElement(
              "p",
              { className: "font-medium" },
              "42 students"
            )
          ),
          React.createElement(
            "div",
            null,
            React.createElement(
              "p",
              { className: "text-sm text-gray-500" },
              "Last Inspection"
            ),
            React.createElement(
              "p",
              { className: "font-medium" },
              "Oct 1, 2023"
            )
          )
        )
      ),
      React.createElement(
        "div",
        { className: "bg-white rounded-lg shadow" },
        React.createElement(
          "div",
          { className: "p-6 border-b" },
          React.createElement(
            "h2",
            {
              className:
                "text-lg font-semibold text-gray-800 flex items-center",
            },
            React.createElement(GaugeIcon, {
              className: "mr-2 h-5 w-5 text-amber-500",
            }),
            "Current Status"
          )
        ),
        React.createElement(
          "div",
          { className: "p-6 grid grid-cols-2 gap-6" },
          React.createElement(
            "div",
            { className: "flex items-center" },
            React.createElement(
              "div",
              {
                className:
                  "h-12 w-12 rounded-full bg-green-100 flex items-center justify-center",
              },
              React.createElement(FuelIcon, {
                className: "h-6 w-6 text-green-600",
              })
            ),
            React.createElement(
              "div",
              { className: "ml-4" },
              React.createElement(
                "p",
                { className: "text-sm text-gray-500" },
                "Fuel Level"
              ),
              React.createElement(
                "p",
                { className: "text-lg font-semibold text-green-600" },
                "85%"
              )
            )
          ),
          React.createElement(
            "div",
            { className: "flex items-center" },
            React.createElement(
              "div",
              {
                className:
                  "h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center",
              },
              React.createElement(GaugeIcon, {
                className: "h-6 w-6 text-blue-600",
              })
            ),
            React.createElement(
              "div",
              { className: "ml-4" },
              React.createElement(
                "p",
                { className: "text-sm text-gray-500" },
                "Odometer"
              ),
              React.createElement(
                "p",
                { className: "text-lg font-semibold" },
                "45,782 mi"
              )
            )
          ),
          React.createElement(
            "div",
            { className: "flex items-center" },
            React.createElement(
              "div",
              {
                className:
                  "h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center",
              },
              React.createElement(AlertTriangleIcon, {
                className: "h-6 w-6 text-yellow-600",
              })
            ),
            React.createElement(
              "div",
              { className: "ml-4" },
              React.createElement(
                "p",
                { className: "text-sm text-gray-500" },
                "Alerts"
              ),
              React.createElement(
                "p",
                { className: "text-lg font-semibold text-yellow-600" },
                "2 warnings"
              )
            )
          ),
          React.createElement(
            "div",
            { className: "flex items-center" },
            React.createElement(
              "div",
              {
                className:
                  "h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center",
              },
              React.createElement(CalendarIcon, {
                className: "h-6 w-6 text-purple-600",
              })
            ),
            React.createElement(
              "div",
              { className: "ml-4" },
              React.createElement(
                "p",
                { className: "text-sm text-gray-500" },
                "Next Service"
              ),
              React.createElement(
                "p",
                { className: "text-lg font-semibold" },
                "Oct 25, 2023"
              )
            )
          )
        )
      )
    ),
    React.createElement(
      "div",
      { className: "bg-white rounded-lg shadow mb-6" },
      React.createElement(
        "div",
        { className: "p-4 border-b" },
        React.createElement(
          "h2",
          {
            className: "text-lg font-semibold text-gray-800 flex items-center",
          },
          React.createElement(BarChart3Icon, {
            className: "mr-2 h-5 w-5 text-amber-500",
          }),
          "Maintenance Schedule"
        )
      ),
      React.createElement(
        "div",
        { className: "overflow-x-auto" },
        React.createElement(
          "table",
          { className: "min-w-full divide-y divide-gray-200" },
          React.createElement(
            "thead",
            { className: "bg-gray-50" },
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                {
                  scope: "col",
                  className:
                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                },
                "Item"
              ),
              React.createElement(
                "th",
                {
                  scope: "col",
                  className:
                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                },
                "Status"
              ),
              React.createElement(
                "th",
                {
                  scope: "col",
                  className:
                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                },
                "Next Service"
              ),
              React.createElement(
                "th",
                {
                  scope: "col",
                  className:
                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                },
                "Miles Remaining"
              )
            )
          ),
          React.createElement(
            "tbody",
            { className: "bg-white divide-y divide-gray-200" },
            maintenanceItems.map(function (item, index) {
              return React.createElement(
                "tr",
                { key: index },
                React.createElement(
                  "td",
                  {
                    className:
                      "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900",
                  },
                  item.name
                ),
                React.createElement(
                  "td",
                  { className: "px-6 py-4 whitespace-nowrap" },
                  item.status === "good" &&
                    React.createElement(
                      "span",
                      {
                        className:
                          "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800",
                      },
                      React.createElement(CheckCircle2Icon, {
                        size: 16,
                        className: "mr-1",
                      }),
                      "Good"
                    ),
                  item.status === "warning" &&
                    React.createElement(
                      "span",
                      {
                        className:
                          "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800",
                      },
                      React.createElement(AlertTriangleIcon, {
                        size: 16,
                        className: "mr-1",
                      }),
                      "Due Soon"
                    ),
                  item.status === "critical" &&
                    React.createElement(
                      "span",
                      {
                        className:
                          "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800",
                      },
                      React.createElement(XCircleIcon, {
                        size: 16,
                        className: "mr-1",
                      }),
                      "Overdue"
                    )
                ),
                React.createElement(
                  "td",
                  {
                    className:
                      "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                  },
                  item.nextDate
                ),
                React.createElement(
                  "td",
                  {
                    className:
                      "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                  },
                  item.mileage + " miles"
                )
              );
            })
          )
        )
      )
    ),
    React.createElement(
      "div",
      { className: "bg-white rounded-lg shadow" },
      React.createElement(
        "div",
        { className: "p-4 border-b" },
        React.createElement(
          "h2",
          { className: "text-lg font-semibold text-gray-800" },
          "Report an Issue"
        )
      ),
      React.createElement(
        "div",
        { className: "p-6" },
        React.createElement(
          "div",
          { className: "mb-4" },
          React.createElement(
            "label",
            {
              htmlFor: "issue-type",
              className: "block text-sm font-medium text-gray-700 mb-1",
            },
            "Issue Type"
          ),
          React.createElement(
            "select",
            {
              id: "issue-type",
              name: "issue-type",
              className: "block w-full p-2 border border-gray-300 rounded-md",
            },
            React.createElement(
              "option",
              { value: "Maintenance" },
              "Maintenance"
            ),
            React.createElement("option", { value: "Safety" }, "Safety"),
            React.createElement("option", { value: "Other" }, "Other")
          )
        ),
        React.createElement(
          "div",
          { className: "mb-4" },
          React.createElement(
            "label",
            {
              htmlFor: "description",
              className: "block text-sm font-medium text-gray-700 mb-1",
            },
            "Description"
          ),
          React.createElement("textarea", {
            id: "description",
            name: "description",
            className: "block w-full p-2 border border-gray-300 rounded-md",
            rows: 4,
          })
        ),
        React.createElement(
          "div",
          { className: "flex justify-end" },
          React.createElement(
            "button",
            {
              className:
                "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
            },
            "Submit"
          )
        )
      )
    )
  );
};
