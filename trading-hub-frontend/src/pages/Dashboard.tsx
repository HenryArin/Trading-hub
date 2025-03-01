import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PostCard from "../components/PostCard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Post {
  id: number;
  card_name: string;
  description: string;
  created_at: string;
  user_id: number;
  comments: Comment[];
}

interface Comment {
  id: number;
  user_id: number;
  post_id: number;
  content: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cardName, setCardName] = useState("");
  const [description, setDescription] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch posts
        const response = await axios.get(`${API_BASE_URL}/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch comments for each post
        const postsWithComments = await Promise.all(
          response.data.map(async (post: Post) => {
            try {
              const commentsRes = await axios.get(`${API_BASE_URL}/posts/${post.id}/comments`);
              return { ...post, comments: commentsRes.data };
            } catch {
              return { ...post, comments: [] };
            }
          })
        );

        setPosts(postsWithComments);

        // Decode token to get user info
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));
        setIsAdmin(tokenPayload.admin);
        setUserId(tokenPayload.user_id);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [navigate]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to create a post.");
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/posts`,
        { card_name: cardName, description },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      setPosts((prevPosts) => [{ ...response.data, comments: [] }, ...prevPosts]);
      setCardName("");
      setDescription("");
    } catch (error) {
      console.error("Failed to create post", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <p className="mt-2">Here are the latest card requests:</p>

      {/* Post Form */}
      <form onSubmit={handleCreatePost} className="mt-4 flex flex-col">
        <input type="text" placeholder="Card Name" className="border p-2 mt-2" value={cardName} onChange={(e) => setCardName(e.target.value)} />
        <textarea placeholder="Description" className="border p-2 mt-2" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button type="submit" className="mt-4 px-4 py-2 bg-green-500 text-white rounded">Create Post</button>
      </form>

      {/* Post List */}
      <div className="mt-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} isAdmin={isAdmin} userId={userId} setPosts={setPosts} />
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
