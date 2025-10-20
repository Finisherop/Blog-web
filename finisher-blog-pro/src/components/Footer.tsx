'use client';

import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-black/50 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold gradient-text">
              Finisher Blog Pro
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/contact"
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Contact
            </Link>
            <span className="text-gray-400">
              Made by{' '}
              <span className="gradient-text font-semibold">Finisher</span>
            </span>
          </div>

          {/* Copyright */}
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Finisher Blog Pro. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;