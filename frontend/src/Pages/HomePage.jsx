import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import { AboutUsSection } from "./components/PortalSection";
import { TestimonialsSection } from "./components/TestimonialSection";
import { ContactSection } from "./components/ContactSection";
import { CTASection } from "./components/CTASection";
import { ParallaxProvider } from "react-scroll-parallax";

export const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    const sectionId = location.state?.scrollTo;
    if (sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <ParallaxProvider>
      <div className="pt-20">
        {" "}
        {/* ~80px space for fixed navbar */}
        <div id="hero">
          <HeroSection />
        </div>
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="about">
          <AboutUsSection />
        </div>
        <div id="feedbacks">
          <TestimonialsSection />
        </div>
        <div id="contact">
          <ContactSection />
        </div>
        <CTASection />
      </div>
    </ParallaxProvider>
  );
};
