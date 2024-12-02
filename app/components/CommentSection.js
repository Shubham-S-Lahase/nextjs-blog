import { useState } from "react";
import { FiEdit2, FiTrash2, FiSave } from "react-icons/fi"; 
import { useTheme } from "@/lib/ThemeContext"; 

function CommentSection({
  comments,
  setComments,
  postId,
  auth,
  newComment,
  setNewComment,
}) {
  const { theme } = useTheme();
  const handleAddComment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to add a comment.");
      return;
    }

    const res = await fetch(`/api/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: newComment, postId }),
    });

    if (res.ok) {
      const addedComment = await res.json();
      setComments((prevComments) => [...prevComments, addedComment]);
      setNewComment(""); 
    } else {
      alert("Failed to add comment.");
    }
  };

  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } p-6 rounded-lg`}
    >
      <h2 className="text-3xl font-semibold mt-8 mb-6">
        Comments
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddComment();
        }}
        className="mb-6"
      >
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className={`w-full border p-3 rounded-md mb-4 text-lg focus:outline-none focus:ring-2 transition duration-300 ${
            theme === "dark"
              ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-400"
              : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
          }`}
          required
        />
        <button
          type="submit"
          className={`px-6 py-2 rounded-md transition duration-300 ${
            theme === "dark"
              ? "bg-blue-400 text-white hover:bg-blue-500"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Add Comment
        </button>
      </form>
      <ul>
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            setComments={setComments}
            auth={auth}
            theme={theme} 
          />
        ))}
      </ul>
    </div>
  );
}

function Comment({ comment, setComments, auth, theme }) {
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);

  const handleEditComment = async (commentId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to edit the comment.");
      return;
    }

    const res = await fetch(`/api/comments/${commentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: editingCommentContent }),
    });

    if (res.ok) {
      const updatedComment = await res.json();
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId ? { ...comment, content: updatedComment.content } : comment
        )
      );
      setEditingCommentId(null);
      setEditingCommentContent("");
    } else {
      alert("Failed to edit comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to delete the comment.");
      return;
    }

    const res = await fetch(`/api/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
    } else {
      alert("Failed to delete comment.");
    }
  };

  return (
    <li
      className={`mb-6 pb-4 border-b ${
        theme === "dark" ? "border-gray-700 text-white" : "border-gray-300 text-gray-900"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">{comment.author.username}</p>
          <p className={`text-gray-600 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            {comment.content}
          </p>
        </div>
        {(auth.user.role === "admin" || auth.user._id === comment.author._id) && (
          <div className="flex gap-4">
            {auth.user._id === comment.author._id && (
              <>
                <button
                  onClick={() => {
                    setEditingCommentId(comment._id);
                    setEditingCommentContent(comment.content);
                  }}
                  className="text-yellow-500 hover:text-yellow-600 transition duration-200"
                >
                  <FiEdit2 size={20} />
                </button>
                {editingCommentId === comment._id && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleEditComment(comment._id);
                    }}
                    className="mt-2"
                  >
                    <textarea
                      value={editingCommentContent}
                      onChange={(e) => setEditingCommentContent(e.target.value)}
                      className={`w-full border p-2 rounded-md mb-2 text-lg focus:outline-none focus:ring-2 transition duration-300 ${
                        theme === "dark"
                          ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-400"
                          : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                    <button
                      type="submit"
                      className={`px-4 py-2 rounded-md ${
                        theme === "dark"
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      <FiSave size={18} className="inline mr-2" />
                      Save
                    </button>
                  </form>
                )}
              </>
            )}
            <button
              onClick={() => handleDeleteComment(comment._id)}
              className="text-red-500 hover:text-red-600 transition duration-200"
            >
              <FiTrash2 size={20} />
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

export default CommentSection;