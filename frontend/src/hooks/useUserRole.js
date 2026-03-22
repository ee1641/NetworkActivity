import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

const API_BASE = "http://localhost:8080";

export function useUserRole() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserRole();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchUserRole();
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchUserRole() {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setRole(null);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/api/users/me/role`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setRole(data.role || null);
    } catch (err) {
      console.error("Error fetching user role:", err);
      setError(err.message);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }

  return { role, loading, error, isAdmin: role === "admin" };
}
