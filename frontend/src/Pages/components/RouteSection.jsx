import React from "react";
import { MapIcon, ClockIcon, UsersIcon } from "lucide-react";
import { Link } from "react-router-dom";
export const RoutesSection = () => {
  const routes = [
    {
      name: "North District Route",
      timing: "7:30 AM - 8:15 AM",
      stops: 12,
      image:
        "https://images.unsplash.com/photo-1617650728468-8581e439c864?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "South District Route",
      timing: "7:45 AM - 8:30 AM",
      stops: 10,
      image:
        "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "East District Route",
      timing: "8:00 AM - 8:45 AM",
      stops: 8,
      image:
        "https://images.unsplash.com/photo-1596906673164-fffb05cd8591?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
  ];
  return (
    <section className="py-16 bg-gray-50" id="routes">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Popular Routes
          </h2>
          <div className="h-1 w-24 bg-yellow-400 mx-auto"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            Explore our optimized bus routes designed for maximum efficiency and
            convenience.
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
                <h3 className="text-xl font-semibold mb-3">{route.name}</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <ClockIcon size={18} className="mr-2" />
                    <span>{route.timing}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapIcon size={18} className="mr-2" />
                    <span>{route.stops} stops</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            to="/routes"
            className="inline-flex items-center bg-yellow-400 text-gray-800 px-6 py-3 rounded-md font-medium hover:bg-yellow-500 transition-colors"
          >
            View All Routes
            <UsersIcon size={18} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};
