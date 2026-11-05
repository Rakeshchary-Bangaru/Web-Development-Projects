import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getMyProfile,
} from "../../services/profileApi";

import {
  useAuth,
} from "../../context/AuthContext";

import "../../styles/components/MyProfile.css";


function MyProfile() {

  const [profile, setProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  const {
    currentUser,
  } = useAuth();


  /*
   * =========================================================
   * LOAD PROFILE
   * =========================================================
   */
  useEffect(() => {

    async function loadProfile() {

      try {

        setLoading(true);
        setError("");


        const data =
          await getMyProfile();


        setProfile(data);

      } catch (error) {

        setError(
          error.message ||
          "Failed to load profile"
        );

      } finally {

        setLoading(false);
      }
    }


    loadProfile();

  }, []);


  /*
   * =========================================================
   * DATE FORMAT
   * =========================================================
   */
  function formatDate(date) {

    if (!date) {
      return "Not available";
    }


    return new Date(date)
      .toLocaleString(
        "en-IN"
      );
  }


  /*
   * =========================================================
   * STATUS FORMAT
   * =========================================================
   */
  function formatStatus(status) {

    if (!status) {
      return "Unknown";
    }


    return status
      .toLowerCase()
      .split("_")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");
  }


  /*
   * =========================================================
   * STATUS COLOUR
   * =========================================================
   */
  function getStatusClass(status) {

    switch (status) {

      case "ACTIVE":
        return "status-active";

      case "SUSPENDED":
        return "status-suspended";

      case "DORMANT":
        return "status-dormant";

      case "DELETION_PENDING":
        return "status-deletion-pending";

      default:
        return "status-unknown";
    }
  }


  /*
   * =========================================================
   * LOGIN METHOD
   * =========================================================
   */
  function formatLoginMethod(
    loginMethod
  ) {

    if (loginMethod === "LOCAL") {
      return "Email & Password";
    }


    if (loginMethod === "GOOGLE") {
      return "Google";
    }


    return (
      loginMethod ||
      "Not available"
    );
  }


  /*
   * =========================================================
   * MANAGEMENT DASHBOARD
   * ---------------------------------------------------------
   * Internal role is used only to decide navigation.
   *
   * The role name itself is never displayed.
   * =========================================================
   */
  function getDashboardDetails() {

    switch (currentUser?.role) {

      case "SELLER_ADMIN":

        return {
          path: "/seller/dashboard",
          label: "Seller Dashboard",
        };


      case "IT_SUPPORT":

        return {
          path: "/support/dashboard",
          label: "Support Dashboard",
        };


      case "ROOT":

        return {
          path: "/admin/dashboard",
          label: "Admin Dashboard",
        };


      default:

        return null;
    }
  }


  const dashboard =
    getDashboardDetails();


  /*
   * =========================================================
   * ICONS
   * =========================================================
   */

  function UserIcon() {

    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >

        <circle
          cx="12"
          cy="8"
          r="4"
        />

        <path
          d="M4 21v-2a8 8 0 0 1 16 0v2"
        />

      </svg>
    );
  }


  function IdIcon() {

    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >

        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
        />

        <circle
          cx="8"
          cy="11"
          r="2"
        />

        <path
          d="M6 16c.7-1.4 3.3-1.4 4 0"
        />

        <path
          d="M13 10h5"
        />

        <path
          d="M13 14h5"
        />

      </svg>
    );
  }


  function MailIcon() {

    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >

        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
        />

        <path
          d="m3 7 9 6 9-6"
        />

      </svg>
    );
  }


  function LockIcon() {

    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >

        <rect
          x="5"
          y="10"
          width="14"
          height="11"
          rx="2"
        />

        <path
          d="M8 10V7a4 4 0 0 1 8 0v3"
        />

      </svg>
    );
  }


  function CalendarIcon() {

    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >

        <rect
          x="3"
          y="5"
          width="18"
          height="16"
          rx="2"
        />

        <path
          d="M8 3v4"
        />

        <path
          d="M16 3v4"
        />

        <path
          d="M3 10h18"
        />

      </svg>
    );
  }


  function LoginIcon() {

    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >

        <path
          d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
        />

        <path
          d="m10 17 5-5-5-5"
        />

        <path
          d="M15 12H3"
        />

      </svg>
    );
  }


  function ActivityIcon() {

    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >

        <path
          d="M3 12h4l2-7 4 14 2-7h6"
        />

      </svg>
    );
  }


  function StoreIcon() {

    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >

        <path
          d="M4 10v10h16V10"
        />

        <path
          d="M3 10 5 4h14l2 6"
        />

        <path
          d="M8 20v-6h8v6"
        />

      </svg>
    );
  }


  function ApprovalIcon() {

    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >

        <circle
          cx="12"
          cy="12"
          r="9"
        />

        <path
          d="m8 12 3 3 5-6"
        />

      </svg>
    );
  }


  /*
   * =========================================================
   * LOADING
   * =========================================================
   */
  if (loading) {

    return (

      <div className="profile-page">

        <div className="profile-loading">

          Loading your profile...

        </div>

      </div>
    );
  }


  /*
   * =========================================================
   * ERROR
   * =========================================================
   */
  if (error) {

    return (

      <div className="profile-page">

        <div className="profile-error">

          {error}

        </div>

      </div>
    );
  }


  if (!profile) {
    return null;
  }


  return (

    <div className="profile-page">


      {/* =====================================================
          PAGE HEADING
         ===================================================== */}

      <div className="profile-page-header">

        <h1>
          My Profile
        </h1>


        <p>
          View your personal and
          account information.
        </p>

      </div>


      {/* =====================================================
          MAIN PROFILE CARD
         ===================================================== */}

      <div className="profile-card">


        {/* ===================================================
            PROFILE HEADER
           =================================================== */}

        <section className="profile-card-header">


          {/* USER DETAILS */}

          <div className="profile-user-summary">


            <div className="profile-user-icon">

              <UserIcon />

            </div>


            <div className="profile-user-text">

              <h2>
                {profile.displayName}
              </h2>

              <p>
                {profile.email}
              </p>

            </div>


          </div>


          {/* =================================================
              RIGHT-SIDE ACTIONS
             ================================================= */}

          <div className="profile-header-actions">


            {/* MANAGEMENT DASHBOARD */}

            {dashboard && (

              <Link
                to={dashboard.path}
                className="profile-dashboard-button"
              >

                {dashboard.label}

              </Link>

            )}


            {/* ACCOUNT STATUS */}

            <div
              className={
                `profile-status ${getStatusClass(
                  profile.accountStatus
                )}`
              }
            >

              <span
                className="profile-status-dot"
              ></span>


              {formatStatus(
                profile.accountStatus
              )}

            </div>


          </div>


        </section>


        <div className="profile-divider"></div>


        {/* ===================================================
            ACCOUNT INFORMATION
           =================================================== */}

        <section className="profile-section">


          <div className="profile-section-heading">

            <h3>
              Account Information
            </h3>

            <p>
              Details associated with
              your account.
            </p>

          </div>


          <div className="profile-details-grid">


            {/* ACCOUNT ID */}

            <div className="profile-detail-card">

              <div className="profile-detail-icon">
                <IdIcon />
              </div>

              <span className="profile-detail-label">
                Account ID
              </span>

              <strong className="profile-detail-value">
                {profile.accountId}
              </strong>

            </div>


            {/* EMAIL */}

            <div className="profile-detail-card">

              <div className="profile-detail-icon">
                <MailIcon />
              </div>

              <span className="profile-detail-label">
                Email
              </span>

              <strong className="profile-detail-value">
                {profile.email}
              </strong>

            </div>


            {/* LOGIN METHOD */}

            <div className="profile-detail-card">

              <div className="profile-detail-icon">
                <LockIcon />
              </div>

              <span className="profile-detail-label">
                Login Method
              </span>

              <strong className="profile-detail-value">

                {formatLoginMethod(
                  profile.loginMethod
                )}

              </strong>

            </div>


            {/* MEMBER SINCE */}

            <div className="profile-detail-card">

              <div className="profile-detail-icon">
                <CalendarIcon />
              </div>

              <span className="profile-detail-label">
                Member Since
              </span>

              <strong className="profile-detail-value">

                {formatDate(
                  profile.memberSince
                )}

              </strong>

            </div>


            {/* LAST LOGIN */}

            <div className="profile-detail-card">

              <div className="profile-detail-icon">
                <LoginIcon />
              </div>

              <span className="profile-detail-label">
                Last Login
              </span>

              <strong className="profile-detail-value">

                {formatDate(
                  profile.lastLoginAt
                )}

              </strong>

            </div>


            {/* LAST ACTIVITY */}

            <div className="profile-detail-card">

              <div className="profile-detail-icon">
                <ActivityIcon />
              </div>

              <span className="profile-detail-label">
                Last Activity
              </span>

              <strong className="profile-detail-value">

                {formatDate(
                  profile.lastActivityAt
                )}

              </strong>

            </div>


          </div>

        </section>


        {/* ===================================================
            SELLER INFORMATION
           =================================================== */}

        {profile.sellerProfile && (

          <>

            <div className="profile-divider"></div>


            <section className="profile-section">


              <div className="profile-section-heading">

                <h3>
                  Seller Information
                </h3>

                <p>
                  Details associated with
                  your seller account.
                </p>

              </div>


              <div className="profile-details-grid">


                {/* SELLER ID */}

                <div className="profile-detail-card">

                  <div className="profile-detail-icon">
                    <IdIcon />
                  </div>

                  <span className="profile-detail-label">
                    Seller ID
                  </span>

                  <strong className="profile-detail-value">

                    {profile
                      .sellerProfile
                      .sellerId}

                  </strong>

                </div>


                {/* BUSINESS NAME */}

                <div className="profile-detail-card">

                  <div className="profile-detail-icon">
                    <StoreIcon />
                  </div>

                  <span className="profile-detail-label">
                    Business Name
                  </span>

                  <strong className="profile-detail-value">

                    {profile
                      .sellerProfile
                      .businessName}

                  </strong>

                </div>


                {/* SELLER STATUS */}

                <div className="profile-detail-card">

                  <div className="profile-detail-icon">
                    <ApprovalIcon />
                  </div>

                  <span className="profile-detail-label">
                    Seller Status
                  </span>

                  <strong className="profile-detail-value">

                    {formatStatus(
                      profile
                        .sellerProfile
                        .approvalStatus
                    )}

                  </strong>

                </div>


              </div>

            </section>

          </>

        )}


      </div>

    </div>
  );
}


export default MyProfile;