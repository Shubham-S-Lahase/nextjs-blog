"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { withAuth } from "@/lib/withAuth";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useTheme } from "@/lib/ThemeContext";
import Loader from "./components/Loader/Loader";

function HomePage({ auth }) {
  const { theme } = useTheme(); 
  const [page, setPage] = useState(1);
  const limit = 12;
  const { user } = auth;

  const fetchPosts = async () => {
    const res = await fetch(`/api/posts?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
  };

  const {
    data = { posts: [], totalPages: 1 },
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts", page],
    queryFn: fetchPosts,
    keepPreviousData: true,
  });

  if (isLoading) return <div className="text-center text-foreground"><Loader/></div>;
  
  if (isError)
    return <div className="text-center text-red-500 text-lg">Error loading posts.</div>;

  const { posts: postList, totalPages } = data;

  const handleReadMoreClick = (postId) => {
    if (user) {
      window.location.href = `/post/${postId}`;
    } else {
      alert("You need to be logged in to read more about this post.");
    }
  };

  return (
    <div
      className={`max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h1 className={`text-4xl font-bold text-center mb-8 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
        Blog Posts
      </h1>
      {postList.length === 0 ? (
        <p className={`text-center text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          No posts available.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {postList.map((post) => (
            <div
              key={post._id}
              className={`p-6 border rounded-lg shadow-lg transition-all transform hover:scale-105 hover:shadow-2xl ${
                theme === "dark"
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
            >
              <h2 className={`text-2xl font-semibold mb-2 ${theme === "dark" ? "text-blue-400" : "text-blue-500"}`}>
                <span
                  className={`${
                    theme === "dark" ? "hover:text-blue-300" : "hover:text-blue-600"
                  } hover:underline cursor-pointer`}
                  onClick={() => handleReadMoreClick(post._id)}
                >
                  {post.title}
                </span>
              </h2>
              <p className={`text-sm mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                By {post.author?.username || "Unknown"} |{" "}
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <p className={`line-clamp-3 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                {post.content.slice(0, 100)}...
              </p>
              <span
                className={`${
                  theme === "dark" ? "text-blue-400" : "text-blue-500"
                } mt-4 inline-block hover:underline cursor-pointer font-medium`}
                onClick={() => handleReadMoreClick(post._id)}
              >
                Read More
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center items-center gap-4 mt-10">
        <button
          className={`flex items-center px-5 py-2 rounded-lg transition-colors duration-300 ${
            theme === "dark"
              ? "bg-gray-700 text-white hover:bg-blue-500"
              : "bg-gray-200 text-gray-900 hover:bg-blue-500 hover:text-white"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          <FaChevronLeft className="mr-2" />
          Previous
        </button>
        <span
          className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
        >
          Page {page} of {totalPages}
        </span>
        <button
          className={`flex items-center px-5 py-2 rounded-lg transition-colors duration-300 ${
            theme === "dark"
              ? "bg-gray-700 text-white hover:bg-blue-500"
              : "bg-gray-200 text-gray-900 hover:bg-blue-500 hover:text-white"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
          <FaChevronRight className="ml-2" />
        </button>
      </div>
    </div>
  );
}

export default withAuth(HomePage);