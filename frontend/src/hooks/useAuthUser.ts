import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/api";
import { useEffect } from "react";

export const useAuthUser = () => {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();

  const convexUser = useQuery(
    api.auth.getCurrentUser,
    isSignedIn ? {} : "skip"
  );

  const storeUser = useMutation(api.auth.storeUser);

  // Sync user to Convex when they sign in
  useEffect(() => {
    if (isSignedIn && clerkUser) {
      storeUser().catch(console.error);
    }
  }, [isSignedIn, clerkUser, storeUser]);

  return {
    user: convexUser,
    clerkUser,
    isLoaded,
    isSignedIn: isSignedIn ?? false,
    loading: !isLoaded || (isSignedIn && convexUser === undefined),
  };
};
