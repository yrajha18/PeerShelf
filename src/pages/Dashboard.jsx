import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const Dashboard = () => {
  const [stats, setStats] = useState({
    books: 0,
    wishlist: 0,
    messages: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // 📚 My books
    const { count: bookCount } = await supabase
      .from("books")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    // ❤️ Wishlist
    const { count: wishlistCount } = await supabase
      .from("wishlist")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    // 💬 Messages received
    const { count: messageCount } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("receiver_id", user.id);

    setStats({
      books: bookCount || 0,
      wishlist: wishlistCount || 0,
      messages: messageCount || 0,
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Dashboard 📊</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h3 className="text-gray-500">My Listings</h3>
          <p className="text-2xl font-bold mt-2">{stats.books}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h3 className="text-gray-500">Wishlist</h3>
          <p className="text-2xl font-bold mt-2">{stats.wishlist}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h3 className="text-gray-500">Messages</h3>
          <p className="text-2xl font-bold mt-2">{stats.messages}</p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;