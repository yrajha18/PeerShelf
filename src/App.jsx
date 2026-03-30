import { useEffect, useState } from "react";
import { supabase } from "./services/supabaseClient";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateListing from "./pages/CreateListing";
import BookDetail from "./pages/BookDetail";
import Chat from "./pages/Chat";
import Inbox from "./pages/Inbox";
import PageWrapper from "./components/PageWrapper";
import Wishlist from "./pages/Wishlist";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  // 🔥 update online/offline status
  const updateStatus = async (isOnline) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("profiles")
        .update({ is_online: isOnline })
        .eq("id", user.id);
    }
  };

  useEffect(() => {
    // get current user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    // listen auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    // set online
    updateStatus(true);

    // set offline on tab close
    const handleUnload = () => {
      updateStatus(false);
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      listener.subscription.unsubscribe();
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <>
      <Navbar user={user} />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          {/* 🟢 PUBLIC ROUTES (GUEST MODE) */}
          <Route
            path="/"
            element={
              <PageWrapper>
                <Home />
              </PageWrapper>
            }
          />

          <Route
            path="/book/:id"
            element={
              <PageWrapper>
                <BookDetail />
              </PageWrapper>
            }
          />

          {/* 🔐 AUTH ROUTES */}
          <Route
            path="/login"
            element={
              <PageWrapper>
                <Login />
              </PageWrapper>
            }
          />

          <Route
            path="/register"
            element={
              <PageWrapper>
                <Register />
              </PageWrapper>
            }
          />

          {/* 🔒 PROTECTED ROUTES */}
          <Route
            path="/create"
            element={
              user ? (
                <PageWrapper>
                  <CreateListing />
                </PageWrapper>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/chat/:bookId/:receiverId"
            element={
              user ? (
                <PageWrapper>
                  <Chat />
                </PageWrapper>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/inbox"
            element={
              user ? (
                <PageWrapper>
                  <Inbox />
                </PageWrapper>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/wishlist"
            element={
              user ? (
                <PageWrapper>
                  <Wishlist />
                </PageWrapper>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/dashboard"
            element={
              user ? (
                <PageWrapper>
                  <Dashboard />
                </PageWrapper>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;