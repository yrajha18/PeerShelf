import { supabase } from "./supabaseClient";

// CREATE BOOK
export const createBook = async (book) => {
  const { data, error } = await supabase
    .from("books")
    .insert([book])
    .select(); // 👈 important

  console.log("INSERT RESULT:", data, error);

  return { data, error };
};

// GET BOOKS (only logged-in user)
export const getBooks = async () => {
  return await supabase.from("books").select("*");

  console.log("FETCH RESULT:", data, error);

  return { data, error };
};