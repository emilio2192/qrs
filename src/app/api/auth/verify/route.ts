import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    try {
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as {
        userId: string;
        email: string;
        userType: string;
        iat: number;
        exp: number;
      };

      // Check if user still exists and is active
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          userType: true,
          isActive: true,
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 401 }
        );
      }

      if (!user.isActive) {
        return NextResponse.json(
          { error: 'Account is deactivated' },
          { status: 401 }
        );
      }

      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        return NextResponse.json(
          { error: 'Token expired' },
          { status: 401 }
        );
      }

      // Return user data and token validity
      return NextResponse.json({
        valid: true,
        user,
        token,
        expiresAt: new Date(decoded.exp * 1000).toISOString(),
      });

    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        return NextResponse.json(
          { error: 'Token expired' },
          { status: 401 }
        );
      } else if (jwtError instanceof jwt.JsonWebTokenError) {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        );
      } else {
        return NextResponse.json(
          { error: 'Token verification failed' },
          { status: 401 }
        );
      }
    }

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 