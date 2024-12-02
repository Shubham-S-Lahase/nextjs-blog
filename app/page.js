"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { withAuth } from "@/lib/withAuth";

function HomePage({ auth }) {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { user } = auth;

  const fetchPosts = async () => {
    const res = await fetch(`/api/posts?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
  };

  // Updated useQuery to use the object syntax required by TanStack Query v5
  const {
    data = { posts: [], totalPages: 1 },
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts", page],
    queryFn: fetchPosts,
    keepPreviousData: true,
  });

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (isError)
    return <div className="text-center text-red-500">Error loading posts.</div>;

  const { posts: postList, totalPages } = data;
  // console.log(totalPages);

  const handleReadMoreClick = (postId) => {
    if(user) {
      window.location.href = `/post/${postId}`;
    } else {
      alert('You need to be logged in to read more about this post.');
    }
  }


  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-3xl font-bold text-center mb-6">Blog Posts</h1>
      {postList.length === 0 ? (
        <p className="text-center text-gray-500">No posts available.</p>
      ) : (
        <div className="space-y-6">
          {postList.map((post) => (
            <div
              key={post._id}
              className="p-4 border rounded-md shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">
              <span
                  className="text-blue-500 hover:underline cursor-pointer"
                  onClick={() => handleReadMoreClick(post._id)}
                >
                  {post.title}
                </span>
              </h2>
              <p className="text-gray-600 text-sm">
                By {post.author?.username || "Unknown"} |{" "}
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-2 text-gray-800">
                {post.content.slice(0, 100)}...
              </p>
              <span
                className="text-blue-500 mt-2 inline-block hover:underline cursor-pointer"
                onClick={() => handleReadMoreClick(post._id)} // Use the new handler
              >
                Read More
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}


export default withAuth(HomePage);