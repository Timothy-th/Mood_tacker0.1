import ContactForm from "../components/contact/ContactForm";
import "../styles/contact.css";

const Contact = () => {
  return (
    <main className="contact-page">
      <div className="contact-page-container">
        <ContactForm />
      </div>

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

          <a
            href="#to-top"
            aria-label="Back to top"
            className="contact-back-to-top"
          >
            <img
              src="/image/wired-lineal-259-share-arrow-hover-pointing.gif"
              alt=""
            />
          </a>

          <a
            href="https://lordicon.com/"
            target="_blank"
            rel="noreferrer"
            className="contact-icon-credit"
          >
            Icons by Lordicon.com
          </a>
        </div>
      </footer>
    </main>
  );
};

export default Contact;
