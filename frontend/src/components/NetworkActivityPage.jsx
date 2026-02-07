import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import NavigationBar from "./NavigationBar";
import DashboardKPIs from "./DashboardKPIs";

export default function NetworkActivityPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("all");

  useEffect(() => {
    fetchPosts(timeRange);
  }, [timeRange]);

  const fetchPosts = (range) => {
    setLoading(true);
    setError(null);

    const url =
      range === "all"
        ? "http://localhost:8080/api/posts"
        : `http://localhost:8080/api/posts?range=${range}`;

    fetch(url)
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
  };

  const handleRefresh = () => {
    fetchPosts(timeRange);
  };

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
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Recent Posts
          </h2>

          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700 rounded-lg border border-slate-600/50 hover:border-blue-500/50 transition-all duration-200 text-sm font-medium text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span className={loading ? "animate-spin" : ""}>🔄</span>
              Refresh
            </button>

            {/* Time Range Filter Buttons */}
            <div className="flex gap-2">
              {[
                { value: "24h", label: "Last 24h" },
                { value: "7d", label: "Last 7 days" },
                { value: "30d", label: "Last 30 days" },
                { value: "all", label: "All Time" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setTimeRange(filter.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeRange === filter.value
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                      : "bg-slate-800/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center text-blue-400 text-xl animate-pulse">
            Loading posts...
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-6 rounded-lg text-center">
            Error: {error}
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-slate-400 text-lg mb-2">
              No posts found for this time range
            </p>
            {timeRange !== "all" && (
              <button
                onClick={() => setTimeRange("all")}
                className="mt-4 text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              >
                View all posts
              </button>
            )}
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
