'use client';

import Link from 'next/link';
import { withAuth } from '@/lib/withAuth';
import Image from 'next/image';

function Header({ auth }) {

  const {user, logout, loading } = auth;

  if (loading) {
    return <p>Loading...</p>;
  }

  // console.log(user);

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">My Blog</h1>
        <nav className="flex items-center">
          {user ? (
            <>
              <div className="flex items-center space-x-4">
                <Image
                  src={user.profilePicture || '/default-avatar.png'}
                  alt="Profile"
                  width={32}
                  height={32}
                  layout="responsive"
                  className="w-8 h-8 rounded-full border border-gray-300"
                />
                <span>{user.username}</span>
              </div>
              <Link
                href="/newpost"
                className="ml-4 bg-blue-500 px-3 py-1 rounded hover:bg-blue-700"
              >
                Create Post
              </Link>
              <button
                onClick={logout}
                className="ml-4 bg-red-500 px-3 py-1 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/register" className="mr-4 hover:underline">
                Register
              </Link>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default withAuth(Header);