import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import {
  getWishlist,
  removeFromWishlist,
} from "../services/wishlistService";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data } = await getWishlist(user.id);
    setItems(data || []);
  };

  const handleRemove = async (book_id) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await removeFromWishlist(user.id, book_id);

    // refresh
    fetchWishlist();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Wishlist ❤️</h2>

      {items.length === 0 ? (
        <p>No saved books yet 😢</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => {
            const book = item.books;

            return (
              <div
                key={item.id}
                className="bg-white shadow rounded-xl overflow-hidden"
              >
                <img
                  src={book.image_url || "https://via.placeholder.com/150"}
                  className="w-full h-40 object-cover"
                />

                <div className="p-4">
                  <h3 className="font-semibold">{book.title}</h3>
                  <p className="text-gray-500">{book.author}</p>
                  <p className="text-green-600 font-bold">₹ {book.price}</p>

                  <div className="flex justify-between mt-3">
                    <button
                      onClick={() => navigate(`/book/${book.id}`)}
                      className="text-blue-600"
                    >
                      View
                    </button>

                    <button
                      onClick={() => handleRemove(book.id)}
                      className="text-red-500"
                    >
                      Remove ❌
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;