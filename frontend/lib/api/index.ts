export * as AuthAPI from "./auth"

let csrfToken: string | null = null;

async function fetchCsrfToken() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/csrf`, {
        credentials: "include",
    });
    const data = await res.json();
    csrfToken = data.csrfToken;
    return csrfToken;
}

export async function apiFetch(
    url: string,
    options: RequestInit = {},
): Promise<any> {
    if (!csrfToken) {
        await fetchCsrfToken();
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
            ...(options.headers || {}),
        },
        ...options,
    });

    if (res.status === 401 && !(options as any)._retry) {
        const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
            },
        });

        if (refreshRes.ok) {
            return apiFetch(url, { ...(options as any), _retry: true });
        }

        const errBody = await res.json().catch(() => ({}));
        throw new Error((errBody as any).message || `Request failed with status ${res.status}`);
    }

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error((errorData as any).message || `Request failed with status ${res.status}`);
    }

    if (res.status === 403) {
        await fetchCsrfToken();
        return apiFetch(url, options);
    }

    return res.json();
}
