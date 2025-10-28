import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('accessToken')

    const protectedRoutes = ['/dashboard', '/profile', '/settings']
    const authRoutes = ['/login', '/register']

    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    )

    const isAuthRoute = authRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    ) 

    if (isProtectedRoute && !accessToken) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (isAuthRoute && accessToken) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
