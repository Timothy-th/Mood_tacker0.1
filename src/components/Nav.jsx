import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", href: "/home" },
    { name: "Profile", href: "/profile" },
    { name: "Feeling", href: "/feeling" },
    { name: "Calendar", href: "/cal" },
    { name: "Contact", href: "/contact" },
  ];

  // const handleLogout = () => {
  //   // Clear authentication/session data only.
  //   // Replace these keys with the ones your app actually uses.
  //   localStorage.removeItem("isLoggedIn");
  //   localStorage.removeItem("user");
  //   sessionStorage.clear();

  //   setIsOpen(false);
  //   navigate("/signin", { replace: true });
  // };
  const handleLogout = () => {
    localStorage.removeItem("moodGardenCurrentUser");
    navigate("/", { replace: true });
  };

  return (
    <nav id="to-top" className="mood-navbar">
      <Link
        to="/"
        className="mood-navbar__brand"
        onClick={() => setIsOpen(false)}
        aria-label="Mood Garden home"
      >
        <img
          src="/public/icons/wired-lineal-1704-flower-in-reveal.gif"
          alt=""
        />
        <span className="mood-navbar__brand-name font-main">Mood Garden</span>
      </Link>

      <button
        type="button"
        className="mood-navbar__toggle"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isOpen}
        aria-controls="navbar-menu"
      >
        {isOpen ? "×" : "☰"}
      </button>

      <div
        id="navbar-menu"
        className={`mood-navbar__menu ${isOpen ? "is-open" : ""}`}
      >
        <ul>
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.href}
                end={link.href === "/"}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `mood-navbar__link ${isActive ? "active" : ""}`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}

          <li>
            <button
              type="button"
              className="mood-navbar__logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
