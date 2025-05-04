import React from "react";
import { StarIcon } from "lucide-react";

export const TestimonialsSection = () => {
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
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-black">
          What People Are Saying
        </h2>
        <div className="h-1 w-24 bg-yellow-400 mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12 text-lg">
          Hear directly from parents, school administrators, and drivers using
          our system every day.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all"
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
              <p className="text-gray-700 italic mb-6 leading-relaxed">
                “{testimonial.quote}”
              </p>
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover mr-4 border-2 border-yellow-400"
                />
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <div className="mt-4 h-1 w-12 bg-yellow-400 rounded-full"></div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <button className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold shadow-md hover:bg-yellow-500 transition">
            See More Stories
          </button>
        </div>
      </div>
    </section>
  );
};
