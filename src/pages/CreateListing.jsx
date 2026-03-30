import { useState } from "react";
import { createBook } from "../services/bookService";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(""); // 🔥 NEW
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user;

    if (!user) {
      alert("Login first");
      return;
    }

    let image_url = "";

    // 📸 Upload image
    if (image) {
      const fileName = `${user.id}-${Date.now()}-${image.name}`;

      const { error: uploadError } = await supabase.storage
        .from("books")
        .upload(fileName, image, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        alert(uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("books")
        .getPublicUrl(fileName);

      image_url = data.publicUrl;
    }

    // 📦 Final book data
    const bookData = {
      title,
      author,
      price: Number(price),
      user_id: user.id,
      image_url,
      category, 
      status: "available",
    };

    const { error } = await createBook(bookData);

    if (error) {
      alert(error.message);
    } else {
      alert("Book added 📚");
      navigate("/");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Book 📚</h2>

      {/* TITLE */}
      <input
        placeholder="Title"
        className="block w-full mb-3 p-2 border rounded"
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* AUTHOR */}
      <input
        placeholder="Author"
        className="block w-full mb-3 p-2 border rounded"
        onChange={(e) => setAuthor(e.target.value)}
      />

      {/* PRICE */}
      <input
        placeholder="Price"
        type="number"
        className="block w-full mb-3 p-2 border rounded"
        onChange={(e) => setPrice(e.target.value)}
      />

      {/* 🔥 CATEGORY DROPDOWN */}
      <select
        className="block w-full mb-3 p-2 border rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        <option value="fiction">Fiction</option>
        <option value="academic">Academic</option>
        <option value="programming">Programming</option>
      </select>

      {/* IMAGE */}
      <input
        type="file"
        className="mb-4"
        onChange={(e) => setImage(e.target.files[0])}
      />

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
      >
        Add Book
      </button>
    </div>
  );
};

export default CreateListing;