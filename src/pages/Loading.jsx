import React from "react";
import "../styles/loading.css";

const Loading = () => {
  return (
    <section className="loading-screen">
      <div className="loading-content">
        <div className="loading-garden-icon" aria-hidden="true">
          <img
            src="/public/icons/doodle-color-20-heart-in-reveal.gif"
            alt="dendelion"
          />
        </div>

        <h1 className="loading-title">Mood Garden</h1>

        <p className="loading-message">A little garden for your feelings...</p>

        <div className="loading-dots" aria-label="Loading">
          <span />
          <span />
          <span />
        </div>

        <p className="loading-status">Growing your little world...</p>
      </div>
    </section>
  );
};

export default Loading;
