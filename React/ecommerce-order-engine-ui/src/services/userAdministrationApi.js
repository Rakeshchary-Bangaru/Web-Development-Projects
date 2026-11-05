import { authenticatedFetch } from "./apiClient";

const API_BASE = "/api/support/users";


export async function getUserAccounts() {

    const response = await authenticatedFetch(
        API_BASE
    );

    if (!response.ok) {
        throw new Error(
            "Failed to load user accounts"
        );
    }

    return response.json();
}


export async function updateUserRole(
    userId,
    role
) {

    const response = await authenticatedFetch(
        `${API_BASE}/${userId}/role`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                role,
            }),
        }
    );


    if (!response.ok) {
        throw new Error(
            "Failed to update user role"
        );
    }

    return response.json();
}


export async function updateUserStatus(
    userId,
    status
) {

    const response = await authenticatedFetch(
        `${API_BASE}/${userId}/status`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                status,
            }),
        }
    );


    if (!response.ok) {
        throw new Error(
            "Failed to update account status"
        );
    }

    return response.json();
}


export async function markUserDeletionPending(
    userId
) {

    const response = await authenticatedFetch(
        `${API_BASE}/${userId}/deletion-pending`,
        {
            method: "PATCH",
        }
    );


    if (!response.ok) {
        throw new Error(
            "Failed to mark account for deletion"
        );
    }

    return response.json();
}