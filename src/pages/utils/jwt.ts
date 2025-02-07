const TOKEN_KEY = "auth_token";

// Save JWT token in localStorage
export const saveToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
};

// Retrieve JWT token from localStorage
export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

// Remove JWT token from localStorage (Logout)
export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

// Update JWT token (Re-login)
export const updateToken = (newToken: string) => {
    saveToken(newToken);
};

// Check if user is authenticated (returns true if token exists)
export const isAuthenticated = (): boolean => {
    return getToken() !== null;
};

// Utility to get the Authorization header
export const getAuthHeader = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};
