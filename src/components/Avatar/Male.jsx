import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/female.css";

const categories = [
  { id: "hair", label: "Hair", icon: "🩵" },
  { id: "outfit", label: "Clothes", icon: "👕" },
  { id: "accessory", label: "Extras", icon: "💎" },
];

const itemsByCategory = {
  hair: ["mh1.png", "mh2.png", "mhh3.png", "mh4.png", "mh5.png", "mh6.png"],
  outfit: [
    "mc1.png",
    "mc2.png",
    "mc3.png",
    "mc4.png",
    "mc5.png",
    "mc6.png",
    "mc7.png",
    "mc8.png",
    "mc9.png",
  ],
  accessory: ["at1.png", "at2.png", "at3.png", "at4.png", "at5.png", "at6.png"],
};
const getUserStorageKey = (key) => {
  const user = JSON.parse(
    localStorage.getItem("moodGardenCurrentUser") || "null",
  );

  return user?.id ? `${key}_${user.id}` : null;
};

const Male = () => {
  const navigate = useNavigate();
  const [hair, setHair] = useState("");
  const [outfit, setOutfit] = useState("");
  const [accessory, setAccessory] = useState("");
  const [activeCategory, setActiveCategory] = useState("hair");

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storageKey = getUserStorageKey("maleAvatar");

    if (!storageKey) return;

    try {
      const savedAvatar = localStorage.getItem(storageKey);

      if (savedAvatar) {
        const avatar = JSON.parse(savedAvatar);

        setHair(avatar.hair || "");
        setOutfit(avatar.outfit || "");
        setAccessory(avatar.accessory || "");
      }
    } catch (error) {
      console.error("Could not load male avatar:", error);
    }
  }, []);

  const handleSaveAvatar = () => {
    const avatarKey = getUserStorageKey("maleAvatar");
    const genderKey = getUserStorageKey("selectedAvatarGender");

    if (!avatarKey || !genderKey) {
      alert("Please sign in before saving your avatar.");
      return;
    }

    const avatar = { hair, outfit, accessory };

    localStorage.setItem(avatarKey, JSON.stringify(avatar));
    localStorage.setItem(genderKey, "male");

    setSaved(true);
    navigate("/profile");
  };
  const selectedItems = {
    hair,
    outfit,
    accessory,
  };

  const setters = {
    hair: setHair,
    outfit: setOutfit,
    accessory: setAccessory,
  };

  const activeLabel = categories.find(
    (category) => category.id === activeCategory,
  )?.label;

  return (
    <main className="avatar-studio">
      {/* LEFT: Male avatar preview */}
      <section className="avatar-preview">
        <img
          src="/images/profile-cover.png"
          alt=""
          className="avatar-background"
        />

        <div className="preview-heading">
          <span className="preview-eyebrow">YOUR LITTLE WORLD</span>
          <h2>My Avatar</h2>
          <p>Make it feel like you.</p>
        </div>

        <div className="avatar-container male-avatar">
          <img
            src="/images/male.png"
            alt="Your male avatar"
            className="avatar-base"
          />

          {hair && (
            <img
              src={`/images/${hair}`}
              alt="Selected hairstyle"
              className="avatar-hair"
            />
          )}

          {outfit && (
            <img
              src={`/images/${outfit}`}
              alt="Selected outfit"
              className="avatar-outfit"
            />
          )}

          {accessory && (
            <img
              src={`/images/${accessory}`}
              alt="Selected accessory"
              className="avatar-accessory"
            />
          )}
        </div>

        <div className="preview-footer">
          <span>✿</span> A little space to express yourself
        </div>

        <div className="avatar-save-area">
          <button
            type="button"
            className="save-avatar-btn"
            onClick={handleSaveAvatar}
          >
            {saved ? "✓ Avatar Saved!" : "♡ Save Avatar"}
          </button>
        </div>
      </section>

      {/* RIGHT: Dressing room */}
      <section className="avatar-control">
        <nav className="avatar-tabs" aria-label="Avatar categories">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`avatar-tab ${
                activeCategory === category.id ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category.id)}
              aria-pressed={activeCategory === category.id}
              title={category.label}
            >
              <span className="tab-icon" aria-hidden="true">
                {category.icon}
              </span>
              <span className="tab-label">{category.label}</span>
            </button>
          ))}
        </nav>

        {/* Items change when a category tab is selected */}
        <div className="avatar-items-panel">
          <div className="items-header">
            <span className="items-eyebrow">THE DRESSING ROOM</span>
            <h2>{activeLabel}</h2>
            <p>Pick your favorite ✨</p>
          </div>

          <div className="item-grid">
            {itemsByCategory[activeCategory].map((item, index) => (
              <button
                key={item}
                type="button"
                className={`item-btn ${
                  selectedItems[activeCategory] === item ? "selected" : ""
                }`}
                onClick={() => setters[activeCategory](item)}
                aria-label={`Choose ${activeLabel} option ${index + 1}`}
                aria-pressed={selectedItems[activeCategory] === item}
              >
                <img
                  src={`/images/${item}`}
                  alt={`${activeLabel} option ${index + 1}`}
                  className="item-img"
                  loading="lazy"
                />

                {selectedItems[activeCategory] === item && (
                  <span className="item-check" aria-hidden="true">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeCategory === "accessory" && (
            <p className="items-note">
              Accessories are optional. Your style, your choice!
            </p>
          )}

          <div className="avatar-actions">
            <button
              type="button"
              className="reset-btn"
              onClick={() => setters[activeCategory]("")}
              disabled={!selectedItems[activeCategory]}
            >
              Reset {activeLabel}
            </button>

            <button
              type="button"
              className="reset-all-btn"
              onClick={() => {
                setHair("");
                setOutfit("");
                setAccessory("");
              }}
            >
              Reset All
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Male;
