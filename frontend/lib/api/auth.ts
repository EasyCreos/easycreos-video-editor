import { apiFetch } from "@/lib/api";

export async function registerUser(name: string, email: string, password: string) {
    return apiFetch("/users", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
    });
}