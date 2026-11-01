import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/global.css";
import "../styles/profile.css";

// Get storage key for the currently logged-in account
const getUserStorageKey = (key) => {
  try {
    const user = JSON.parse(
      localStorage.getItem("moodGardenCurrentUser") || "null",
    );

    return user?.id ? `${key}_${user.id}` : null;
  } catch (error) {
    console.error("Could not get current user:", error);
    return null;
  }
};

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [savedAvatar, setSavedAvatar] = useState(null);
  const [showBioModal, setShowBioModal] = useState(false);
  const [bioTitle, setBioTitle] = useState("");
  const [bioText, setBioText] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBio, setDraftBio] = useState("");

  // Back to top
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Load account-specific avatar
  useEffect(() => {
    try {
      const femaleKey = getUserStorageKey("femaleAvatar");
      const maleKey = getUserStorageKey("maleAvatar");
      const genderKey = getUserStorageKey("selectedAvatarGender");

      if (!femaleKey || !maleKey || !genderKey) {
        setSavedAvatar(null);
        return;
      }

      const female = localStorage.getItem(femaleKey);
      const male = localStorage.getItem(maleKey);
      const lastGender = localStorage.getItem(genderKey);

      if (lastGender === "female" && female) {
        setSavedAvatar({
          ...JSON.parse(female),
          gender: "female",
        });
      } else if (lastGender === "male" && male) {
        setSavedAvatar({
          ...JSON.parse(male),
          gender: "male",
        });
      } else if (female) {
        setSavedAvatar({
          ...JSON.parse(female),
          gender: "female",
        });
      } else if (male) {
        setSavedAvatar({
          ...JSON.parse(male),
          gender: "male",
        });
      } else {
        setSavedAvatar(null);
      }
    } catch (error) {
      console.error("Could not load saved avatar:", error);
      setSavedAvatar(null);
    }
  }, [location.key]);

  // Avatar navigation
  const handleAvatarClick = () => {
    navigate("/ava");
  };

  // Avatar image path
  const getAvatarImage = (image) => {
    if (!image) return "";
    return image.startsWith("/") ? image : `/images/${image}`;
  };

  // Load bio belonging to the current account
  useEffect(() => {
    try {
      const bioKey = getUserStorageKey("profileBio");

      if (!bioKey) {
        setBioTitle("");
        setBioText("");
        return;
      }

      const savedBio = JSON.parse(localStorage.getItem(bioKey) || "null");

      setBioTitle(savedBio?.title || "");
      setBioText(savedBio?.bio || "");
    } catch (error) {
      console.error("Could not load profile bio:", error);
      setBioTitle("");
      setBioText("");
    }
  }, [location.key]);

  // Open bio editor
  const openBioModal = () => {
    setDraftTitle(bioTitle);
    setDraftBio(bioText);
    setShowBioModal(true);
  };

  // Save bio for the current account
  const saveBio = (e) => {
    e.preventDefault();

    const bioKey = getUserStorageKey("profileBio");

    if (!bioKey) {
      alert("Please sign in before saving your bio.");
      return;
    }

    const newBio = {
      title: draftTitle.trim(),
      bio: draftBio.trim(),
    };

    try {
      localStorage.setItem(bioKey, JSON.stringify(newBio));

      setBioTitle(newBio.title);
      setBioText(newBio.bio);
      setShowBioModal(false);
    } catch (error) {
      console.error("Could not save profile bio:", error);
      alert("Could not save your bio. Please try again.");
    }
  };

  return (
    <>
      <div className="profile-page">
        <div className="upper-section">
          <div className="bg-cover">
            <div className="cover-image-wrapper">
              <img
                src="/images/profile-cover.png"
                alt="Profile cover"
                className="profile-cover-image"
              />
            </div>
          </div>

          {/* Avatar */}
          <div className="out_pro">
            <button
              type="button"
              className={`profile profile-avatar-button ${
                savedAvatar ? "has-avatar" : "empty-avatar"
              }`}
              onClick={handleAvatarClick}
              aria-label={
                savedAvatar ? "Edit your avatar" : "Create your avatar"
              }
              title={
                savedAvatar ? "Click to edit your avatar" : "Create your avatar"
              }
            >
              {savedAvatar ? (
                <>
                  <div className="profile-avatar-layers">
                    <img
                      className="profile-avatar-base"
                      src={getAvatarImage(
                        savedAvatar.gender === "female"
                          ? "female.png"
                          : "male.png",
                      )}
                      alt=""
                    />

                    {savedAvatar.outfit && (
                      <img
                        className="profile-avatar-outfit"
                        src={getAvatarImage(savedAvatar.outfit)}
                        alt=""
                      />
                    )}

                    {savedAvatar.hair && (
                      <img
                        className="profile-avatar-hair"
                        src={getAvatarImage(savedAvatar.hair)}
                        alt=""
                      />
                    )}

                    {savedAvatar.accessory && (
                      <img
                        className="profile-avatar-accessory"
                        src={getAvatarImage(savedAvatar.accessory)}
                        alt=""
                      />
                    )}
                  </div>

                  <div className="avatar-hover-overlay">
                    <span>✎</span>
                    <span>Edit your avatar</span>
                  </div>
                </>
              ) : (
                <span className="create-avatar-hint">
                  <span className="create-avatar-icon">＋</span>
                  <span>Create your avatar</span>
                </span>
              )}
            </button>
          </div>

          {/* Bio */}
          <div className="profile-bio-section">
            <div className="profile-bio">
              {bioTitle || bioText ? (
                <>
                  {bioTitle && (
                    <h2 className="profile-bio-title">{bioTitle}</h2>
                  )}

                  {bioText && <p className="profile-bio-text">{bioText}</p>}
                </>
              ) : (
                <p className="profile-bio-placeholder">
                  Your little corner of the world ♡
                </p>
              )}
            </div>

            <button
              type="button"
              className="add-bio-btn"
              onClick={openBioModal}
            >
              {bioTitle || bioText ? "Edit Bio" : "+ Add Bio"}
            </button>
          </div>
        </div>

        {/* Current Development */}
        <section className="current-section">
          <div className="section-heading">
            <span className="section-subtitle">A little world in progress</span>
            <h2>Current & Future Features ♡</h2>
            <p>Little things I'm dreaming of bringing to life.</p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <img
                src="/images/garden-feature.png"
                alt="Cozy garden and home decoration"
              />

              <div className="feature-card-content">
                <span className="feature-status">Planned feature</span>
                <h3>Garden & Home Life 🌸</h3>
                <p>
                  Grow your own little garden, decorate your home, arrange
                  furniture, and enjoy cozy activities like cooking.
                </p>
              </div>
            </article>

            <article className="feature-card">
              <img
                src="/images/multiplayer-feature.png"
                alt="Cozy multiplayer virtual world"
              />

              <div className="feature-card-content">
                <span className="feature-status">Future project</span>
                <h3>A Cozy Little World 🏡</h3>
                <p>
                  A small multiplayer life-simulation world where you can invite
                  friends, meet up, chat, play games, and enjoy everyday
                  activities together.
                </p>
              </div>
            </article>
          </div>

          {/* Project Purpose */}
          <div className="project-purpose">
            <div className="purpose-icon">
              <img
                src="/icons/doodle-color-20-heart-in-reveal.gif"
                alt="heart"
              />
            </div>

            <span className="section-subtitle">The reason behind it all</span>

            <h2>A Little World We Can Call Home</h2>

            <p>
              I want to create a little cozy virtual world where distance
              doesn't have to keep people apart. A place where friends, lovers,
              and families who live far away can come together, share a home,
              chat about their days, play games, and enjoy the little things in
              life.
            </p>

            <p>
              More than just a game or a mood tracker, I hope this project can
              become a comforting space where people can create memories
              together, even when they can't be physically by each other's side.
            </p>
          </div>
        </section>

        {/* Bio Modal */}
        {showBioModal && (
          <div
            className="bio-modal-overlay"
            onClick={() => setShowBioModal(false)}
          >
            <div className="bio-modal" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="bio-modal-close"
                onClick={() => setShowBioModal(false)}
              >
                ×
              </button>

              <h2>Edit Your Bio ♡</h2>

              <p className="bio-modal-subtitle">
                Tell everyone a little about your world.
              </p>

              <form onSubmit={saveBio}>
                <label htmlFor="bio-title">Your title</label>

                <input
                  id="bio-title"
                  type="text"
                  placeholder="Give your little world a title..."
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  maxLength={60}
                />

                <label htmlFor="bio-text">About you</label>

                <textarea
                  id="bio-text"
                  placeholder="Write something about yourself..."
                  value={draftBio}
                  onChange={(e) => setDraftBio(e.target.value)}
                  rows={5}
                  maxLength={500}
                />

                <div className="bio-modal-actions">
                  <button
                    type="button"
                    className="bio-cancel-btn"
                    onClick={() => setShowBioModal(false)}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="bio-save-btn">
                    Save Bio ♡
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
      </div>

      <Footer />
    </>
  );
};

export default Profile;
