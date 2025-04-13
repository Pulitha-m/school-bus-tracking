import React from "react";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { PortalSection } from "./components/PortalSection";
import { TestimonialsSection } from "./components/TestimonialSection";
import { ContactSection } from "./components/ContactSection";
import { CTASection } from "./components/CTASection";
export const HomePage = () => {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PortalSection />
      <TestimonialsSection />
      <ContactSection />
      <CTASection />
    </>
  );
};
