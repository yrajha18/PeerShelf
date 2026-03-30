import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchBook();
    getUser();
  }, []);

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchBook = async () => {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("id", id)
      .single();

    if (!error) {
      setBook(data);
    } else {
      console.log("Error fetching book:", error);
    }
  };

  // 🔥 MARK AS SOLD (owner only)
  const markAsSold = async () => {
    await supabase
      .from("books")
      .update({ status: "sold" })
      .eq("id", book.id);

    setBook({ ...book, status: "sold" });
  };

  // 🛒 BUY FLOW
  const handleBuy = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const { error: orderError } = await supabase.from("orders").insert([
      {
        book_id: book.id,
        buyer_id: user.id,
        seller_id: book.user_id,
      },
    ]);

    if (orderError) {
      alert(orderError.message);
      return;
    }

    await supabase
      .from("books")
      .update({ status: "sold" })
      .eq("id", book.id);

    setBook({ ...book, status: "sold" });

    alert("Purchase successful 🎉");
  };

  if (!book) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">

      {/* 🔙 BACK */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-500"
      >
        ← Back
      </button>

      <div className="bg-white shadow rounded-2xl p-6">

        {/* 📸 IMAGE */}
        <div className="relative">
          <img
            src={book.image_url || "https://via.placeholder.com/300"}
            className="w-full h-64 object-cover rounded"
            alt="book"
          />

          <span
            className={`absolute top-2 left-2 px-3 py-1 text-sm rounded text-white ${
              book.status === "sold" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {book.status === "sold" ? "Sold" : "Available"}
          </span>
        </div>

        {/* 📄 DETAILS */}
        <h2 className="text-2xl font-bold mt-4">{book.title}</h2>
        <p className="text-gray-600">{book.author}</p>
        <p className="text-green-600 text-xl mt-2 font-semibold">
          ₹ {book.price}
        </p>

        {book.category && (
          <p className="mt-2 text-sm text-gray-500">
            Category: {book.category}
          </p>
        )}

        {book.description && (
          <p className="mt-3 text-gray-700">{book.description}</p>
        )}

        <div className="mt-3 text-sm text-gray-500 space-y-1">
          {book.condition && <p>Condition: {book.condition}</p>}
          {book.location && <p>Location: {book.location}</p>}
        </div>

        {/* 👤 OWNER */}
        {user?.id === book.user_id && book.status !== "sold" && (
          <button
            onClick={markAsSold}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
          >
            Mark as Sold
          </button>
        )}

        {/* 🔒 GUEST MODE */}
        {!user ? (
          <button
            onClick={() => navigate("/login")}
            className="mt-4 w-full bg-gray-700 text-white px-4 py-2 rounded"
          >
            Login to Buy or Chat 🔒
          </button>
        ) : user.id === book.user_id ? (
          <p className="mt-4 text-gray-500">This is your listing</p>
        ) : book.status === "sold" ? (
          <p className="mt-4 text-red-500 font-semibold">
            This book is already sold
          </p>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 mt-4">

            <button
              onClick={handleBuy}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
            >
              Buy Now 🛒
            </button>

            <button
              onClick={() => navigate(`/chat/${book.id}/${book.user_id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              Contact Seller 💬
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default BookDetail;