import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Nav from "./components/Nav";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Feeling from "./pages/Feeling";
import Calendar from "./pages/Calendar";
import Contact from "./pages/Contact";
import Welcome from "./pages/Welcome";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Loading from "./pages/Loading";
import Avatar from "./components/Avatar/Avatar";

const App = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const isWelcomePage =
    location.pathname === "/" ||
    location.pathname === "/signin" ||
    location.pathname === "/signup";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Show the loading screen before the app.
  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {!isWelcomePage && <Nav />}

      <main className="mx-auto w-full px-4 py-6">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/feeling" element={<Feeling />} />
          <Route path="/cal" element={<Calendar />} />
          <Route path="/contact" element={<Contact />} />

          {/* Avatar editor */}
          <Route path="/ava" element={<Avatar />} />

          {/* Keep this last */}
          {/* <Route path="*" element={<Welcome />} /> */}
        </Routes>
      </main>
    </>
  );
};

export default App;
