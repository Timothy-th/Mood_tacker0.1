import { Link, Navigate } from "react-router-dom";
import "../styles/welcome.css";

const Welcome = () => {
  const currentUser = localStorage.getItem("moodGardenCurrentUser");

  if (currentUser) {
    return <Navigate to="/home" replace />;
  }

  return (
    <main className="welcome-page">
      <section className="welcome-card">
        <div className="welcome-flower">🌷</div>

        <h1 className="font-main">Welcome to Mood Garden</h1>

        <p>
          A little garden for your feelings, thoughts, and everyday moments.
        </p>

        <h2>Do you already have an account?</h2>

        <div className="welcome-actions">
          <Link to="/signin" className="welcome-btn primary">
            Yes, I do
          </Link>

          <Link to="/signup" className="welcome-btn secondary">
            No, not yet
          </Link>
        </div>

        <p className="welcome-note">
          🌱 Every feeling deserves a place to grow.
        </p>
      </section>
    </main>
  );
};

export default Welcome;
