import { supabase } from "./supabaseClient";

// Send message
export const sendMessage = async (message) => {
  return await supabase.from("messages").insert([message]);
};

// Get messages between users
export const getMessages = async (user1, user2, bookId) => {
  return await supabase
    .from("messages")
    .select("*")
    .or(
      `sender_id.eq.${user1},receiver_id.eq.${user1}`
    )
    .eq("book_id", bookId)
    .order("created_at", { ascending: true });
};

export const getConversations = async (userId) => {
  return await supabase
    .from("messages")
    .select("*")
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order("created_at", { ascending: false });
};