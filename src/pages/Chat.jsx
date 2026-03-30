import { useEffect, useState, useRef } from "react";
import { supabase } from "../services/supabaseClient";
import { sendMessage, getMessages } from "../services/chatService";
import { useParams } from "react-router-dom";

const Chat = () => {
  const { bookId, receiverId } = useParams();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);
  const [receiverStatus, setReceiverStatus] = useState(null);

  const bottomRef = useRef(null); // 🔥 for auto-scroll

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMsg = payload.new;

          if (
            newMsg.book_id === bookId &&
            (newMsg.sender_id === user.id ||
              newMsg.receiver_id === user.id)
          ) {
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, bookId]);

  // 🔥 AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const init = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    const { data } = await getMessages(user.id, receiverId, bookId);
    setMessages(data || []);

    fetchReceiver();
  };

  const fetchReceiver = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", receiverId)
      .single();

    setReceiverStatus(data);
  };

  const handleSend = async () => {
    if (!text.trim()) return;

    const message = {
      sender_id: user.id,
      receiver_id: receiverId,
      book_id: bookId,
      content: text,
    };

    await sendMessage(message);
    setText("");
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-3 sm:p-4">

      {/* 🟢 HEADER */}
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <h2 className="text-lg font-semibold">Chat 💬</h2>
        <p className="text-xs sm:text-sm text-gray-500">
          {receiverStatus?.is_online ? "🟢 Online" : "⚫ Offline"}
        </p>
      </div>

      {/* 💬 MESSAGES */}
      <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-3 sm:p-4 shadow-inner">
        {messages.map((msg, i) => {
          const isMe = msg.sender_id === user?.id;

          return (
            <div
              key={i}
              className={`flex mb-2 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg max-w-[75%] text-sm sm:text-base ${
                  isMe
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        {/* 🔥 AUTO SCROLL TARGET */}
        <div ref={bottomRef}></div>
      </div>

      {/* ✍️ INPUT */}
      <div className="flex gap-2 mt-2">
        <input
          className="flex-1 border rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition text-sm sm:text-base"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;