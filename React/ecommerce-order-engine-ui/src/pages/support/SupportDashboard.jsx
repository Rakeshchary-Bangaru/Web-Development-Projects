
import { Link } from "react-router-dom";

import {
  Users,
  ShieldCheck,
  UserCheck,
  UserCog,
  ArrowRight,
  Activity,
  CircleHelp,
  Settings,
  LayoutDashboard,
  LockKeyhole,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import "../../styles/components/SupportDashboard.css";

function SupportDashboard() {
  const { currentUser } = useAuth();

  /*
   * =========================================================
   * ROLE INFORMATION
   * =========================================================
   *
   * ROOT can access the Support Panel and Admin Panel.
   * IT_SUPPORT can access only authorized support areas.
   */
  const isRoot = currentUser?.role === "ROOT";

  const displayRole = isRoot
    ? "ROOT Administrator"
    : "IT Support";

  /*
   * =========================================================
   * SUPPORT FEATURES
   * =========================================================
   *
   * These cards describe existing support responsibilities.
   * Actual operations are controlled by backend permissions.
   */
  const supportFeatures = [
    {
      title: "User Accounts",
      description:
        "View registered accounts and review user information.",
      icon: Users,
    },
    {
      title: "Role Administration",
      description:
        "Review and perform role changes permitted by your account.",
      icon: UserCog,
    },
    {
      title: "Account Status",
      description:
        "Review active, suspended, and dormant accounts.",
      icon: UserCheck,
    },
    {
      title: "Account Security",
      description:
        "Manage account access through authorized support actions.",
      icon: ShieldCheck,
    },
  ];

  /*
   * =========================================================
   * QUICK ACTIONS
   * =========================================================
   */
  const quickActions = [
    {
      title: "Manage User Accounts",
      description:
        "View user accounts, roles, and security statuses.",
      path: "/support/users",
      icon: Users,
      linkText: "Open User Management",
    },
    {
      title: "Account Settings",
      description:
        "Review your own profile and authentication settings.",
      path: "/account/settings",
      icon: Settings,
      linkText: "View Account Settings",
    },
  ];

  /*
   * ROOT users may navigate to the ROOT Admin Dashboard.
   * Ordinary IT_SUPPORT users must not see this action.
   */
  if (isRoot) {
    quickActions.push({
      title: "ROOT Administration",
      description:
        "Return to the main ROOT administration dashboard.",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
      linkText: "Open Admin Dashboard",
    });
  }

  return (
    <div className="support-dashboard">

      {/* =====================================================
          PAGE HEADER
         ===================================================== */}
      <header className="support-dashboard-header">
        <div>
          <div className="support-eyebrow">
            ACCOUNT OPERATIONS
          </div>

          <h1>IT Support Dashboard</h1>

          <p>
            Manage user accounts, roles, account status,
            and security administration.
          </p>
        </div>

        <Link
          to="/support/users"
          className="support-header-action"
        >
          <Users size={18} aria-hidden="true" />
          <span>User Management</span>
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </header>

      {/* =====================================================
          WELCOME BANNER
         ===================================================== */}
      <section className="support-welcome-banner">
        <div className="support-welcome-icon">
          <ShieldCheck size={28} aria-hidden="true" />
        </div>

        <div className="support-welcome-content">
          <span className="support-welcome-label">
            SUPPORT WORKSPACE
          </span>

          <h2>Welcome to Support Administration</h2>

          <p>
            Review user accounts, manage permitted role
            assignments, and help maintain secure access
            to the application.
          </p>
        </div>

        <div className="support-role-chip">
          <LockKeyhole size={15} aria-hidden="true" />
          <span>{displayRole}</span>
        </div>
      </section>

      {/* =====================================================
          SUPPORT OPERATIONS
         ===================================================== */}
      <section className="support-dashboard-section">
        <div className="support-section-heading">
          <div>
            <h2>Support Operations</h2>

            <p>
              The main areas available for account
              administration.
            </p>
          </div>
        </div>

        <div className="support-features-grid">
          {supportFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="support-feature-card"
              >
                <div className="support-feature-icon">
                  <Icon size={22} aria-hidden="true" />
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          QUICK ACTIONS
         ===================================================== */}
      <section className="support-dashboard-section">
        <div className="support-section-heading">
          <div>
            <h2>Quick Actions</h2>

            <p>
              Navigate directly to commonly used support
              functions.
            </p>
          </div>
        </div>

        <div className="support-actions-grid">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <article
                key={action.path}
                className="support-action-card"
              >
                <div className="support-action-icon">
                  <Icon size={21} aria-hidden="true" />
                </div>

                <h3>{action.title}</h3>

                <p>{action.description}</p>

                <Link
                  to={action.path}
                  className="support-action-link"
                >
                  <span>{action.linkText}</span>
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                  />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          SECURITY INFORMATION AND CURRENT SESSION
         ===================================================== */}
      <div className="support-bottom-grid">

        {/* SECURITY GUIDELINES */}
        <section className="support-dashboard-section">
          <div className="support-section-heading">
            <div>
              <h2>Security Guidelines</h2>

              <p>
                Important rules for user administration.
              </p>
            </div>
          </div>

          <div className="support-guidelines">

            <div className="support-guideline">
              <ShieldCheck
                size={19}
                aria-hidden="true"
              />

              <div>
                <strong>Role-based access</strong>

                <p>
                  Perform only account operations permitted
                  by your authenticated role.
                </p>
              </div>
            </div>

            <div className="support-guideline">
              <LockKeyhole
                size={19}
                aria-hidden="true"
              />

              <div>
                <strong>Privilege protection</strong>

                <p>
                  ROOT privileges must be protected by
                  backend authorization rules.
                </p>
              </div>
            </div>

            <div className="support-guideline">
              <Activity
                size={19}
                aria-hidden="true"
              />

              <div>
                <strong>Account changes</strong>

                <p>
                  Verify an account before changing its
                  role or security status.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* CURRENT SESSION */}
        <section className="support-dashboard-section">
          <div className="support-section-heading">
            <div>
              <h2>Current Session</h2>

              <p>
                Your authenticated support account.
              </p>
            </div>
          </div>

          <div className="support-session-details">

            <div className="support-session-row">
              <span>Email</span>

              <strong>
                {currentUser?.email || "Not available"}
              </strong>
            </div>

            <div className="support-session-row">
              <span>Account ID</span>

              <strong>
                {currentUser?.userId ?? "Not available"}
              </strong>
            </div>

            <div className="support-session-row">
              <span>Access Level</span>

              <strong>{displayRole}</strong>
            </div>

          </div>

          <div className="support-help-note">
            <CircleHelp
              size={18}
              aria-hidden="true"
            />

            <span>
              Account and role changes are subject to
              backend security checks.
            </span>
          </div>
        </section>

      </div>
    </div>
  );
}

export default SupportDashboard;
