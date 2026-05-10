import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import {
  addToWishlist,
  removeFromWishlist,
} from "../services/wishlistService";
import { useNavigate } from "react-router-dom";

const BookCard = ({ book }) => {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  // 🔥 check if already in wishlist
  useEffect(() => {
    checkWishlist();
  }, [book.id]);

  const checkWishlist = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("book_id", book.id)
      .maybeSingle();

    if (!error && data) setLiked(true);
  };

  const handleWishlist = async (e) => {
    e.stopPropagation();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 🔒 Guest mode → redirect instead of alert
    if (!user) {
      navigate("/login");
      return;
    }

    if (!liked) {
      await addToWishlist(user.id, book.id);
      setLiked(true);
    } else {
      await removeFromWishlist(user.id, book.id);
      setLiked(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/book/${book.id}`)}
      className="relative cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
    >
      {/* 📦 STATUS BADGE */}
      <span
        className={`absolute top-2 left-2 px-2 py-1 text-xs rounded text-white ${
          book.status === "sold" ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {book.status === "sold" ? "Sold" : "Available"}
      </span>

      {/* 📸 IMAGE */}
      <img
        src={book.image_url || "https://via.placeholder.com/150"}
        alt="book"
        className="w-full h-48 object-cover"
      />

      {/* 📄 CONTENT */}
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{book.title}</h3>
        <p className="text-sm text-gray-500">{book.author}</p>

        <div className="flex justify-between items-center mt-3">
          <p className="text-green-600 font-bold">₹ {book.price}</p>

          {/* ❤️ WISHLIST */}
          <button
            onClick={handleWishlist}
            className="text-red-500 text-xl hover:scale-110 transition"
          >
            {liked ? "❤️" : "🤍"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;