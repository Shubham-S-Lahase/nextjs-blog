"use client";

import Link from "next/link";
import { withAuth } from "@/lib/withAuth";
import Image from "next/image";
import { useState } from "react";
import Modal from "./Modal";
import Login from "./Login";
import Register from "./Register";

function Header({ auth }) {
  const { user, logout, loading } = auth;
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

  const handleLoginSuccess = () => {
    setLoginModalOpen(false);
  };

  const handleRegisterSuccess = () => {
    setRegisterModalOpen(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Blog</h1>
        <nav className="flex items-center space-x-4">
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
        </nav>
      </div>
      <Modal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)}>
        <Login auth={auth} onSuccess={handleLoginSuccess} />
      </Modal>
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
