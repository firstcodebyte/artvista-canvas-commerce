
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold text-artvista-purple-dark mb-4">
              Art<span className="text-artvista-purple">Vista</span>
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Discover and collect exceptional artwork from emerging and established Indian artists.
            </p>
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} ArtVista. All rights reserved.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-artvista-purple">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-sm text-gray-600 hover:text-artvista-purple">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-sm text-gray-600 hover:text-artvista-purple">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">Account</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-sm text-gray-600 hover:text-artvista-purple">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-sm text-gray-600 hover:text-artvista-purple">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/user-dashboard" className="text-sm text-gray-600 hover:text-artvista-purple">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600">
                Email: info@artvista.com
              </li>
              <li className="text-sm text-gray-600">
                Phone: +91 98765 43210
              </li>
              <li className="text-sm text-gray-600">
                Address: 123 Art Street, New Delhi, India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Payment methods accepted: Razorpay, UPI, Credit/Debit Cards, Net Banking
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
