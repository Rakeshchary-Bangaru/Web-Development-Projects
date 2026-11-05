import { useEffect, useState } from "react";

import {
    getUserAccounts,
    updateUserRole,
    updateUserStatus,
    markUserDeletionPending,
} from "../../services/userAdministrationApi";

import "./UserManagement.css";


const ROLES = [
    "CUSTOMER",
    "SELLER_ADMIN",
    "IT_SUPPORT",
    "ROOT",
];


function UserManagement() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [processingUserId, setProcessingUserId] =
        useState(null);


    useEffect(() => {

        loadUsers();

    }, []);


    async function loadUsers() {

        try {

            setLoading(true);
            setError("");

            const data =
                await getUserAccounts();

            setUsers(data);

        } catch (err) {

            setError(
                err.message ||
                "Unable to load user accounts."
            );

        } finally {

            setLoading(false);
        }
    }


    async function handleRoleChange(
        userId,
        newRole
    ) {

        try {

            setProcessingUserId(userId);
            setError("");
            setSuccess("");


            const updatedUser =
                await updateUserRole(
                    userId,
                    newRole
                );


            replaceUser(updatedUser);


            setSuccess(
                `Role updated to ${formatValue(newRole)}.`
            );

        } catch (err) {

            setError(
                err.message ||
                "Unable to update role."
            );

        } finally {

            setProcessingUserId(null);
        }
    }


    async function handleSuspend(user) {

        const confirmed =
            window.confirm(
                `Suspend ${user.email}?`
            );

        if (!confirmed) {
            return;
        }


        try {

            setProcessingUserId(user.id);
            setError("");
            setSuccess("");


            const updatedUser =
                await updateUserStatus(
                    user.id,
                    "SUSPENDED"
                );


            replaceUser(updatedUser);

            setSuccess(
                `${user.email} has been suspended.`
            );

        } catch (err) {

            setError(
                err.message ||
                "Unable to suspend account."
            );

        } finally {

            setProcessingUserId(null);
        }
    }


    async function handleReactivate(user) {

        const confirmed =
            window.confirm(
                `Reactivate ${user.email}?`
            );

        if (!confirmed) {
            return;
        }


        try {

            setProcessingUserId(user.id);
            setError("");
            setSuccess("");


            const updatedUser =
                await updateUserStatus(
                    user.id,
                    "ACTIVE"
                );


            replaceUser(updatedUser);

            setSuccess(
                `${user.email} has been reactivated.`
            );

        } catch (err) {

            setError(
                err.message ||
                "Unable to reactivate account."
            );

        } finally {

            setProcessingUserId(null);
        }
    }


    async function handleDeletionPending(user) {

        const confirmed =
            window.confirm(
                `Mark ${user.email} for deletion?\n\n` +
                "The account will not be physically deleted. " +
                "Its historical records will remain preserved."
            );

        if (!confirmed) {
            return;
        }


        try {

            setProcessingUserId(user.id);
            setError("");
            setSuccess("");


            const updatedUser =
                await markUserDeletionPending(
                    user.id
                );


            replaceUser(updatedUser);

            setSuccess(
                `${user.email} has been marked for deletion.`
            );

        } catch (err) {

            setError(
                err.message ||
                "Unable to mark account for deletion."
            );

        } finally {

            setProcessingUserId(null);
        }
    }


    function replaceUser(updatedUser) {

        setUsers(
            currentUsers =>
                currentUsers.map(
                    user =>
                        user.id === updatedUser.id
                            ? updatedUser
                            : user
                )
        );
    }


    function formatValue(value) {

        if (!value) {
            return "—";
        }

        return value
            .toLowerCase()
            .split("_")
            .map(
                word =>
                    word.charAt(0).toUpperCase()
                    + word.slice(1)
            )
            .join(" ");
    }


    function formatDate(value) {

        if (!value) {
            return "Never";
        }

        return new Date(value)
            .toLocaleString();
    }


    if (loading) {

        return (
            <div className="user-management">
                <h1>User Accounts</h1>
                <p>Loading accounts...</p>
            </div>
        );
    }


    return (
        <div className="user-management">

            <div className="user-management-header">

                <div>
                    <h1>User Accounts</h1>

                    <p>
                        Manage application roles and
                        account security status.
                    </p>
                </div>

                <button
                    className="refresh-button"
                    onClick={loadUsers}
                >
                    Refresh
                </button>

            </div>


            {error && (
                <div className="user-message error-message">
                    {error}
                </div>
            )}


            {success && (
                <div className="user-message success-message">
                    {success}
                </div>
            )}


            <div className="user-summary">

                <div className="summary-card">
                    <span>Total Accounts</span>
                    <strong>{users.length}</strong>
                </div>

                <div className="summary-card">
                    <span>Active</span>

                    <strong>
                        {
                            users.filter(
                                user =>
                                    user.status === "ACTIVE"
                            ).length
                        }
                    </strong>
                </div>

                <div className="summary-card">
                    <span>Suspended</span>

                    <strong>
                        {
                            users.filter(
                                user =>
                                    user.status === "SUSPENDED"
                            ).length
                        }
                    </strong>
                </div>

                <div className="summary-card">
                    <span>Dormant</span>

                    <strong>
                        {
                            users.filter(
                                user =>
                                    user.status === "DORMANT"
                            ).length
                        }
                    </strong>
                </div>

            </div>


            <div className="user-table-container">

                <table className="user-table">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Provider</th>
                            <th>Last Login</th>
                            <th>Last Activity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>


                    <tbody>

                        {users.length === 0 ? (

                            <tr>
                                <td
                                    colSpan="8"
                                    className="empty-users"
                                >
                                    No user accounts found.
                                </td>
                            </tr>

                        ) : (

                            users.map(user => {

                                const processing =
                                    processingUserId === user.id;


                                return (

                                    <tr key={user.id}>

                                        <td>
                                            {user.id}
                                        </td>


                                        <td>
                                            <div className="user-email">
                                                {user.email}
                                            </div>

                                            <div className="user-created">
                                                Created{" "}
                                                {formatDate(
                                                    user.createdAt
                                                )}
                                            </div>
                                        </td>


                                        <td>

                                            <select
                                                value={user.role}
                                                disabled={processing}
                                                onChange={
                                                    event =>
                                                        handleRoleChange(
                                                            user.id,
                                                            event.target.value
                                                        )
                                                }
                                            >

                                                {ROLES.map(role => (

                                                    <option
                                                        key={role}
                                                        value={role}
                                                    >
                                                        {formatValue(role)}
                                                    </option>

                                                ))}

                                            </select>

                                        </td>


                                        <td>

                                            <span
                                                className={
                                                    `status-badge status-${user.status.toLowerCase()}`
                                                }
                                            >
                                                {formatValue(
                                                    user.status
                                                )}
                                            </span>

                                        </td>


                                        <td>
                                            {formatValue(
                                                user.authProvider
                                            )}
                                        </td>


                                        <td>
                                            {formatDate(
                                                user.lastLoginAt
                                            )}
                                        </td>


                                        <td>
                                            {formatDate(
                                                user.lastActivityAt
                                            )}
                                        </td>


                                        <td>

                                            <div className="user-actions">

                                                {user.status === "ACTIVE" && (

                                                    <button
                                                        disabled={processing}
                                                        className="action-button suspend-button"
                                                        onClick={
                                                            () =>
                                                                handleSuspend(
                                                                    user
                                                                )
                                                        }
                                                    >
                                                        Suspend
                                                    </button>

                                                )}


                                                {(
                                                    user.status === "SUSPENDED"
                                                    ||
                                                    user.status === "DORMANT"
                                                ) && (

                                                    <button
                                                        disabled={processing}
                                                        className="action-button reactivate-button"
                                                        onClick={
                                                            () =>
                                                                handleReactivate(
                                                                    user
                                                                )
                                                        }
                                                    >
                                                        Reactivate
                                                    </button>

                                                )}


                                                {user.status === "DORMANT" && (

                                                    <button
                                                        disabled={processing}
                                                        className="action-button delete-button"
                                                        onClick={
                                                            () =>
                                                                handleDeletionPending(
                                                                    user
                                                                )
                                                        }
                                                    >
                                                        Mark for Deletion
                                                    </button>

                                                )}


                                                {user.status ===
                                                    "DELETION_PENDING" && (

                                                    <span className="pending-text">
                                                        Awaiting deletion
                                                    </span>

                                                )}


                                                {processing && (
                                                    <span className="processing-text">
                                                        Processing...
                                                    </span>
                                                )}

                                            </div>

                                        </td>

                                    </tr>
                                );
                            })

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}


export default UserManagement;