
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getMyProfile } from "../services/profileApi";
import { useAuth } from "../context/AuthContext";

import "../styles/components/ProfileAvatar.css";

function getInitials(name) {
  if (!name || !name.trim()) {
    return "?";
  }

  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }

  return (
    words[0][0] + words[words.length - 1][0]
  ).toUpperCase();
}

function ProfileAvatar() {
  const [profile, setProfile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef(null);
  const navigate = useNavigate();

  const { logout } = useAuth();

  /*
   * Load the authenticated user's profile.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const data = await getMyProfile();

        if (!cancelled) {
          setProfile(data);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to load profile avatar",
            error
          );
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Close the dropdown when the user clicks outside
   * or presses Escape.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
  }

  function handleLogout() {
    closeMenu();

    /*
     * AuthContext.logout() should clear the JWT,
     * user state, and any associated session data.
     */
    logout();

    navigate("/login", { replace: true });
  }

  const displayName =
    profile?.displayName || "My Account";

  const email = profile?.email || "";

  const initials = getInitials(
    profile?.displayName
  );

  return (
    <div
      className="profile-avatar-container"
      ref={menuRef}
    >
      <button
        type="button"
        className="profile-avatar-trigger"
        title={`Account menu - ${displayName}`}
        aria-label="Open account menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="profile-account-dropdown"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="navigation-profile-avatar">
          {initials}
        </span>
      </button>

      {isOpen && (
        <div
          id="profile-account-dropdown"
          className="profile-account-dropdown"
          role="menu"
          aria-label="Account menu"
        >
          <div className="profile-menu-header">
            <span className="profile-menu-name">
              {displayName}
            </span>

            {email && (
              <span className="profile-menu-email">
                {email}
              </span>
            )}
          </div>

          <div className="profile-menu-divider" />

          <Link
            to="/profile"
            className="profile-menu-item"
            role="menuitem"
            onClick={closeMenu}
          >
            <span aria-hidden="true">👤</span>
            My Profile
          </Link>

          {/*
            Enable this link once /account/settings
            has been registered in App.jsx.
          */}
          <Link
            to="/account/settings"
            className="profile-menu-item"
            role="menuitem"
            onClick={closeMenu}
          >
            <span aria-hidden="true">⚙️</span>
            Account Settings
          </Link>

          <div className="profile-menu-divider" />

          <button
            type="button"
            className="profile-menu-item profile-menu-logout"
            role="menuitem"
            onClick={handleLogout}
          >
            <span aria-hidden="true">↪</span>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileAvatar;
