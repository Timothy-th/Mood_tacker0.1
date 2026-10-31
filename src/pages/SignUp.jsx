import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/signUp.css";

async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

const SignUp = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanUsername || !cleanEmail || !password) {
      setError("Please fill in every field.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem("moodGardenUsers") || "[]");

      const exists = users.some(
        (user) => user.email?.trim().toLowerCase() === cleanEmail,
      );

      if (exists) {
        setError(
          "This email is already registered. Please sign in or use another email.",
        );
        return;
      }

      const passwordHash = await hashPassword(password);

      const newUser = {
        id: crypto.randomUUID(),
        username: cleanUsername,
        email: cleanEmail,
        passwordHash,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);

      localStorage.setItem("moodGardenUsers", JSON.stringify(users));
      localStorage.setItem(
        "moodGardenCurrentUser",
        JSON.stringify({
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        }),
      );

      navigate("/home", { replace: true });
    } catch {
      setError("Unable to create your account. Please try again.");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1 className="font-main">Create Your Garden </h1>
        <p>Let's make a little space for your feelings.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />

          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="welcome-btn primary">
            Create Account
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </section>
    </main>
  );
};

export default SignUp;
