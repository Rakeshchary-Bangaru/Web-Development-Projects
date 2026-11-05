
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyProfile } from "../../services/profileApi";
import { useAuth } from "../../context/AuthContext";

import "../../styles/pages/AccountSettings.css";

function AccountSettings() {
  const { currentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const data = await getMyProfile();

        if (!cancelled) {
          setProfile(data);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load account information.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const provider = profile?.loginMethod ?? profile?.authProvider;

  const providerLabel =
    provider === "LOCAL"
      ? "Email & Password"
      : provider === "GOOGLE"
        ? "Google"
        : provider || "Not available";

  if (loading) {
    return (
      <main className="account-settings-page">
        <div className="account-settings-container">
          <div className="account-settings-status">
            Loading account settings...
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="account-settings-page">
        <div className="account-settings-container">
          <div
            className="account-settings-status account-settings-error"
            role="alert"
          >
            {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="account-settings-page">
      <div className="account-settings-container">
        <header className="account-settings-header">
          <span
            className="account-settings-header-icon"
            aria-hidden="true"
          >
            <svg
              width="27"
              height="27"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
              <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.86 1.86-.06-.06A1.7 1.7 0 0 0 16 18.4a1.7 1.7 0 0 0-1 .96V20h-2.6v-.64a1.7 1.7 0 0 0-1-.96 1.7 1.7 0 0 0-1.88.34l-.06.06-1.86-1.86.06-.06A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-.96-1H6.4v-2.6h.64A1.7 1.7 0 0 0 8 10.4a1.7 1.7 0 0 0-.34-1.88L7.6 8.46 9.46 6.6l.06.06A1.7 1.7 0 0 0 11.4 7a1.7 1.7 0 0 0 1-.96V5.4H15v.64a1.7 1.7 0 0 0 1 .96 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.86 1.86-.06.06A1.7 1.7 0 0 0 19.4 10.4a1.7 1.7 0 0 0 .96 1H21v2.6h-.64a1.7 1.7 0 0 0-.96 1Z" />
            </svg>
          </span>

          <div>
            <h1>Account Settings</h1>
            <p>Manage your account and security information.</p>
          </div>
        </header>

        <section className="account-settings-card">
          <div className="account-settings-card-header">
            <div
              className="account-settings-card-icon"
              aria-hidden="true"
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
              </svg>
            </div>

            <div>
              <h2>Personal Information</h2>
              <p>Details associated with your account</p>
            </div>
          </div>

          <div className="account-settings-info-grid">
            <div className="account-settings-info-item">
              <span className="account-settings-info-label">
                Full Name
              </span>

              <span className="account-settings-info-value">
                {profile?.displayName || "Not available"}
              </span>
            </div>

            <div className="account-settings-info-item">
              <span className="account-settings-info-label">
                Email Address
              </span>

              <span className="account-settings-info-value">
                {profile?.email ||
                  currentUser?.email ||
                  "Not available"}
              </span>
            </div>

            <div className="account-settings-info-item">
              <span className="account-settings-info-label">
                Account ID
              </span>

              <span className="account-settings-info-value">
                {profile?.accountId ??
                  currentUser?.userId ??
                  "Not available"}
              </span>
            </div>
          </div>
        </section>

        <section className="account-settings-card">
          <div className="account-settings-card-header">
            <div
              className="account-settings-card-icon"
              aria-hidden="true"
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>

            <div>
              <h2>Authentication & Security</h2>
              <p>Your account's sign-in information</p>
            </div>
          </div>

          <div className="account-settings-auth-row">
            <div className="account-settings-auth-label">
              <strong>Login Method</strong>
              <span>
                The authentication method linked to this account
              </span>
            </div>

            <span className="account-settings-provider">
              {providerLabel}
            </span>
          </div>

          <div className="account-settings-note">
            <span aria-hidden="true">ⓘ</span>
            <span>
              Additional authentication options, including
              securely linking a Google account or changing a
              password, require corresponding backend support.
            </span>
          </div>
        </section>

        <Link
          to="/profile"
          className="account-settings-back"
        >
          <span aria-hidden="true">←</span>
          Back to My Profile
        </Link>
      </div>
    </main>
  );
}

export default AccountSettings;
