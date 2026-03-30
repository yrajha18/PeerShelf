import { supabase } from "./supabaseClient";

// Add to wishlist
export const addToWishlist = async (user_id, book_id) => {
  return await supabase.from("wishlist").insert([{ user_id, book_id }]);
};

// Remove from wishlist
export const removeFromWishlist = async (user_id, book_id) => {
  return await supabase
    .from("wishlist")
    .delete()
    .match({ user_id, book_id });
};

// 🔥 Get wishlist with book details
export const getWishlist = async (user_id) => {
  return await supabase
    .from("wishlist")
    .select(`
      id,
      book_id,
      books (*)
    `)
    .eq("user_id", user_id);
};