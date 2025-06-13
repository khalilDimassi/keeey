import { jwtVerify, JWTPayload } from 'jose';

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
    return token ? { Authorization: `Bearer ${token}` } : { Authorization: '' };
};

// Decode JWT Token
interface KeeeyJwtPayload extends JWTPayload {
    UserID: string;
    Email: string;
    Role: string;
    Verified: boolean;
    ExpiresAt: number;
    IssuedAt: number;
}

export const decodeJwt = async (token: string | null): Promise<KeeeyJwtPayload | null> => {
    if (!token) return null;
    try {
        // Note: jose uses Uint8Array for secrets, so we encode the string
        const secretKey = new TextEncoder().encode(import.meta.env.JWT_SECRET);

        const { payload } = await jwtVerify(token, secretKey);

        // Type check (your existing type guard works perfectly)
        if (isKeeeyJwtPayload(payload)) {
            return payload;
        }
        return null;

    } catch (error) {
        console.error("JWT verification failed:", error);
        return null;
    }
}

export const isKeeeyJwtPayload = (payload: JWTPayload): payload is KeeeyJwtPayload => {
    return (
        typeof payload === 'object' &&
        payload !== null &&
        'UserID' in payload &&
        typeof payload.UserID === 'string' &&
        'Role' in payload &&
        typeof payload.Role === 'string' &&
        'Email' in payload &&
        typeof payload.Email === 'string' &&
        'Verified' in payload &&
        typeof payload.Verified === 'boolean' &&
        'IssuedAt' in payload &&
        typeof payload.IssuedAt === 'number' &&
        'ExpiresAt' in payload &&
        typeof payload.ExpiresAt === 'number'
    );
}


const USER_ID_KEY = "user_id";

// Save user ID in localStorage
export const saveUserId = (userId: string) => {
    localStorage.setItem(USER_ID_KEY, userId);
};

// Retrieve user ID from localStorage
export const getUserId = (): string | null => {
    return localStorage.getItem(USER_ID_KEY);
};

// Remove user ID from localStorage (Logout)
export const removeUserId = () => {
    localStorage.removeItem(USER_ID_KEY);
};

// Update user ID (Re-login or profile update)
export const updateUserId = (newUserId: string) => {
    saveUserId(newUserId);
};

// Check if user ID exists
export const hasUserId = (): boolean => {
    return getUserId() !== null;
};