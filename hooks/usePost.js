// hooks/usePost.js
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const usePost = (id, auth) => {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const [editData, setEditData] = useState({ title: "", content: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setPost((prevPost) => ({
        ...prevPost,
        title: editData.title,
        content: editData.content,
      }));
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
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authorization token is missing. Please log in again.");
        return;
      }

      try {
        const res = await fetch(`/api/posts/${post._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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

  return {
    post,
    isLoading,
    isError,
    isAuthor,
    isModalOpen,
    editData,
    setEditData,
    setIsModalOpen,
    handleEdit,
    handleSave,
    handleDelete,
  };
};