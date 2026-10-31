import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Profile", href: "/ava" },
    { name: "Feeling", href: "/feeling" },
    { name: "Calendar", href: "/cal" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav id="to-top" className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link
          to="/"
          className="logo-link"
          onClick={() => setIsOpen(false)}
          aria-label="Go to Home"
        >
          <img
            src="/images/favicon.png"
            alt="Mood Garden"
            className="h-10 w-auto"
          />{" "}
          <span className="font-main col">Mood Garden</span>
        </Link>

        {/* Mobile hamburger button */}
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="navbar-menu"
        >
          {isOpen ? (
            <span className="menu-icon">×</span>
          ) : (
            <span className="menu-icon">☰</span>
          )}
        </button>

        {/* Navigation links */}
        <div
          id="navbar-menu"
          className={`navbar-menu ${isOpen ? "menu-open" : ""}`}
        >
          <ul>
            {navLinks.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.href}
                  end={link.href === "/"}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
