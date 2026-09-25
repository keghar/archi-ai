import { clerkMiddleware } from "@clerk/nextjs/server";

const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in";
const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "/sign-up";

export default clerkMiddleware(async (auth, request) => {
  const isPublicRoute = [signInUrl, signUpUrl].some((url) => {
    const path = new URL(url, request.url).pathname.replace(/\/+$/, "") || "/";
    const pathname = request.nextUrl.pathname;

    return pathname === path || (path !== "/" && pathname.startsWith(`${path}/`));
  });

  if (!isPublicRoute) {
    await auth.protect();
  }
}, { signInUrl, signUpUrl });

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
