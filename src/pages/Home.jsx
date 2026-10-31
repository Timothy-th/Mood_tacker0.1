import { Link } from "react-router-dom";
import WeeklyMoodChart from "../components/home/WeeklyMoodChart";
import "../styles/home.css";

const Home = () => {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("moodGardenCurrentUser") || "null");
  } catch {
    user = null;
  }

  const userName = user?.name || user?.username || "Friend";

  return (
    <main className="home-page">
      {/* HERO SECTION */}
      <section className="home-hero">
        <div className="hero-content">
          <span className="hero-tag">♡ YOUR LITTLE SAFE SPACE ♡</span>

          <h1>
            A Little Garden
            <br />
            for Your Feelings
          </h1>

          <p>
            Welcome back, {userName}! Every emotion deserves a place to grow.
            Take a moment for yourself, explore your feelings, and let your
            little garden bloom.
          </p>

          <Link to="/feeling" className="hero-button">
            Track My Mood <span>♡</span>
          </Link>
        </div>

        <div className="hero-decoration">
          <div className="hero-circle">
            <span>🌷</span>
          </div>
          <span className="hero-flower flower-one">🌼</span>
          <span className="hero-flower flower-two">🌸</span>
          <span className="hero-flower flower-three">🍃</span>
          <span className="hero-sparkle sparkle-one">✦</span>
          <span className="hero-sparkle sparkle-two">✧</span>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="home-about">
        <div className="about-decoration">☘</div>

        <div className="about-content">
          <span className="section-label">A LITTLE ABOUT US</span>

          <h2>What is Mood Tracker?</h2>

          <p>
            Mood Tracker is your personal space to understand and embrace your
            emotions. Record how you feel, write down your thoughts, and look
            back on your emotional journey.
          </p>

          <p>
            There are no right or wrong feelings here. Whether your day is full
            of sunshine or rain, every little moment matters.
          </p>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="home-quick-links">
        <div className="home-section-heading">
          <span className="section-label">EXPLORE YOUR SPACE</span>
          <h2>Where would you like to go? ♡</h2>
          <p>Choose a little corner of your emotional garden.</p>
        </div>

        <div className="quick-link-grid">
          {/* FEELING CARD */}
          <Link to="/feeling" className="quick-link-card">
            <div className="quick-link-image feeling-image">
              <img
                src="/images/feeling-card.png"
                alt="A cozy illustration representing emotions and journaling"
              />
              <span className="quick-link-icon">🌷</span>
            </div>

            <div className="quick-link-content">
              <span className="quick-link-number">01 · YOUR EMOTIONS</span>
              <h3>How are you feeling?</h3>
              <p>
                Take a moment to check in with yourself and record your current
                emotion.
              </p>
              <span className="quick-link-action">
                Choose your feeling <span>→</span>
              </span>
            </div>
          </Link>

          {/* PROFILE CARD */}
          <Link to="/ava" className="quick-link-card">
            <div className="quick-link-image profile-image">
              <img
                src="/images/profile-card.png"
                alt="A cozy illustrated personal garden"
              />
              <span className="quick-link-icon">🪴</span>
            </div>

            <div className="quick-link-content">
              <span className="quick-link-number">
                02 · YOUR PERSONAL SPACE
              </span>
              <h3>Visit your garden</h3>
              <p>
                Make yourself at home, personalize your space, and leave little
                notes for yourself.
              </p>
              <span className="quick-link-action">
                Visit my profile <span>→</span>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* WEEKLY GRAPH */}
      <section className="home-weekly-section">
        <div className="home-section-heading">
          <span className="section-label">YOUR EMOTIONAL JOURNEY</span>
          <h2>A Week in Your Feelings ♡</h2>
          <p>
            Every little feeling tells a story. See how your week has been
            going.
          </p>
        </div>

        <WeeklyMoodChart />
      </section>

      {/* FOOTER */}
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
    </main>
  );
};

export default Home;
