import { apiFetch } from "@/lib/api";

export async function registerUser(name: string, email: string, password: string) {
    return apiFetch("/auth/register", {  
        method: "POST",
        body: JSON.stringify({ name, email, password }),
    });
}

export async function loginUser(email: string, password: string) {
    return apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}

export async function logoutUser() {
    return apiFetch("/auth/logout", {
        method: "POST",
    });
}

export async function getCurrentUser() {
    return apiFetch("/auth/me", {
        method: "GET",
    });
}

export async function checkAuth() {
    return apiFetch("/auth/check", {
        method: "GET",
    });
}