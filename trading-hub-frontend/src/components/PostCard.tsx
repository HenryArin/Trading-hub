import { useState } from "react";
import axios from "axios";
import CommentSection from "./CommentSection"; // ✅ New Component

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Post {
  id: number;
  card_name: string;
  description: string;
  created_at: string;
  user_id: number;
  comments: Comment[];
}

interface PostCardProps {
  post: Post;
  isAdmin: boolean;
  userId: number | null;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const PostCard: React.FC<PostCardProps> = ({ post, isAdmin, userId, setPosts }) => {
  const handleDeletePost = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to delete a post.");
        return;
      }

      const confirmDelete = window.confirm("Are you sure you want to delete this post?");
      if (!confirmDelete) return;

      await axios.delete(`${API_BASE_URL}/posts/${post.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== post.id));
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  };

  return (
    <div className="border p-4 rounded mt-2">
      <h3 className="text-lg font-semibold">{post.card_name}</h3>
      <p>{post.description}</p>

      {/* Delete Post Button */}
      {(isAdmin || post.user_id === userId) && (
        <button onClick={handleDeletePost} className="mt-2 px-3 py-1 bg-red-500 text-white rounded">
          Delete Post
        </button>
      )}

      {/* Comments Section */}
      <CommentSection post={post} isAdmin={isAdmin} userId={userId} setPosts={setPosts} />
    </div>
  );
};

export default PostCard;
