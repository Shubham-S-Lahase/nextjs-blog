"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { withAuth } from "@/lib/withAuth";
import { useEffect, useState } from "react";
import Modal from "@/app/components/Modal";

function PostPage({ auth }) {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({ title: "", content: "" });

  const { user } = auth;

  console.log(user);

  // Fetch post data with Authorization header
  const fetchPost = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authorization token missing");

    const res = await fetch(`/api/posts/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch post");
    return res.json();
  };

  const {
    data: fetchedPost,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: fetchPost,
  });

  useEffect(() => {
    if (fetchedPost?.post) {
      setPost(fetchedPost.post);
      if (auth.user && auth.user._id === fetchedPost.post.author._id) {
        setIsAuthor(true);
      }
    }
  }, [fetchedPost, auth.user]);

  const handleEdit = () => {
    setEditData({ title: post.title, content: post.content });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/posts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editData),
    });

    if (res.ok) {
      const updatedPost = await res.json();
      setPost(updatedPost);
      setIsModalOpen(false);
    } else {
      alert("Failed to update post");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmDelete) {
      const token = localStorage.getItem("token"); // Retrieve the token
      if (!token) {
        alert("Authorization token is missing. Please log in again.");
        return;
      }

      try {
        const res = await fetch(`/api/posts/${post._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token
          },
        });

        if (res.ok) {
          alert("Post deleted successfully");
          router.push("/");
        } else {
          const errorData = await res.json();
          alert(`Failed to delete post: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("An error occurred while deleting the post.");
      }
    }
  };

  // Check if the post is still loading or an error occurred
  if (isLoading) return <div className="text-center">Loading...</div>;
  if (isError)
    return <div className="text-center text-red-500">Error loading post.</div>;

  // Return early if post is null or undefined
  if (!post)
    return <div className="text-center text-red-500">Post not found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-4">{post?.title}</h1>{" "}
      {/* Optional chaining to avoid errors */}
      <p className="text-gray-600 text-sm mb-4">
        By {post.author.username} |{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <p className="text-gray-800 leading-relaxed mb-6">{post.content}</p>
      {/* Show edit and delete buttons if the logged-in user is the author */}
      {isAuthor && (
        <div className="flex gap-4">
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Edit Post
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete Post
          </button>
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Edit Post</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              value={editData.content}
              onChange={(e) =>
                setEditData({ ...editData, content: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-md"
              rows="6"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Save Changes
          </button>
        </form>
      </Modal>
      <h2 className="text-2xl font-bold mt-8 mb-4">Comments</h2>
      <ul>
        {post.comments && post.comments.length > 0 ? (
          post.comments.map((comment) => (
            <li key={comment._id} className="mb-4">
              <p className="text-sm font-semibold">{comment.author.username}</p>
              <p className="text-gray-800">{comment.content}</p>
            </li>
          ))
        ) : (
          <p>No comments yet</p>
        )}
      </ul>
    </div>
  );
}

export default withAuth(PostPage);
