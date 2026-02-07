import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "../hooks/useUserRole";

export default function NavigationBar() {
  const navigate = useNavigate();
  const { isAdmin, loading } = useUserRole();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Admin shield icon */}
          <div className="flex items-center space-x-4">
            {!loading && isAdmin && (
              <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-1.5">
                {/* Shield SVG Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-blue-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium text-blue-400">Admin</span>
              </div>
            )}
          </div>

          {/* Center - App title */}
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Network Activity
            </h1>
          </div>

          {/* Right side - Logout button */}
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg border border-slate-600/50 hover:border-slate-500 transition-all duration-200 text-sm font-medium text-slate-300 hover:text-white"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
