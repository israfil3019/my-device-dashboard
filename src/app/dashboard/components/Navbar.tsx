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

  // Fetch user from React Query or fallback to localStorage or default
  const user = useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      const cachedUser = queryClient.getQueryData<User>(["user"]);
      if (cachedUser) {
        return cachedUser;
      }

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        queryClient.setQueryData(["user"], parsedUser); // Sync to React Query cache
        return parsedUser;
      }

      return {
        id: 0,
        name: "Challenge 2025",
        email: "guest@example.com",
        company: { name: "Birre Soft" },
      };
    },
    staleTime: Infinity, // Prevent automatic refetch
  }).data;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <nav className="py-3 bg-gray-800 text-white fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-lg sm:text-xl font-bold truncate">
          {user && user.company.name}
        </h1>

        {/* User Info and Actions */}
        <div className="flex items-center gap-2 sm:gap-4 text-sm sm:text-base">
          {user && (
            <p className="hidden sm:block truncate">
              Logged in as: <strong>{user.name}</strong>
            </p>
          )}
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
