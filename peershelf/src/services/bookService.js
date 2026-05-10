import API_BASE_URL from "../config";
const ENDPOINT = `${API_BASE_URL}/api/books`;
import { supabase } from "./supabaseClient";

// CREATE BOOK
export const createBook = async (book) => {
  const { data, error } = await supabase
    .from("books")
    .insert([book])
    .select();
  return { data, error };
};

// GET BOOKS WITH FILTERS (via FastAPI)
export const getBooks = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${ENDPOINT}?${query}`);
  
  if (!response.ok) return { data: [], error: "Failed to fetch" };
  
  const data = await response.json();
  return { data, error: null };
};