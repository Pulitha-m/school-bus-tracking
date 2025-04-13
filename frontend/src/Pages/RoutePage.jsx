import React from "react";
import { MapIcon, ClockIcon, CalendarIcon, UsersIcon } from "lucide-react";
export const RoutesPage = () => {
  const routes = [
    {
      name: "North District Route",
      timing: "7:30 AM - 8:15 AM",
      stops: 12,
      students: 45,
      image:
        "https://images.unsplash.com/photo-1617650728468-8581e439c864?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "South District Route",
      timing: "7:45 AM - 8:30 AM",
      stops: 10,
      students: 38,
      image:
        "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "East District Route",
      timing: "8:00 AM - 8:45 AM",
      stops: 8,
      students: 32,
      image:
        "https://images.unsplash.com/photo-1596906673164-fffb05cd8591?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "West District Route",
      timing: "7:15 AM - 8:00 AM",
      stops: 15,
      students: 52,
      image:
        "https://images.unsplash.com/photo-1621955964441-c173e01c135b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
  ];
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Bus Routes</h1>
          <div className="h-1 w-24 bg-yellow-400 mx-auto"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            Explore our optimized bus routes designed for maximum efficiency and
            convenience. Each route is carefully planned to ensure timely and
            safe transportation.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {routes.map((route, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={route.image}
                  alt={route.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">{route.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <ClockIcon size={18} className="mr-2" />
                    <span>{route.timing}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapIcon size={18} className="mr-2" />
                    <span>{route.stops} stops</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <UsersIcon size={18} className="mr-2" />
                    <span>{route.students} students</span>
                  </div>
                </div>
                <button className="mt-6 w-full bg-yellow-400 text-gray-800 px-4 py-2 rounded-md font-medium hover:bg-yellow-500 transition-colors">
                  View Route Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
