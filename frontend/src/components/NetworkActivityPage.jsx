import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import NavigationBar from "./NavigationBar";
import DashboardKPIs from "./DashboardKPIs";

export default function NetworkActivityPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/posts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <NavigationBar />

      <div className="max-w-7xl mx-auto p-8">
        {/* KPI Dashboard Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Network Overview
          </h2>
          <DashboardKPIs />
        </div>

        {/* Posts Section */}
        <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Recent Posts
        </h2>

        {loading && (
          <div className="text-center text-blue-400 text-xl animate-pulse">
            Loading posts...
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-lg mb-8">
            <h3 className="font-bold mb-2">Error loading posts</h3>
            <p>{error}</p>
            <p className="text-sm mt-2 opacity-75">
              Make sure the backend is running on port 8080
            </p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:transform hover:-translate-y-1 hover:shadow-xl hover:border-blue-500/30 transition-all duration-300"
              >
                <h2 className="text-xl font-semibold text-slate-100 mb-3">
                  {post.title}
                </h2>
                <p className="text-slate-400 mb-4 line-clamp-3">
                  {post.content}
                </p>
                <div className="flex justify-between items-center text-xs text-slate-500 pt-4 border-t border-slate-700/50">
                  <span className="font-mono">ID: {post.id}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
