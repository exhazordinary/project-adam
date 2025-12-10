import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/api";
import { useEffect, useState, useRef, useCallback } from "react";

const MAX_RETRIES = 3;

export const useAuthUser = () => {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const [userStored, setUserStored] = useState(false);
  const [isStoring, setIsStoring] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const retryCountRef = useRef(0);
  const hasAttemptedRef = useRef(false);

  // This query acts as a test to see if Convex auth is ready
  // It returns null when not authenticated (doesn't throw)
  // We run it when signed in to check if Convex has the auth token
  const authCheckResult = useQuery(
    api.auth.getCurrentUser,
    isSignedIn ? {} : "skip"
  );

  // Convex is authenticated when the query returns (even if null for new users)
  // authCheckResult === undefined means query is still loading/not ready
  const isConvexReady = isSignedIn && authCheckResult !== undefined;

  // Query for the stored user (only after we've successfully stored them)
  const convexUser = useQuery(
    api.auth.getCurrentUser,
    isSignedIn && userStored ? {} : "skip"
  );

  const storeUserMutation = useMutation(api.auth.storeUser);

  const storeUser = useCallback(async () => {
    if (isStoring) return;

    setIsStoring(true);
    setError(null);

    try {
      await storeUserMutation();
      setUserStored(true);
      setIsStoring(false);
      retryCountRef.current = 0;
      hasAttemptedRef.current = true;
    } catch (err) {
      console.error("Failed to store user:", err);
      setIsStoring(false);

      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current += 1;
        const delay = 1000 * retryCountRef.current; // Exponential backoff
        setTimeout(() => {
          if (isSignedIn && clerkUser && isConvexReady) {
            storeUser();
          }
        }, delay);
      } else {
        setError(err instanceof Error ? err : new Error("Failed to sync user"));
        hasAttemptedRef.current = true;
      }
    }
  }, [storeUserMutation, isSignedIn, clerkUser, isStoring, isConvexReady]);

  // Sync user to Convex when:
  // 1. Clerk says we're signed in
  // 2. Convex has received the auth token (authCheckResult !== undefined)
  // 3. We haven't already stored the user
  useEffect(() => {
    if (isSignedIn && isConvexReady && clerkUser && !userStored && !isStoring && !error && !hasAttemptedRef.current) {
      storeUser();
    }

    // Reset when signed out
    if (!isSignedIn) {
      setUserStored(false);
      setIsStoring(false);
      setError(null);
      retryCountRef.current = 0;
      hasAttemptedRef.current = false;
    }
  }, [isSignedIn, isConvexReady, clerkUser, userStored, isStoring, error, storeUser]);

  // Retry function for consumers
  const retry = useCallback(() => {
    setError(null);
    retryCountRef.current = 0;
    hasAttemptedRef.current = false;
    setUserStored(false);
  }, []);

  // Loading is true while:
  // - Clerk is loading
  // - We're storing the user
  // - User is signed in but Convex isn't ready yet (auth token not received)
  // - User is signed in and Convex ready but we haven't stored/fetched user yet (unless there's an error)
  const loading = !isLoaded ||
    isStoring ||
    (isSignedIn && !isConvexReady) ||
    (isSignedIn && isConvexReady && !error && (!userStored || convexUser === undefined));

  return {
    user: convexUser,
    clerkUser,
    isLoaded,
    isSignedIn: isSignedIn ?? false,
    loading,
    error,
    retry,
  };
};
