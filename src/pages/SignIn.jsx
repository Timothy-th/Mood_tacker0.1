import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/signIn.css";

async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

const SignIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const users = JSON.parse(localStorage.getItem("moodGardenUsers") || "[]");

      const cleanEmail = email.trim().toLowerCase();
      const user = users.find((item) => item.email === cleanEmail);

      if (!user) {
        setError("Account not found. Please sign up first.");
        return;
      }

      const passwordHash = await hashPassword(password);

      if (passwordHash !== user.passwordHash) {
        setError("Incorrect password. Please try again.");
        return;
      }

      localStorage.setItem(
        "moodGardenCurrentUser",
        JSON.stringify({
          id: user.id,
          username: user.username,
          email: user.email,
        }),
      );

      navigate("/home", { replace: true });
    } catch {
      setError("Unable to sign in. Please try again.");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1 className="font-main">Welcome Back 🌷</h1>
        <p>Your little garden is waiting for you.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="signin-email">Email</label>
          <input
            id="signin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="signin-password">Password</label>
          <input
            id="signin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="welcome-btn primary">
            Sign In
          </button>
        </form>

        <p className="auth-footer">
          New to Mood Garden? <Link to="/signup">Create an account</Link>
        </p>

        <p className="back-link">
          <Link to="/">← Back to welcome</Link>
        </p>
      </section>
    </main>
  );
};

export default SignIn;
