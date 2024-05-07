import { authMiddleware } from "@clerk/nextjs";
 
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
    publicRoutes: [
        "/", 
        "/events/:id",
        // "/api/webhook/clerk",
        "/api/webhook/stripe",
        "/api/uploadthing",
        // this one is for our webhook for clerk auth
        // "/api/webhook(.*)"

    ],

    //reason for  using ignored routes is:
//A list of routes that should be ignored by the middleware. This list typically includes routes for static files or Next.js internals. 
//For improved performance, these routes should be skipped using the default config.matcher instead.

    ignoredRoutes:[
        "/api/webhooks(.*)",
        // "/api/webhook/clerk",
        "/api/webhook/stripe",
        "/api/uploadthing",
      
    ]
});

//In summary, ignoredRoutes completely bypasses authentication middleware processing for specified routes,
// while publicRoutes allows access to specified routes without requiring authentication but still subjects them to authentication checks.
// Both options serve different purposes and may be used in different scenarios based on the requirements of your application.
 
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};