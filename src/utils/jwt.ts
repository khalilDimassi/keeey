import { jwtVerify, JWTPayload, decodeJwt as joseDecodeJwt } from 'jose';

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
    user_id: string;
    email: string;
    user_role: string;
    exp: number;
    iat: number;
}

export const decodeJwtUnsafe = (token: string | null): KeeeyJwtPayload | null => {
    if (!token) return null;

    try {
        const payload = joseDecodeJwt(token);
        if (isKeeeyJwtPayload(payload)) {
            console.log('JWT Payload (typed):', JSON.stringify(payload, null, 2));
            return payload;
        }
        console.log('JWT payload does not match expected structure');
        return null;

    } catch (error) {
        console.error("JWT decoding failed:", error);
        return null;
    }
}

export const decodeJwt = async (token: string | null): Promise<KeeeyJwtPayload | null> => {
    if (!token) return null;

    const jwtSecret = import.meta.env.VITE_JWT_SECRET;
    if (!jwtSecret) {
        console.warn('VITE_JWT_SECRET not available, falling back to unsafe decode');
        return decodeJwtUnsafe(token);
    }

    try {
        // Note: jose uses Uint8Array for secrets, so we encode the string 
        const secretKey = new TextEncoder().encode(jwtSecret);
        const { payload } = await jwtVerify(token, secretKey);
        if (isKeeeyJwtPayload(payload)) {
            return payload;
        }
        return null;

    } catch (error) {
        console.error("JWT verification failed:", error);
        console.warn('Falling back to unsafe decode for claims reading');
        return decodeJwtUnsafe(token);
    }
}

export const isKeeeyJwtPayload = (payload: JWTPayload): payload is KeeeyJwtPayload => {
    return (
        typeof payload === 'object' &&
        payload !== null &&
        'user_id' in payload &&
        typeof payload.user_id === 'string' &&
        'user_role' in payload &&
        typeof payload.user_role === 'string' &&
        'email' in payload &&
        typeof payload.verified === 'boolean' &&
        'iat' in payload &&
        typeof payload.iat === 'number' &&
        'exp' in payload &&
        typeof payload.exp === 'number'
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