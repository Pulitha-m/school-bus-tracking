import React from "react";
import {
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
} from "lucide-react";

export const Footer = () => {
  const themeColor = "#333333"; // Greyish black background
  const iconColor = "#ffffff"; // White icons and text

  return (
    <footer style={{ backgroundColor: themeColor }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div>
            <div className="flex items-center mb-4">
              <MapPinIcon size={24} style={{ color: iconColor }} />
              <span
                className="ml-2 text-xl font-bold"
                style={{ color: iconColor }}
              >
                BusTracker
              </span>
            </div>
            <p className="mb-4" style={{ color: iconColor }}>
              Innovative school bus tracking and management solutions for safer
              student transportation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:opacity-80 transition-opacity">
                <FacebookIcon size={20} style={{ color: iconColor }} />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <TwitterIcon size={20} style={{ color: iconColor }} />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <InstagramIcon size={20} style={{ color: iconColor }} />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <LinkedinIcon size={20} style={{ color: iconColor }} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: iconColor }}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              {["Home", "Features", "Routes", "Careers", "Contact"].map(
                (item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="hover:opacity-80 transition-opacity"
                      style={{ color: iconColor }}
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: iconColor }}>
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <PhoneIcon
                  size={18}
                  className="mr-2 mt-1"
                  style={{ color: iconColor }}
                />
                <span style={{ color: iconColor }}>(555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <MailIcon
                  size={18}
                  className="mr-2 mt-1"
                  style={{ color: iconColor }}
                />
                <span style={{ color: iconColor }}>info@bustracker.com</span>
              </li>
              <li className="flex items-start">
                <MapPinIcon
                  size={18}
                  className="mr-2 mt-1"
                  style={{ color: iconColor }}
                />
                <span style={{ color: iconColor }}>
                  123 Tracking Ave, Transportation City, TC 12345
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: iconColor }}>
              Stay Updated
            </h3>
            <p className="mb-4" style={{ color: iconColor }}>
              Subscribe to our newsletter for updates and news.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full border border-gray-600 bg-transparent rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                style={{ color: iconColor }}
              />
              <button
                type="submit"
                className="bg-yellow-400 px-4 py-2 rounded-r-md hover:bg-yellow-500 transition-colors"
                style={{ color: themeColor }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-600">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm" style={{ color: iconColor }}>
              © {new Date().getFullYear()} BusTracker. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (item, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-sm hover:opacity-80 transition-opacity"
                    style={{ color: iconColor }}
                  >
                    {item}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
