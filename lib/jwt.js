import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '7d';
const PASSWORD_RESET_EXPIRES_IN = '15m';

/**
 * Generate JWT token for user
 */
export function generateToken(user) {
    const payload = {
        id: user._id || user.id,
        email: user.email,
        role: user.role
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify JWT token
 */
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
}

/**
 * Generate refresh token
 */
export function generateRefreshToken(user) {
    const payload = {
        id: user._id || user.id,
        type: 'refresh'
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

/**
 * Stable password version hash used for reset-token invalidation after password changes.
 */
export function getPasswordVersion(passwordHash) {
    return crypto.createHash('sha256').update(passwordHash).digest('hex');
}

/**
 * Generate short-lived password reset token
 */
export function generatePasswordResetToken(user) {
    const payload = {
        id: user._id || user.id,
        type: 'password_reset',
        passwordVersion: getPasswordVersion(user.password)
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: PASSWORD_RESET_EXPIRES_IN });
}

/**
 * Verify password reset token
 */
export function verifyPasswordResetToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded.type !== 'password_reset') {
            return null;
        }

        return decoded;
    } catch {
        return null;
    }
}

/**
 * Extract token from Authorization header
 */
export function extractToken(request) {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    return authHeader.substring(7);
}

/**
 * Decode token without verification (for debugging)
 */
export function decodeToken(token) {
    try {
        return jwt.decode(token);
    } catch {
        return null;
    }
}
