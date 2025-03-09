import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Completely disable middleware to prevent redirect loops
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

// Empty matcher to prevent middleware from running
export const config = {
  matcher: [],
};
