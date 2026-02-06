import { NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

const isClerkEnabled = () => {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) return false;
  const m = /^pk_(test|live)_([A-Za-z0-9]+)$/.exec(key);
  if (!m) return false;
  const body = m[2];
  if (body.length < 16) return false;
  if (/^0+$/.test(body)) return false;
  return true;
};

export default isClerkEnabled() ? clerkMiddleware() : () => NextResponse.next();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
