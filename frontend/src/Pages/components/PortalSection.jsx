import React from "react";
import { motion } from "framer-motion";

export const AboutUsSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
        {/* Left Text Content */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <h2 className="text-5xl font-extrabold mb-4 text-black">About Us</h2>
          <h3 className="text-2xl font-semibold mb-6 text-gray-800">
            Reliable, Safe, and Smart School Transport
          </h3>
          <p className="text-gray-600 text-lg mb-8">
            Every child’s journey to school should be safe, secure, and
            worry-free. That belief drives everything we do. Our platform
            empowers parents with real-time GPS tracking, instant boarding and
            drop-off alerts, and intelligent route planning — ensuring their
            children are always accounted for and protected. We work closely
            with schools and transport providers to create a transparent,
            technology-driven ecosystem where student safety is the top
            priority. With every bus trip, we’re helping families feel confident
            and connected.
          </p>

          <button className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-full shadow-md hover:bg-yellow-500 transition duration-300">
            Learn More
          </button>
        </div>

        {/* Right Overlapping Image Section */}
        <div className="lg:w-1/2 relative w-full h-[580px]">
          {/* Black Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="absolute top-[-30px] left-[240px] w-[380px] h-[380px] bg-black rounded-md shadow-xl z-0"
          ></motion.div>

          {/* Yellow Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="absolute top-[80px] left-[50px] w-[360px] h-[360px] bg-yellow-400 rounded-md shadow-xl z-0"
          ></motion.div>

          {/* Image 1 */}
          <motion.img
            src="/about1.jpg"
            alt="Bus Tracking"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="absolute top-[0px] left-[0px] w-[380px] h-[260px] object-cover rounded-lg shadow-xl z-10"
          />

          {/* Image 2 */}
          <motion.img
            src="/about2.jpg"
            alt="Optimized Routes"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="absolute top-[220px] left-[220px] w-[380px] h-[260px] object-cover rounded-lg shadow-xl z-20"
          />
        </div>
      </div>
    </section>
  );
};
