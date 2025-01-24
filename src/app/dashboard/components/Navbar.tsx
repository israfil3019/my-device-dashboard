"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type User = {
  id: number;
  name: string;
  email: string;
  company: { name: string };
};

const Navbar: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch user details securely
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: async (): Promise<User> => {
      // Fetch data only if not cached
      const cachedUser = queryClient.getQueryData<User>(["user"]);
      if (cachedUser) return cachedUser;

      const response = await fetch("/api/proxy/me", {
        method: "GET",
        credentials: "include", // Include cookies in request
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const userData = await response.json();
      queryClient.setQueryData(["user"], userData); // Cache the user data
      return userData;
    },
    staleTime: Infinity, // Prevent automatic refetch
    retry: false, // Disable retry to avoid unnecessary requests
  });

  const handleLogout = async () => {
    // Invalidate session via API
    await fetch("/api/proxy/logout", {
      method: "POST",
      credentials: "include", // Include cookies in request
    });

    // Properly remove user data
    queryClient.removeQueries({ queryKey: ["user"] }); // Use the correct syntax
    router.push("/login");
  };
  return (
    <nav className="py-3 bg-gray-800 text-white fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <h1 className="pl-4 text-lg sm:text-xl font-bold truncate">
          {user?.company?.name || "Birre Soft"}
        </h1>

        {/* User Info and Actions */}
        <div className="mr-4 flex items-center gap-2 sm:gap-4 text-sm sm:text-base">
          <p className="hidden sm:block truncate">
            Logged in as: <strong>{user?.name || "Challenge 2025"}</strong>
          </p>
          <button
            onClick={handleLogout}
            className="px-3 py-1 sm:px-4 sm:py-2 bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
