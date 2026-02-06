"use client";

import type { ReactNode } from "react";

// NOTE: We intentionally keep this file very small and dependency-free.
// It provides CI/secretless-build safe fallbacks for Clerk hooks/components.

import {
  ClerkProvider,
  SignedIn as ClerkSignedIn,
  SignedOut as ClerkSignedOut,
  SignInButton as ClerkSignInButton,
  SignOutButton as ClerkSignOutButton,
  useAuth as clerkUseAuth,
  useUser as clerkUseUser,
} from "@clerk/nextjs";

export function isClerkEnabled(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) return false;

  // Clerk validates publishable key contents at runtime; use a conservative heuristic.
  const m = /^pk_(test|live)_([A-Za-z0-9]+)$/.exec(key);
  if (!m) return false;
  const body = m[2];
  if (body.length < 16) return false;
  if (/^0+$/.test(body)) return false;
  return true;
}

export function SignedIn(props: { children: ReactNode }) {
  if (!isClerkEnabled()) return null;
  return <ClerkSignedIn>{props.children}</ClerkSignedIn>;
}

export function SignedOut(props: { children: ReactNode }) {
  if (!isClerkEnabled()) return <>{props.children}</>;
  return <ClerkSignedOut>{props.children}</ClerkSignedOut>;
}

// Accept arbitrary Clerk component props so existing call sites don't need edits.
export function SignInButton(props: any) {
  if (!isClerkEnabled()) return null;
  return <ClerkSignInButton {...props} />;
}

export function SignOutButton(props: any) {
  if (!isClerkEnabled()) return null;
  return <ClerkSignOutButton {...props} />;
}

export function useUser() {
  if (!isClerkEnabled()) {
    return { isLoaded: true, isSignedIn: false, user: null } as const;
  }
  return clerkUseUser();
}

export function useAuth() {
  if (!isClerkEnabled()) {
    return {
      isLoaded: true,
      isSignedIn: false,
      userId: null,
      sessionId: null,
      getToken: async () => null,
    } as const;
  }
  return clerkUseAuth();
}

// Re-export ClerkProvider for places that want to mount it, but strongly prefer
// gating via isClerkEnabled() at call sites.
export { ClerkProvider };
