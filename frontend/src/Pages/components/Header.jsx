import React, { useState } from "react";
import { MapPinIcon, MenuIcon, XIcon } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const themeColor = "#333333";
  const iconColor = "#ffffff";

  return (
    <header
      className="shadow-sm sticky top-0 z-50"
      style={{ backgroundColor: themeColor }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <MapPinIcon size={28} style={{ color: iconColor }} />
            <span
              className="ml-2 text-xl font-bold"
              style={{ color: iconColor }}
            >
              SafeTrack
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {["Home", "Features", "Routes", "Careers", "Contact"].map(
              (item, index) => (
                <Link
                  key={index}
                  to={
                    item === "Features" || item === "Contact"
                      ? `/#${item.toLowerCase()}`
                      : `/${item.toLowerCase()}`
                  }
                  className="border-b-2 border-transparent hover:border-yellow-400 pb-1 transition-all"
                  style={{ color: iconColor }}
                >
                  {item}
                </Link>
              )
            )}
          </nav>

          {/* Login/Sign Up Button */}
          <div className="hidden md:block">
            <Link
              to="/auth"
              className="bg-yellow-400 px-6 py-2 rounded-md font-medium hover:bg-yellow-500 transition-colors"
              style={{
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                color: themeColor,
              }}
            >
              Login / Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <XIcon size={24} style={{ color: iconColor }} />
            ) : (
              <MenuIcon size={24} style={{ color: iconColor }} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              {["Home", "Features", "Routes", "Careers", "Contact"].map(
                (item, index) => (
                  <Link
                    key={index}
                    to={
                      item === "Features" || item === "Contact"
                        ? `/#${item.toLowerCase()}`
                        : `/${item.toLowerCase()}`
                    }
                    className="py-2 border-b border-gray-100"
                    style={{ color: iconColor }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </Link>
                )
              )}
              {/* Mobile Login/Sign Up Button */}
              <Link
                to="/auth"
                className="bg-yellow-400 px-6 py-2 rounded-md font-medium hover:bg-yellow-500 transition-colors text-center"
                style={{
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  color: themeColor,
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Login / Sign Up
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
