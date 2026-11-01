import { Link } from "react-router-dom";
import "../styles/footer.css";
const Footer = () => {
  return (
    <footer className="home-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <h2>
            Mood Tracker <span>♡</span>
          </h2>
          <p>A little place to grow, reflect, and embrace every emotion.</p>
        </div>

        <div className="footer-links">
          <h3>Explore</h3>
          <Link to="/">Home</Link>
          <Link to="/feeling">Feeling</Link>
          <Link to="/ava">Profile</Link>
        </div>

        <div className="footer-links">
          <h3>Get in touch</h3>
          <Link to="/contact">Contact Us</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Made with love ♡</p>
        <p>© {new Date().getFullYear()} Mood Tracker. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
