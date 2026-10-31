import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/global.css";
import "../styles/profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [savedAvatar, setSavedAvatar] = useState(null);
  const [showBioModal, setShowBioModal] = useState(false);
  const [bioTitle, setBioTitle] = useState("");
  const [bioText, setBioText] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBio, setDraftBio] = useState("");

  // Reload the avatar when the user returns to this route
  // Reload the latest saved avatar whenever you return to Profile
  useEffect(() => {
    try {
      const female = localStorage.getItem("femaleAvatar");
      const male = localStorage.getItem("maleAvatar");

      // Read the most recently saved avatar
      const lastGender = localStorage.getItem("selectedAvatarGender");

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

  const handleAvatarClick = () => {
    navigate("/ava");
  };

  const getAvatarImage = (image) => {
    if (!image) return "";
    return image.startsWith("/") ? image : `/images/${image}`;
  };

  // Load the saved bio
  useEffect(() => {
    try {
      const savedBio = JSON.parse(localStorage.getItem("profileBio") || "null");

      if (savedBio) {
        setBioTitle(savedBio.title || "");
        setBioText(savedBio.bio || "");
      }
    } catch (error) {
      console.error("Could not load profile bio:", error);
    }
  }, []);

  const openBioModal = () => {
    setDraftTitle(bioTitle);
    setDraftBio(bioText);
    setShowBioModal(true);
  };

  const saveBio = (e) => {
    e.preventDefault();

    const newBio = {
      title: draftTitle.trim(),
      bio: draftBio.trim(),
    };

    setBioTitle(newBio.title);
    setBioText(newBio.bio);
    localStorage.setItem("profileBio", JSON.stringify(newBio));
    setShowBioModal(false);
  };

  return (
    <div className="container">
      <div className="upper-section">
        <div className="bg-cover">
          {/* Bio content on the left */}
          <div className="profile-bio">
            {bioTitle || bioText ? (
              <>
                {bioTitle && <h2 className="profile-bio-title">{bioTitle}</h2>}
                {bioText && <p className="profile-bio-text">{bioText}</p>}
              </>
            ) : (
              <p className="profile-bio-placeholder">
                Your little corner of the world ♡
              </p>
            )}
          </div>

          {/* Add Bio button */}
          <button type="button" className="add-bio-btn" onClick={openBioModal}>
            {bioTitle || bioText ? "✎ Edit Bio" : "+ Add Bio"}
          </button>

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
        </div>

        {/* Popup window */}
        {showBioModal && (
          <div
            className="bio-modal-overlay"
            onClick={() => setShowBioModal(false)}
          >
            <div
              className="bio-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="bio-modal-title"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="bio-modal-close"
                onClick={() => setShowBioModal(false)}
                aria-label="Close popup"
              >
                ×
              </button>

              <h2 id="bio-modal-title">
                {bioTitle || bioText ? "Edit Your Bio ♡" : "Add Your Bio ♡"}
              </h2>

              <p className="bio-modal-subtitle">
                A little introduction about you.
              </p>

              <form onSubmit={saveBio}>
                <label htmlFor="bio-title-input">Title</label>
                <input
                  id="bio-title-input"
                  type="text"
                  placeholder="e.g. A little dreamer"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  maxLength={60}
                />

                <label htmlFor="bio-text-input">Bio</label>
                <textarea
                  id="bio-text-input"
                  placeholder="Tell us a little about yourself..."
                  value={draftBio}
                  onChange={(e) => setDraftBio(e.target.value)}
                  rows={4}
                  maxLength={300}
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
      </div>

      <div className="middle-section"></div>

      <div className="lower-section"></div>
    </div>
    // <div className="container">
    //   <div className="upper_section">
    //     <div className="leftUp">
    //       <div className="bio">
    //         {bio && <p className="profile-bio">{bio}</p>}
    //       </div>

    //       <div className="bpGroup">
    //

    //         <button className="bio-btn" onClick={handleBio}>
    //           {bio ? "Edit Bio" : "Add Bio"}
    //         </button>
    //         <div className="update"></div>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="middle_section">
    //     <div className="chat"></div>
    //     <div className="graph"></div>
    //   </div>

    //   <div className="lower_section">
    //     <div className="home"></div>
    //   </div>
    // </div>
  );
};

export default Profile;
