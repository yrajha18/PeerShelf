import API_BASE_URL from "../config";

const ENDPOINT = `${API_BASE_URL}/api/wishlist`;

// Add to wishlist
export const addToWishlist = async (user_id, book_id) => {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, book_id }),
  });
  return await response.json();
};

// Remove from wishlist
export const removeFromWishlist = async (user_id, book_id) => {
  const response = await fetch(`${ENDPOINT}/${user_id}/${book_id}`, {
    method: "DELETE",
  });
  return await response.json();
};

// Get wishlist with book details
export const getWishlist = async (user_id) => {
  const response = await fetch(`${API_BASE_URL}/${user_id}`);
  if (!response.ok) return { data: [] };
  const data = await response.json();
  return { data };
};