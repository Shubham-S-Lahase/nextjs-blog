"use client";

import { useParams } from "next/navigation";
import { withAuth } from "@/lib/withAuth";
import { usePost } from "@/hooks/usePost"; // Adjust the import path as necessary
import Modal from "@/app/components/Modal";

function PostPage({ auth }) {
  const { id } = useParams();
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

  // Check if the post is still loading or an error occurred
  if (isLoading) return <div className="text-center">Loading...</div>;
  if (isError) return <div className="text-center text-red-500">Error loading post.</div>;

  // Return early if post is null or undefined
  if (!post) return <div className="text-center text-red-500">Post not found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-4">{post?.title}</h1>
      <p className="text-gray-600 text-sm mb-4">
        By {post.author.username} | {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <p className="text-gray-800 leading-relaxed mb-6">{post.content}</p>
      {(isAuthor || isAdmin) && (
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
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full border px-3 py-2 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              value={editData.content}
              onChange={(e) => setEditData({ ...editData, content: e.target.value })}
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

export default withAuth (PostPage);