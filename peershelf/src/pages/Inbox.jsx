import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { getConversations } from "../services/chatService";
import { useNavigate } from "react-router-dom";

const Inbox = () => {
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    const { data } = await getConversations(user.id);

    // remove duplicates (same chat)
    const uniqueChats = [];
    const seen = new Set();

    data?.forEach((msg) => {
      const otherUser =
        msg.sender_id === user.id
          ? msg.receiver_id
          : msg.sender_id;

      const key = `${msg.book_id}-${otherUser}`;

      if (!seen.has(key)) {
        seen.add(key);
        uniqueChats.push(msg);
      }
    });

    setChats(uniqueChats);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Inbox 💬</h2>

      {chats.length === 0 ? (
        <p>No conversations yet 😢</p>
      ) : (
        chats.map((chat, i) => {
          const otherUser =
            chat.sender_id === user?.id
              ? chat.receiver_id
              : chat.sender_id;

          return (
            <div
              key={i}
              onClick={() =>
                navigate(`/chat/${chat.book_id}/${otherUser}`)
              }
              className="p-4 border mb-2 rounded cursor-pointer hover:bg-gray-100"
            >
              <p className="font-semibold">
                Book ID: {chat.book_id}
              </p>
              <p className="text-gray-600">
                {chat.content}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Inbox;