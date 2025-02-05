// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const allowedOrigins = [
  'https://taskify-ai-jet.vercel.app',
  'https://taskify-6rkg57ufh-shrekpepsis-projects.vercel.app',
  'http://localhost:3000'
];

export function middleware(request: NextRequest) {
  // Check if it's an OPTIONS request
  if (request.method === 'OPTIONS') {
    const origin = request.headers.get('origin') || '';

    // Check if the origin is allowed
    if (allowedOrigins.includes(origin)) {
      // Create a new response
      const response = new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET,DELETE,PATCH,POST,PUT,OPTIONS',
          'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400',
        },
      });
      
      return response;
    }
  }

  // Continue with the request if it's not an OPTIONS request
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};