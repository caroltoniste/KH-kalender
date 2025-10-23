"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { startOfMonth, endOfMonth } from "date-fns";
import { toast } from "sonner";
import type { Post } from "@/types";
import type { PostSchemaType } from "@/lib/validations/post-schema";
import type { Database } from "@/lib/supabase/database.types";
import { TEAM_NAME } from "@/lib/constants";
import type { SupabaseClient } from "@supabase/supabase-js";

export function usePosts(year: number, month: number) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase: SupabaseClient<Database> = createClient();

  // Fetch posts for the current month
  const fetchPosts = useCallback(async () => {
    try {
      const monthStart = startOfMonth(new Date(year, month, 1));
      const monthEnd = endOfMonth(new Date(year, month, 1));

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("team", TEAM_NAME)
        .gte("datetime", monthStart.toISOString())
        .lte("datetime", monthEnd.toISOString())
        .order("datetime", { ascending: true });

      if (error) throw error;

      setPosts((data as Post[]) || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Viga postituste laadimisel");
    } finally {
      setLoading(false);
    }
  }, [year, month, supabase]);

  // Initial fetch
  useEffect(() => {
    setLoading(true);
    fetchPosts();
  }, [fetchPosts]);

  // Real-time subscription
  useEffect(() => {
    const monthStart = startOfMonth(new Date(year, month, 1));
    const monthEnd = endOfMonth(new Date(year, month, 1));

    const channel = supabase
      .channel("tasks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `team=eq.${TEAM_NAME}`,
        },
        (payload) => {
          console.log("Real-time update:", payload);

          if (payload.eventType === "INSERT") {
            const newPost = payload.new as Post;
            const postDate = new Date(newPost.datetime);
            
            // Only add if within current month
            if (postDate >= monthStart && postDate <= monthEnd) {
              setPosts((prev) => [...prev, newPost]);
            }
          } else if (payload.eventType === "UPDATE") {
            const updatedPost = payload.new as Post;
            setPosts((prev) =>
              prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
            );
          } else if (payload.eventType === "DELETE") {
            const deletedPost = payload.old as Post;
            setPosts((prev) => prev.filter((post) => post.id !== deletedPost.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [year, month, supabase]);

  // Add post
  const addPost = async (data: PostSchemaType) => {
    try {
      // Validate required fields
      if (!data.title || !data.datetime || !data.time || !data.channels || data.channels.length === 0) {
        toast.error("Täida kõik kohustuslikud väljad");
        return;
      }

      const datetime = `${data.datetime}T${data.time}:00`;

      // Prepare insert payload
      const insertPayload = {
        team: TEAM_NAME,
        title: data.title,
        type: data.type,
        datetime: datetime,
        time: data.time,
        owner: data.owner || null,
        channels: data.channels,
        notes: data.notes || null,
        copy: data.copy || null,
        materials: data.materials || null,
        done: false,
      };

      // Use type assertion to bypass Supabase type inference issue
      const { data: inserted, error } = await (supabase
        .from("tasks")
        .insert(insertPayload as any)
        .select()
        .single());

      if (error) throw error;

      toast.success("Postitus lisatud! 😺");
      
      // Optimistic update
      if (inserted) {
        setPosts((prev) => [...prev, inserted as Post]);
      }
    } catch (error) {
      console.error("Error adding post:", error);
      toast.error("Viga postituse lisamisel");
    }
  };

  // Update post
  const updatePost = async (id: string, updates: Partial<Post>) => {
    try {
      // Validate ID
      if (!id) {
        toast.error("Vigane postituse ID");
        return;
      }

      // Validate that we have something to update
      if (Object.keys(updates).length === 0) {
        return;
      }

      // Prepare update payload
      const updatePayload = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      // Use type assertion to bypass Supabase type inference issue
      const { error } = await ((supabase as any)
        .from("tasks")
        .update(updatePayload)
        .eq("id", id));

      if (error) throw error;

      toast.success("Postitus uuendatud");

      // Optimistic update
      setPosts((prev) =>
        prev.map((post) => (post.id === id ? { ...post, ...updates, updated_at: new Date().toISOString() } : post))
      );
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Viga postituse uuendamisel");
    }
  };

  // Delete post
  const deletePost = async (id: string) => {
    try {
      // Validate ID
      if (!id) {
        toast.error("Vigane postituse ID");
        return;
      }

      const { error } = await supabase.from("tasks").delete().eq("id", id);

      if (error) throw error;

      toast.success("Postitus kustutatud");

      // Optimistic update
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Viga postituse kustutamisel");
    }
  };

  return {
    posts,
    loading,
    addPost,
    updatePost,
    deletePost,
    refetch: fetchPosts,
  };
}
