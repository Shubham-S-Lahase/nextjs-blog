"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiEdit3 } from "react-icons/fi";
import { withAuth } from "@/lib/withAuth";

function CreatePostForm({ auth }) {
  const { user, loading } = auth;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState('');
  const router = useRouter();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    // Redirect to login or show a message
    return <p>You must be logged in to create a post. <a href="/login" className="text-blue-500 hover:underline">Login here.</a></p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to create a post.');
      return;
    }
  
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });
  
      if (res.ok) {
        const postData = await res.json();  // Get the created post data (including ID)
        setMessage('Post created successfully!');
        setTitle('');
        setContent('');
        router.push(`/post/${postData._id}`);  // Redirect to the detailed post view
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to create post.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };
  


  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FiEdit3 className="text-blue-500" /> Create a New Blog Post
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-500 mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-medium">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            className="w-full mt-2 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Content */}
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 font-medium">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content..."
            rows={6}
            className="w-full mt-2 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Creating Post..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}

export default withAuth(CreatePostForm);