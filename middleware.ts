// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { hasPermission, hasRole } from "./utils/auth";
import { logger } from "@/utils/logger";
import { rateLimit } from "@/utils/rateLimit";

const publicRoutes = ["/", "/sign-in(.*)", "/sign-up(.*)", "/api/webhooks/clerk"];

export default clerkMiddleware({
    publicRoutes: publicRoutes,
    async afterAuth(auth, req) {
        if (!auth.userId && !auth.isPublicRoute) {
            logger.info(`Unauthenticated user attempting to access ${req.url}`);
            const signInUrl = new URL('/sign-in', req.url);
            signInUrl.searchParams.set('redirect_url', req.url);
            return NextResponse.redirect(signInUrl);
        }

        if (auth.userId && !auth.orgId && req.nextUrl.pathname.startsWith('/dashboard')) {
            logger.info(`User ${auth.userId} attempting to access dashboard without selecting an organization`);
            const orgSelection = new URL('/org-selection', req.url);
            return NextResponse.redirect(orgSelection);
        }

        // RBAC checks
        if (req.nextUrl.pathname.startsWith('/admin') && !hasRole('org:admin')) {
            logger.warn(`User ${auth.userId} attempting unauthorized access to admin area`);
            return NextResponse.redirect(new URL('/unauthorized', req.url));
        }

        if (req.nextUrl.pathname.startsWith('/client') && !hasPermission('org:client:read')) {
            logger.warn(`User ${auth.userId} attempting unauthorized access to client area`);
            return NextResponse.redirect(new URL('/unauthorized', req.url));
        }

        // Rate limiting
        const ip = req.ip ?? '127.0.0.1'
        const { success } = await rateLimit(ip)
        if (!success) {
            logger.warn(`Rate limit exceeded for IP ${ip}`);
            return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 })
        }

        // Add more RBAC checks as needed
    },
});