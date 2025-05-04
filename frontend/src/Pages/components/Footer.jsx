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
  return (
    <footer className="bg-[#1f1f1f] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & About */}
          <div>
            <div className="flex items-center mb-4">
              <MapPinIcon className="w-5 h-5 text-white" />
              <span className="ml-2 text-xl font-bold text-white">
                BusTracker
              </span>
            </div>
            <p className="text-sm text-white/80 mb-4">
              Innovative school bus tracking solutions for safer, smarter
              student transportation across the island.
            </p>
            <div className="flex space-x-4 mt-4">
              {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon].map(
                (Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </a>
                )
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-white/80">
              {["Home", "Features", "About", "Contact", "Careers"].map(
                (item, index) => (
                  <li key={index}>
                    <a href="#" className="hover:text-white transition">
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm text-white/80">
              <li className="flex items-start">
                <PhoneIcon className="w-4 h-4 mr-3 mt-1 text-yellow-400" />
                (555) 123-4567
              </li>
              <li className="flex items-start">
                <MailIcon className="w-4 h-4 mr-3 mt-1 text-yellow-400" />
                info@bustracker.com
              </li>
              <li className="flex items-start">
                <MapPinIcon className="w-4 h-4 mr-3 mt-1 text-yellow-400" />
                123 Tracking Ave, Transportation City
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Stay Updated
            </h3>
            <p className="text-sm text-white/80 mb-4">
              Subscribe to get news, updates, and feature releases.
            </p>
            <form className="flex w-full">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-l-md bg-white/10 border border-white/20 placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              <button
                type="submit"
                className="bg-yellow-400 px-4 py-2 rounded-r-md text-black font-semibold hover:bg-yellow-500 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-white/60 gap-4">
          <p>© {new Date().getFullYear()} BusTracker. All rights reserved.</p>
          <div className="flex space-x-6">
            {["Privacy Policy", "Terms", "Cookies"].map((item, index) => (
              <a key={index} href="#" className="hover:text-white transition">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
