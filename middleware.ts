import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Augmenter la limite de taille pour les uploads
  if (request.nextUrl.pathname === '/api/upload') {
    return NextResponse.next({
      headers: {
        'Accept': 'application/json',
      },
    });
  }

  return NextResponse.next();
} 