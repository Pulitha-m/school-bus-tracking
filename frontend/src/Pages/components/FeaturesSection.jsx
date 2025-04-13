import React from "react";
import {
  MapPinIcon,
  BarChart3Icon,
  UserCheckIcon,
  UsersIcon,
  TruckIcon,
  CreditCardIcon,
} from "lucide-react";
export const FeaturesSection = () => {
  // Theme color is blue for the 10% requirement
  const themeColor = "#1a56db";
  const features = [
    {
      icon: <MapPinIcon size={32} className="text-yellow-400" />,
      title: "Live Tracking",
      description:
        "Monitor bus location in real-time with GPS precision for peace of mind.",
    },
    {
      icon: <BarChart3Icon size={32} className="text-yellow-400" />,
      title: "Route Optimization",
      description:
        "Efficient routes to reduce waiting times and fuel consumption.",
    },
    {
      icon: <UserCheckIcon size={32} className="text-yellow-400" />,
      title: "Student Attendance",
      description: "QR-based smart check-ins for accurate attendance tracking.",
    },
    {
      icon: <TruckIcon size={32} className="text-yellow-400" />,
      title: "Driver Management",
      description:
        "Manage vehicles and drivers effortlessly with comprehensive tools.",
    },
    {
      icon: <UsersIcon size={32} className="text-yellow-400" />,
      title: "Parent Portal",
      description:
        "Real-time bus tracking for guardians to know exactly when to expect their children.",
    },
    {
      icon: <CreditCardIcon size={32} className="text-yellow-400" />,
      title: "Payment System",
      description:
        "Distance-based automated billing for transparent financial management.",
    },
  ];
  return (
    <section className="py-16 bg-white" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
          <div className="h-1 w-24 bg-yellow-400 mx-auto"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            Our comprehensive system offers everything you need to manage your
            school bus fleet efficiently and safely.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg transition-all hover:shadow-lg border border-gray-100"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
              <div
                className="mt-4 h-1 w-12"
                style={{
                  backgroundColor: themeColor,
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
