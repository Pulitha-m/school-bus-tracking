import React, { memo } from "react";
import PropTypes from "prop-types";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Parallax } from "react-scroll-parallax";
import { motion } from "framer-motion";

const headlineWords = ["TRAVEL", "WITH", "CONFIDENCE"];

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.4,
      duration: 0.6,
    },
  }),
};

const HeroSection = ({ center = [40.7128, -74.006], zoom = 13 }) => {
  return (
    <section className="relative w-full bg-white pt-32">
      {/* Background Map */}
      <div className="absolute inset-0 flex items-center justify-center z-0 px-2 pt-2">
        <div className="w-full max-w-[1600px] h-[600px] rounded-[24px] overflow-hidden shadow-lg -mt-9">
          <MapContainer
            center={center}
            zoom={zoom}
            style={{ width: "100%", height: "100%" }}
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              opacity={0.95}
            />
          </MapContainer>
        </div>
      </div>

      {/* Foreground White Card */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        <div className="bg-white rounded-[30px] shadow-2xl w-full max-w-6xl mx-auto p-5 sm:p-8 md:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center">
          {/* Left Text Section */}
          <Parallax
            speed={-10}
            className="w-full md:w-1/2 text-center md:text-left"
          >
            <p className="text-gray-700 text-sm sm:text-base mb-4">
              As a trusted partner in student safety, we provide reliable,
              real-time school bus tracking to keep parents informed and
              children secure.
            </p>
            <div className="text-black text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight space-y-2">
              {headlineWords.map((word, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={wordVariants}
                >
                  {word}
                </motion.div>
              ))}
            </div>
          </Parallax>

          {/* Right Map Mini + Bus */}
          <div className="w-full md:w-1/2 relative flex justify-center md:justify-end">
            <div className="rounded-[30px] w-full max-w-[400px] h-[260px] sm:h-[320px] md:h-[400px] shadow-md overflow-hidden">
              <MapContainer
                center={center}
                zoom={zoom + 1}
                style={{ width: "100%", height: "100%" }}
                zoomControl={false}
                attributionControl={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  opacity={0.95}
                />
              </MapContainer>
            </div>

            {/* Bus Image */}
            <Parallax
              speed={15}
              className="absolute bottom-[-30px] md:bottom-[30px] right-0 sm:right-[-10px] z-[999]"
            >
              <img
                src="/bushero.png"
                alt="Bus"
                className="w-[90%] sm:w-[110%] md:w-[130%] max-w-[1000px] md:max-w-[1400px] drop-shadow-xl pointer-events-none"
                loading="lazy"
              />
            </Parallax>
          </div>
        </div>
      </div>

      {/* Add some space below */}
      <div className="h-[100px]" />
    </section>
  );
};

HeroSection.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
};

export default memo(HeroSection);
