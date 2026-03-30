import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getBooks } from "../services/bookService";
import BookCard from "../components/BookCard";

const Home = () => {
  const [books, setBooks] = useState([]);

  // 🔍 filters
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const { data, error } = await getBooks();
    if (!error) setBooks(data);
  };

  // 🔍 FILTERING
  let filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());

    const matchesPrice =
      maxPrice === "" || book.price <= Number(maxPrice);

    const matchesCategory =
      category === "" || book.category === category;

    return matchesSearch && matchesPrice && matchesCategory;
  });

  // 🔄 SORTING
  if (sortBy === "low") {
    filteredBooks.sort((a, b) => a.price - b.price);
  } else if (sortBy === "high") {
    filteredBooks.sort((a, b) => b.price - a.price);
  } else if (sortBy === "new") {
    filteredBooks.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }

  return (
    <div className="p-4 sm:p-6 w-full max-w-[1400px] mx-auto">

      {/* 🔥 HEADER */}
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Explore Books
      </h2>

      {/* 🔍 SEARCH */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search books..."
          className="flex-1 min-w-[200px] p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max price"
          className="w-full sm:w-40 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {/* 🎯 FILTER + SORT */}
      <div className="flex flex-wrap gap-4 mb-8">
        <select
          className="p-3 border rounded-lg shadow-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
          <option value="new">Newest</option>
        </select>

        <select
          className="p-3 border rounded-lg shadow-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="fiction">Fiction</option>
          <option value="academic">Academic</option>
          <option value="programming">Programming</option>
        </select>
      </div>

      {/* 📚 BOOK GRID */}
      {filteredBooks.length === 0 ? (
        <p className="text-gray-500">No matching books 😢</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <BookCard book={book} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;