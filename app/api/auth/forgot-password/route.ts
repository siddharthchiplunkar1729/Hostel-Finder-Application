import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { generatePasswordResetToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const genericMessage = 'If an account with that email exists, a password reset link has been sent.';
        const userRes = await pool.query(
            'SELECT id, password FROM users WHERE email = $1 LIMIT 1',
            [email]
        );

        if ((userRes.rowCount ?? 0) === 0) {
            return NextResponse.json({
                success: true,
                message: genericMessage
            });
        }

        const user = userRes.rows[0];
        const token = generatePasswordResetToken(user);
        const appUrl = (process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin).replace(/\/$/, '');
        const resetUrl = `${appUrl}/auth/reset-password?token=${encodeURIComponent(token)}`;

        console.info(`[Auth] Password reset requested for: ${email}`);

        if (process.env.NODE_ENV !== 'production') {
            return NextResponse.json({
                success: true,
                message: genericMessage,
                devResetUrl: resetUrl
            });
        }

        // TODO: Wire this token into an email provider in production.
        return NextResponse.json({
            success: true,
            message: genericMessage
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'Failed to process forgot password request', details: message },
            { status: 500 }
        );
    }
}
