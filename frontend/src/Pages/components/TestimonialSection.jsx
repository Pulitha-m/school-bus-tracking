import React from "react";
import { StarIcon } from "lucide-react";
export const TestimonialsSection = () => {
  // Theme color is blue for the 10% requirement
  const themeColor = "#1a56db";
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Parent",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      quote:
        "This bus tracking system gives me peace of mind knowing exactly when my children will arrive home. The notifications are incredibly helpful!",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "School Administrator",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      quote:
        "Since implementing this system, we've seen a 40% reduction in parent calls about bus locations and a significant improvement in route efficiency.",
      rating: 5,
    },
    {
      name: "David Chen",
      role: "Bus Driver",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      quote:
        "The route optimization has made my job so much easier. I can focus on safety while the system handles the best route calculations.",
      rating: 4,
    },
  ];
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What People Are Saying
          </h2>
          <div className="h-1 w-24 bg-yellow-400 mx-auto"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            Hear from parents, administrators, and drivers who use our system
            every day.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    size={18}
                    fill={i < testimonial.rating ? "#FBBF24" : "none"}
                    stroke={i < testimonial.rating ? "#FBBF24" : "#D1D5DB"}
                    className="mr-1"
                  />
                ))}
              </div>
              <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <div
                className="mt-4 h-1 w-12"
                style={{
                  backgroundColor: themeColor,
                }}
              ></div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <button className="text-gray-800 border-b-2 border-yellow-400 font-medium inline-flex items-center hover:border-yellow-500 transition-colors">
            See More Stories
          </button>
        </div>
      </div>
    </section>
  );
};
