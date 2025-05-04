import React, { useState, useEffect } from "react";
import { MapPinIcon, MenuIcon, XIcon, ChevronDownIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  const scrollTo = (target) => {
    navigate("/", { state: { scrollTo: target } });
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNavbar(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`bg-white fixed w-full z-50 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => scrollTo("hero")}
        >
          <MapPinIcon size={26} className="text-yellow-400" />
          <span className="text-xl font-bold text-gray-900">SAFETRACK</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => scrollTo("hero")}
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Home
          </button>
          <button
            onClick={() => scrollTo("features")}
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Features
          </button>
          <button
            onClick={() => scrollTo("about")}
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            About Us
          </button>
          <button
            onClick={() => scrollTo("feedbacks")}
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Feedbacks
          </button>
          <button
            onClick={() => navigate("/routes")}
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Routes
          </button>
          <button
            onClick={() => navigate("/careers")}
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Careers
          </button>
        </nav>

        {/* Right buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-1 cursor-pointer">
            <span className="text-sm text-gray-700">EN</span>
            <ChevronDownIcon size={16} className="text-gray-700" />
          </div>
          <button
            onClick={() => navigate("/auth")}
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            SIGN IN
          </button>
          <button
            onClick={() => scrollTo("contact")}
            className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
          >
            Contact
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <XIcon size={24} className="text-gray-800" />
          ) : (
            <MenuIcon size={24} className="text-gray-800" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4 bg-white">
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => scrollTo("hero")}
              className="text-gray-700 text-sm"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo("features")}
              className="text-gray-700 text-sm"
            >
              Features
            </button>
            <button
              onClick={() => scrollTo("about")}
              className="text-gray-700 text-sm"
            >
              About Us
            </button>
            <button
              onClick={() => scrollTo("feedbacks")}
              className="text-gray-700 text-sm"
            >
              Feedbacks
            </button>
            <button
              onClick={() => {
                navigate("/routes");
                setIsMenuOpen(false);
              }}
              className="text-gray-700 text-sm"
            >
              Routes
            </button>
            <button
              onClick={() => {
                navigate("/careers");
                setIsMenuOpen(false);
              }}
              className="text-gray-700 text-sm"
            >
              Careers
            </button>
            <button
              onClick={() => {
                navigate("/auth");
                setIsMenuOpen(false);
              }}
              className="text-gray-700 text-sm"
            >
              SIGN IN
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
