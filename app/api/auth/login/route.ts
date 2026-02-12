import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { generateToken, generateRefreshToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find user
        let result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email.toLowerCase()]
        );
        let user = result.rows[0];

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Strict password check
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Fetch student info if role is Student
        let studentData = null;
        if (user.role === 'Student') {
            const studentRes = await pool.query(
                'SELECT * FROM students WHERE user_id = $1',
                [user.id]
            );
            studentData = studentRes.rows[0] ? studentRes.rows[0].id : null;
        }

        // Generate tokens
        // Adapter for JWT generator if it expects mongoose object
        const userForToken = {
            _id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            canAccessDashboard: user.can_access_dashboard
        };

        const token = generateToken(userForToken);
        const refreshToken = generateRefreshToken(userForToken);

        // Remove sensitive data
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            success: true,
            user: {
                ...userWithoutPassword,
                _id: user.id, // map id to _id for frontend compatibility if needed
                canAccessDashboard: user.can_access_dashboard
            },
            student: studentData,
            token,
            refreshToken,
            message: 'Login successful'
        });

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Login failed', details: error.message },
            { status: 500 }
        );
    }
}
