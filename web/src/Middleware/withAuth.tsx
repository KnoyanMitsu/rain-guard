import { getToken } from 'next-auth/jwt';
import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from 'next/server'
import React from 'react'

function withAuth(
    middleware: NextMiddleware,
    requireAuth: string[] = []
) {
  return async (req: NextRequest, next: NextFetchEvent) => {
    const token = req.nextUrl.pathname;

    if (requireAuth.includes(token)) {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }
    
    return middleware(req,next);
  }
}

export default withAuth