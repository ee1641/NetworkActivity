import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

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
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      setRole(data?.role || null);
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
