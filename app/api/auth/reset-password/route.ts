import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { getPasswordVersion, verifyPasswordResetToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const token = typeof body?.token === 'string' ? body.token.trim() : '';
        const password = typeof body?.password === 'string' ? body.password : '';

        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token and new password are required' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        const payload = verifyPasswordResetToken(token) as {
            id?: string;
            passwordVersion?: string;
        } | null;

        if (!payload?.id || !payload.passwordVersion) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        const userRes = await pool.query(
            'SELECT id, password FROM users WHERE id = $1 LIMIT 1',
            [payload.id]
        );

        if ((userRes.rowCount ?? 0) === 0) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        const user = userRes.rows[0];
        const currentPasswordVersion = getPasswordVersion(user.password);

        // If password changed after token issuance, invalidate this token.
        if (payload.passwordVersion !== currentPasswordVersion) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await pool.query(
            'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
            [hashedPassword, user.id]
        );

        return NextResponse.json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'Failed to reset password', details: message },
            { status: 500 }
        );
    }
}
