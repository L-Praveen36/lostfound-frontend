import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../firebase';
import { useAuth } from '../AuthContext';
import SignInModal from './SignInModal';
import MyProfileModal from './MyProfileModal'; // optional

function Navbar({ onShowAdminSignIn }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { user } = useAuth();
  const dropdownRef = useRef();

  const handleSignOut = () => {
    auth.signOut();
    localStorage.removeItem("user");
    window.location.reload();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="gradient-bg text-white shadow-lg z-50 relative">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <lottie-player
              src="https://assets3.lottiefiles.com/packages/lf20_5tkzkblw.json"
              background="transparent"
              speed="1"
              style={{ width: '40px', height: '40px' }}
              loop
              autoPlay
            ></lottie-player>
            <span className="text-xl font-bold">Lost&Found</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            <a href="#home" className="hover:text-gray-200 transition">Home</a>
            <a href="#listings" className="hover:text-gray-200 transition">Browse Items</a>
            <a href="#report" className="hover:text-gray-200 transition">Report Item</a>
            <a href="#how-it-works" className="hover:text-gray-200 transition">How It Works</a>
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => {
                const token = sessionStorage.getItem('adminToken');
                if (token) {
                  window.dispatchEvent(new Event('openAdminPanel'));
                } else {
                  onShowAdminSignIn();
                }
              }}
              className="px-4 py-2 rounded-full border border-white ..."
            >
              Admin
            </button>


            {!user ? (
              <button
                onClick={() => setShowSignInModal(true)}
                className="px-4 py-2 rounded-full border border-white text-white hover:bg-white hover:text-purple-700 transition"
              >
                Sign In
              </button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <img
                  src={user.photoURL}
                  onClick={() => setIsDropdownOpen(prev => !prev)}
                  className="w-10 h-10 rounded-full cursor-pointer"
                  alt="User"
                />
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg w-40 z-50">
                    <p
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setShowProfileModal(true);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      My Profile
                    </p>
                    <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Help</p>
                    <p
                      onClick={handleSignOut}
                      className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                    >
                      Sign Out
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu icon */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pt-4">
            <div className="flex flex-col space-y-3">
              <a href="#home" className="block hover:text-gray-200 transition">Home</a>
              <a href="#listings" className="block hover:text-gray-200 transition">Browse Items</a>
              <a href="#report" className="block hover:text-gray-200 transition">Report Item</a>
              <a href="#how-it-works" className="block hover:text-gray-200 transition">How It Works</a>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  const token = sessionStorage.getItem('adminToken');
                  if (token) {
                    window.dispatchEvent(new Event('openAdminPanel'));
                  } else {
                    onShowAdminSignIn();
                  }
                }}
                className="block hover:text-gray-200 transition text-left"
              >
                Admin
              </button>

              {!user ? (
                <button
                  onClick={() => {
                    setShowSignInModal(true);
                    setMenuOpen(false);
                  }}
                  className="block hover:text-gray-200 transition text-left"
                >
                  Sign In
                </button>
              ) : (
                <div className="mt-4 text-center">
                  <img src={user.photoURL} className="w-10 h-10 rounded-full mx-auto" alt="user" />
                  <div className="mt-2 bg-white text-black rounded-lg shadow text-center">
                    <p
                      className="py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setShowProfileModal(true);
                        setMenuOpen(false);
                      }}
                    >
                      My Profile
                    </p>
                    <p className="py-2 hover:bg-gray-100 cursor-pointer">Help</p>
                    <p
                      onClick={handleSignOut}
                      className="py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                    >
                      Sign Out
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showSignInModal && <SignInModal onClose={() => setShowSignInModal(false)} />}
      {showProfileModal && <MyProfileModal onClose={() => setShowProfileModal(false)} />}
    </nav>
  );
}

export default Navbar;
