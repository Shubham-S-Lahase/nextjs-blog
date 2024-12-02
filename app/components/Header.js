"use client";

import Link from "next/link";
import { withAuth } from "@/lib/withAuth";
import Image from "next/image";
import { useState } from "react";
import Modal from "./Modal";
import Login from "./Login";
import Register from "./Register";
import ThemeToggle from "./ThemeToggle";
import { FaBars, FaTimes } from "react-icons/fa";
import { useTheme } from "@/lib/ThemeContext";
import Loader from "./Loader/Loader";

function Header({ auth }) {
  const { theme } = useTheme();
  const { user, logout, loading } = auth;
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

  const handleLoginSuccess = () => {
    setLoginModalOpen(false);
  };

  const handleRegisterSuccess = () => {
    setRegisterModalOpen(false);
  };

  if (loading) {
    return <Loader/>;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 p-4 z-[1000] shadow-md transition duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-white border-b border-blue-200"
          : "bg-white text-gray-900 border-b border-b-slate-800"
      }`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold">
          <Link href="/">My Blog</Link>
        </h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <div className="flex items-center space-x-3">
                <Image
                  src={user.profilePicture || "/default.png"}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                />
                <span className="text-lg">{user.username}</span>
              </div>
              <Link
                href="/newpost"
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200"
              >
                Create Post
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setRegisterModalOpen(true)}
                className="hover:underline text-lg"
              >
                Register
              </button>
              <button
                onClick={() => setLoginModalOpen(true)}
                className="hover:underline text-lg"
              >
                Login
              </button>
            </>
          )}
          <ThemeToggle />
        </nav>

        {/* Mobile Navigation Toggle & Theme Toggle */}
        <div className="flex items-center space-x-3 md:hidden">
          <ThemeToggle />
          <button
            className="text-inherit"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className={`absolute top-16 left-0 w-full bg-${theme === "dark" ? "gray-800" : "white"} z-[1000] flex flex-col items-center space-y-4 mt-4 md:hidden`}>
          {user ? (
            <>
              <div className="flex flex-col items-center">
                <Image
                  src={user.profilePicture || "/default.png"}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                />
                <span className={`text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{user.username}</span>
              </div>
              <Link
                href="/newpost"
                className={`bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200`}
              >
                Create Post
              </Link>
 <button
                onClick={logout}
                className={`bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-200`}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setRegisterModalOpen(true)}
                className={`hover:underline text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                Register
              </button>
              <button
                onClick={() => setLoginModalOpen(true)}
                className={`hover:underline text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                Login
              </button>
            </>
          )}
        </nav>
      )}

      {/* Login Modal */}
      <Modal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)}>
        <Login auth={auth} onSuccess={handleLoginSuccess} />
      </Modal>

      {/* Register Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      >
        <Register onSuccess={handleRegisterSuccess} />
      </Modal>
    </header>
  );
}

export default withAuth(Header);