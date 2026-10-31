import { useState } from "react";
import "../../styles/contactForm.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
    agree: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.repeatPassword) {
      setError("Your passwords do not match.");
      return;
    }

    if (!formData.agree) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    // UI demonstration only — connect your backend to create an account.
    setSuccess("Your form has been validated successfully!");
  };

  const socialLinks = [
    {
      name: "Google",
      image: "/image/icons8-google-96-removebg-preview.png",
      href: "#",
    },
    {
      name: "Facebook",
      image: "/image/icons8-facebook-96-removebg-preview.png",
      href: "#",
    },
    {
      name: "Twitter",
      image: "/image/icons8-twitter-circled-96-removebg-preview.png",
      href: "#",
    },
    {
      name: "Discord",
      image: "/image/icons8-discord-96-removebg-preview.png",
      href: "#",
    },
  ];

  return (
    <section className="contact-form-page">
      {/* Left panel */}
      <div className="contact-left-panel">
        <h1 className="contact-main-title">
          A Message from Your Mood
          <img
            src="/image/wired-lineal-1845-rose-hover-pinch.gif"
            alt="Animated rose"
            className="contact-rose-animation"
          />
        </h1>

        <div id="user-avatar" className="contact-avatar-box">
          {/* Add your selected avatar here later. */}
          <p className="contact-avatar-placeholder">
            Your avatar will appear here ♡
          </p>
        </div>

        <p className="contact-description">
          Every feeling has a story. Take a breath, listen to yourself, and
          remember that your feelings matter.
        </p>
      </div>

      {/* Right panel */}
      <div className="contact-right-panel">
        <h2 className="contact-form-title">Need to Talk? We’re Here</h2>

        {/* Social icons */}
        <div className="contact-social-links">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              aria-label={`Continue with ${social.name}`}
              className="contact-social-link"
            >
              <img
                src={social.image}
                alt={social.name}
                className="contact-social-icon"
              />
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="contact-divider">
          <div className="contact-divider-line" />
          <span className="contact-divider-text">Or</span>
          <div className="contact-divider-line" />
        </div>

        {/* Contact form */}
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="contact-form-row">
            <input
              type="text"
              name="name"
              placeholder="Name"
              aria-label="Name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              className="contact-input"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              aria-label="Email Address"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="contact-input"
              required
            />
          </div>

          <div className="contact-form-row">
            <input
              type="password"
              name="password"
              placeholder="Password"
              aria-label="Password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              className="contact-input"
              minLength={8}
              required
            />

            <input
              type="password"
              name="repeatPassword"
              placeholder="Repeat Password"
              aria-label="Repeat Password"
              autoComplete="new-password"
              value={formData.repeatPassword}
              onChange={handleChange}
              className="contact-input"
              minLength={8}
              required
            />
          </div>

          <label className="contact-terms">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              className="contact-checkbox"
              required
            />

            <span>
              I agree to the{" "}
              <a href="#terms" className="contact-policy-link">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#privacy" className="contact-policy-link">
                Privacy Policy
              </a>
              .
            </span>
          </label>

          {error && (
            <p role="alert" className="contact-error">
              {error}
            </p>
          )}

          {success && (
            <p role="status" className="contact-success">
              {success}
            </p>
          )}

          <button type="submit" className="contact-submit-btn">
            Sign Up
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
