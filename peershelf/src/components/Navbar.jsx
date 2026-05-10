import { Link } from "react-router-dom";
import { signOut } from "../services/authService";
import { useState } from "react";

const Navbar = ({ user }) => {
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/login";
  };

  const closeMenu = () => setOpen(false);

  return (
    <nav className="bg-gray-900 text-white px-4 sm:px-6 py-4">

      <div className="flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" className="text-xl font-bold">
          PeerShelf 
        </Link>

        {/* 👀 GUEST MODE LABEL */}
        {!user && (
          <span className="hidden sm:block text-sm text-gray-400">
            Guest Mode 
          </span>
        )}

        {/* MOBILE MENU BUTTON */}
        <button
          className="sm:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        {/* DESKTOP MENU */}
        <div className="hidden sm:flex items-center gap-4">

          <Link to="/" className="hover:text-gray-300">Home</Link>

          {!user ? (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="hover:text-gray-300">Register</Link>
            </>
          ) : (
            <>
              <Link to="/create" className="hover:text-gray-300">Add Book</Link>
              <Link to="/wishlist" className="hover:text-gray-300">Wishlist</Link>
              <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
              <Link to="/inbox" className="hover:text-gray-300">Inbox</Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* 📱 MOBILE MENU */}
      {open && (
        <div className="mt-4 flex flex-col gap-3 sm:hidden">

          <Link to="/" onClick={closeMenu}>Home</Link>

          {!user ? (
            <>
              <p className="text-sm text-gray-400">Guest Mode 👀</p>

              <Link to="/login" onClick={closeMenu}>Login</Link>
              <Link to="/register" onClick={closeMenu}>Register</Link>
            </>
          ) : (
            <>
              <Link to="/create" onClick={closeMenu}>Add Book</Link>
              <Link to="/wishlist" onClick={closeMenu}>Wishlist</Link>
              <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
              <Link to="/inbox" onClick={closeMenu}>Inbox</Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-2 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;