import { useState } from "react";
import axios from "axios";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Comment {
  id: number;
  user_id: number;
  post_id: number;
  content: string;
  created_at: string;
}

interface Post {
  id: number;
  comments: Comment[];
}

interface CommentSectionProps {
  post: Post;
  isAdmin: boolean;
  userId: number | null;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const CommentSection: React.FC<CommentSectionProps> = ({ post, isAdmin, userId, setPosts }) => {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to comment.");
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/posts/${post.id}/comments`,
        { comment: { content: newComment, post_id: post.id } }, // ✅ Add `post_id`
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      
      
      // Update comments for this specific post
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === post.id ? { ...p, comments: [...p.comments, response.data] } : p
        )
      );

      setNewComment(""); // Clear input field
    } catch (error) {
      console.error("Failed to add comment", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to delete a comment.");
        return;
      }

      await axios.delete(`http://localhost:3000/posts/${post.id}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the deleted comment from state
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === post.id ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) } : p
        )
      );
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  return (
    <div className="mt-2">
      <h4 className="font-bold">Comments</h4>

      {/* Display Comments */}
      {post.comments.length > 0 ? (
        post.comments.map((comment) => (
          <div key={comment.id} className="border-b py-1 flex justify-between items-center">
            <p>{comment.content}</p>

            {/* Show delete button if the user owns the comment OR if the user is an admin */}
            {(isAdmin || comment.user_id === userId) && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No comments yet.</p>
      )}

      {/* Add Comment Input */}
      <div className="mt-2">
        <input
          type="text"
          placeholder="Write a comment..."
          className="border p-2 w-full"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={handleAddComment}
          className="mt-2 px-4 py-1 bg-green-500 text-white rounded"
        >
          Post Comment
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
