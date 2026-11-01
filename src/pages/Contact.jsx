import ContactForm from "../components/contact/ContactForm";
import Footer from "../components/Footer";

import "../styles/contact.css";
import "../styles/cal_layout.css";

const Contact = () => {
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <main className="contact-page" id="to-top">
        <div className="contact-page-container">
          {/* Left Section - Background Image */}
          <section className="contact-left-section">
            <div className="contact-left-content">
              <h2>Let's Connect!</h2>
              <p>
                Every thought, story, and feeling deserves to be heard. I'd love
                to hear from you.
              </p>
            </div>
          </section>

          {/* Right Section - Contact Form */}
          <section className="contact-right-section">
            <ContactForm />
          </section>
        </div>
      </main>

      <footer className="contact-footer">
        <div className="contact-footer-content">
          <h3 className="contact-footer-title">Thank you for reaching out!</h3>

          <p className="contact-footer-description">
            Your thoughts and feelings matter. Whether it’s feedback, a
            question, or just something you’d like to share, I’ll get back to
            you as soon as I can. Until then, take care and keep listening to
            your heart.
          </p>

          <p className="contact-footer-copyright">
            © 2026 Mood Tracker Project
          </p>
        </div>
      </footer>
      {/* Back to Top */}
      <div className="calendar-back-to-top">
        <button
          type="button"
          onClick={handleBackToTop}
          aria-label="Back to top"
        >
          <img
            src="/icons/wired-lineal-259-share-square-arrow-in-reveal.gif"
            alt="to top"
          />
        </button>
      </div>

      <Footer />
    </>
  );
};

export default Contact;
