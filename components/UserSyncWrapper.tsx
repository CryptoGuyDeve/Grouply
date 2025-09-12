"use client";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useCallback, useEffect, useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import streamClient from "@/lib/stream";
import { createToken } from "@/actions/createToken";

function UserSyncWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convex mutation to sync user data
  const createOrUpdateUser = useMutation(api.users.upsertUser);

  const syncUser = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      const tokenProvider = async () => {
        if (!user?.id) {
            throw new Error("User not authenticated");
        }

        const token = await createToken(user.id);
        return token;
      }

      await createOrUpdateUser({
        userId: user.id,
        name:
          user.fullName ||
          user.firstName ||
          user.emailAddresses[0]?.emailAddress ||
          "Unknown",
        email: user.emailAddresses[0]?.emailAddress || "",
        imageUrl: user.imageUrl || "",
      });

      // 2.Connect user to stream
      await streamClient.connectUser(
        {
            id: user.id,
            name : user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress || "Unknown",
            image: user.imageUrl || "",
        },
        tokenProvider
      );
    } catch (err) {
      console.error("Error syncing user:", err);
      setError(err instanceof Error ? err.message : "Failed to sync user");
    } finally {
      setIsLoading(false);
    }
  }, [createOrUpdateUser, user]);

  const disconnectUser = useCallback(async () => {
    try {
        await streamClient.disconnectUser();
    } catch (err) {
        console.error("Failed to disconnect user:", err);
    }
  }, []);

  useEffect(() => {
    if (!isUserLoaded) return;

    if (user) {
        syncUser();
    } else {
        disconnectUser();
        setIsLoading(false);
    }

    //Cleanup function
    return () => {
        if (user) {
            disconnectUser();
        }
    }
  }, [user, isUserLoaded, syncUser, disconnectUser]);

  // Loading state
  if (!isUserLoaded || isLoading) {
    return (
      <LoadingSpinner
        size="lg"
        message={!isUserLoaded ? "Loading user..." : "Syncing user..."}
        className="min-h-screen"
      />
    );
  }

  if (error) {
    return (
      <div className="flex-1 items-center justify-center bg-white px-6">
        <p className="text-red-500 text-lg font-semibold mb-2">Sync Error</p>
        <p className="text-gray-600 text-center mb-4">{error}</p>
        <p className="text-gray-500 text-sm text-center">
          Please try restarting the app or contact support if the issue
          persists.
        </p>
      </div>
    );
  }

  return <div>{children}</div>;
}

export default UserSyncWrapper;
