export async function registerUser(email: string, password: string) {
    return fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    }).then(r => r.json())
}