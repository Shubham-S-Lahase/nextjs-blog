'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiEdit3 } from "react-icons/fi";
import { withAuth } from "@/lib/withAuth";
import { useTheme } from "@/lib/ThemeContext";
import Loader from "../components/Loader/Loader";

function CreatePostForm({ auth }) {
  const { user, loading } = auth;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { theme } = useTheme();

  if (loading) {
    return (
      <p className={`text-center text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
        <Loader/>
      </p>
    );
  }

  if (!user) {
    return (
      <div
        className={`text-center text-lg mt-6 ${
          theme === "dark" ? "text-gray-300" : "text-gray-700"
        }`}
      >
        <p>You must be logged in to create a post.</p>
        <a
          href="/login"
          className={`${
            theme === "dark" ? "text-blue-400" : "text-blue-500"
          } hover:underline`}
        >
          Login here.
        </a>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to create a post.");
      return;
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        const postData = await res.json();
        setMessage("Post created successfully!");
        setTitle("");
        setContent("");
        router.push(`/post/${postData._id}`);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to create post.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div
      className={`max-w-4xl mx-auto p-8 rounded-lg shadow-lg transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } min-h-full flex flex-col justify-center gap-4`}
    >
      <h1
        className={`text-3xl font-bold mb-8 flex items-center gap-3 ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        <FiEdit3
          className={`${
            theme === "dark" ? "text-blue-400" : "text-blue-500"
          }`}
        />
        Create a New Blog Post
      </h1>
      {error && (
        <p className={`text-red-500 mb-6 text-center`}>{error}</p>
      )}
      {message && (
        <p className={`text-green-500 mb-6 text-center`}>{message}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className={`block text-lg font-medium ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            className={`w-full mt-2 px-4 py-3 border rounded-lg transition-colors duration-300 ${
              theme === "dark"
                ? "bg-gray-800 text-white border-gray-700 placeholder-gray-400"
                : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
            } focus:ring-2 ${
              theme === "dark" ? "focus:ring-blue-400" : "focus:ring-blue-600"
            }`}
            required
          />
        </div>

        {/* Content */}
        <div>
          <label
            htmlFor="content"
            className={`block text-lg font-medium ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content..."
            rows={8}
            className={`w-full mt-2 px-4 py-3 border rounded-lg transition-colors duration-300 ${
              theme === "dark"
                ? "bg-gray-800 text-white border-gray-700 placeholder-gray-400"
                : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
            } focus:ring-2 ${
              theme === "dark" ? "focus:ring-blue-400" : "focus:ring-blue-600"
            }`}
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-3 font-semibold rounded-lg transition-transform duration-300 transform ${
            theme === "dark"
              ? "bg-blue-400 text-white hover:bg-blue-500"
              : "bg-blue-500 text-white hover:bg-blue-600"
          } active:scale-95 disabled:opacity-50`}
        >
          {loading ? "Creating Post..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}

export default withAuth(CreatePostForm);
