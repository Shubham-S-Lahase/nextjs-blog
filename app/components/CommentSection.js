import { useState } from "react";

function CommentSection({
  comments,
  setComments,
  postId,
  auth,
  newComment,
  setNewComment,
}) {
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
      setNewComment(""); // Clear the input field
    } else {
      alert("Failed to add comment.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mt-8 mb-4">Comments</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddComment();
        }}
      >
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full border px-3 py-2 rounded-md mb-4"
          required
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
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
          />
        ))}
      </ul>
    </div>
  );
}

function Comment({ comment, setComments, auth }) {
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
    <li className="mb-4">
      <p className="text-sm font-semibold">{comment.author.username}</p>
      <p className="text-gray-800">{comment.content}</p>
      {(auth.user.role === "admin" || auth.user._id === comment.author._id) && (
        <div className="flex gap-2 mt-2">
          {auth.user._id === comment.author._id && (
            <>
              <button
                onClick={() => {
                  setEditingCommentId(comment._id);
                  setEditingCommentContent(comment.content);
                }}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                Edit
              </button>
              {editingCommentId === comment._id && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEditComment(comment._id);
                  }}
                >
                  <textarea
                    value={editingCommentContent}
                    onChange={(e) => setEditingCommentContent(e.target.value)}
                    className="w-full border px-3 py-2 rounded-md mb-2"
                  />
                  <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                    Save
                  </button>
                </form>
              )}
            </>
          )}
          <button
            onClick={() => handleDeleteComment(comment._id)}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </li>
  );
}

export default CommentSection;
