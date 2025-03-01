import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Welcome to Trading Hub</h1>
      <Link to="/login" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Login</Link>
      <Link to="/signup" className="mt-2 px-4 py-2 bg-green-500 text-white rounded">Sign Up</Link>
    </div>
  );
};

export default Home;
