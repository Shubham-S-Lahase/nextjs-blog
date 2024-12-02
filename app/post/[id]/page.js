"use client";

import { useParams } from "next/navigation";
import { withAuth } from "@/lib/withAuth";
import { usePost } from "@/hooks/usePost";
import Modal from "@/app/components/Modal";
import { useState, useEffect } from "react";
import CommentSection from "@/app/components/CommentSection";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useTheme } from "@/lib/ThemeContext"; 
import Loader from "@/app/components/Loader/Loader";

function PostPage({ auth }) {
  const { theme } = useTheme();
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const {
    post,
    isLoading,
    isError,
    isAuthor,
    isAdmin,
    isModalOpen,
    editData,
    setEditData,
    setIsModalOpen,
    handleEdit,
    handleSave,
    handleDelete,
  } = usePost(id, auth);

  useEffect(() => {
    if (post) {
      setComments(post.comments);
    }
  }, [post]);

  // Loading and error states
  if (isLoading) return <div className="text-center text-foreground"><Loader/></div>;
  if (isError) return <div className="text-center text-red-500 text-lg">Error loading post.</div>;
  if (!post) return <div className="text-center text-red-500 text-lg">Post not found.</div>;

  return (
    <div
      className={`max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h1 className={`text-4xl font-extrabold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{post?.title}</h1>
      <p className={`text-sm mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
        By <span className="font-medium">{post.author.username}</span> |{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <p className={`text-lg leading-relaxed mb-8 ${theme === "dark" ? "text-gray-300" : "text-gray-800"}`}>{post.content}</p>
      {(isAuthor || isAdmin) && (
        <div className="flex gap-4 mb-8">
          <button
            onClick={handleEdit}
            className={`p-3 rounded-full bg-blue-600 text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ${
              theme === "dark" ? "hover:bg-blue-500" : "hover:bg-blue-700"
            }`}
            aria-label="Edit Post"
          >
            <FaEdit size={20} />
          </button>
          <button
            onClick={handleDelete}
            className={`p-3 rounded-full bg-red-600 text-white shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 ${
              theme === "dark" ? "hover:bg-red-500" : "hover:bg-red-700"
            }`}
            aria-label="Delete Post"
          >
            <FaTrashAlt size={20} />
          </button>
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Edit Post</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-6"
        >
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Title</label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline -none focus:ring-2 focus:ring-blue-500 transition ${theme === "dark" ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-900 border-gray-300"}`}
              required
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Content</label>
            <textarea
              value={editData.content}
              onChange={(e) => setEditData({ ...editData, content: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${theme === "dark" ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-900 border-gray-300"}`}
              rows="6"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md shadow text-white transition-colors duration-300 ${
              theme === "dark" ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            Save Changes
          </button>
        </form>
      </Modal>
      <CommentSection
        comments={comments}
        setComments={setComments}
        postId={id}
        auth={auth}
        newComment={newComment}
        setNewComment={setNewComment}
        commentInputClassName={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${theme === "dark" ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-900 border-gray-300"}`}
      />
    </div>
  );
}

export default withAuth(PostPage);