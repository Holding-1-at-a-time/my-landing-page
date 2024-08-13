// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs";

export default clerkMiddleware({
    publicRoutes: ["/", "/api/webhooks/clerk"],
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};  