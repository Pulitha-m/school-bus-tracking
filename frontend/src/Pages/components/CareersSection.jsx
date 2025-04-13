import React from "react";
import {
  BriefcaseIcon,
  GraduationCapIcon,
  HeartIcon,
  TruckIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

export const CareersSection = () => {
  const positions = [
    {
      title: "Bus Driver",
      type: "Full Time",
      location: "Multiple Locations",
      icon: <TruckIcon size={32} className="text-yellow-400" />,
    },
    {
      title: "Route Planner",
      type: "Full Time",
      location: "Head Office",
      icon: <BriefcaseIcon size={32} className="text-yellow-400" />,
    },
  ];

  const benefits = [
    {
      icon: <HeartIcon size={24} className="text-yellow-400" />,
      title: "Health Benefits",
      description: "Comprehensive medical, dental, and vision coverage",
    },
    {
      icon: <GraduationCapIcon size={24} className="text-yellow-400" />,
      title: "Professional Development",
      description: "Ongoing training and career growth opportunities",
    },
  ];

  return (
    <section className="py-16 bg-white" id="careers">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Team</h2>
          <div className="h-1 w-24 bg-yellow-400 mx-auto"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            Be part of a team that's revolutionizing school transportation
            safety.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">Open Positions</h3>
            <div className="space-y-4">
              {positions.map((position, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="mr-4">{position.icon}</div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">
                        {position.title}
                      </h4>
                      <p className="text-gray-600">
                        {position.type} • {position.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6">Benefits & Perks</h3>
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="mr-4 p-2 bg-gray-50 rounded-lg">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">{benefit.title}</h4>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/careers"
            className="inline-flex items-center bg-yellow-400 text-gray-800 px-6 py-3 rounded-md font-medium hover:bg-yellow-500 transition-colors"
          >
            View All Opportunities
            <BriefcaseIcon size={18} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};
