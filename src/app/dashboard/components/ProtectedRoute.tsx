"use client";

import Spinner from "@/app/loading/Spinner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch("/api/proxy/me", {
          method: "GET",
          credentials: "include", // Include cookies in the request
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Authenticated user data:", data);

          // User is authenticated, allow access to the dashboard
          setIsAuthenticated(true);
        } else {
          // Token is invalid or missing, redirect to login
          setIsAuthenticated(false);
          router.push("/login");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        router.push("/login");
      }
    };

    checkAuthentication();
  }, [router]);

  if (isAuthenticated === null) {
    return <Spinner overlay={true} />;
  }

  return <>{isAuthenticated ? children : null}</>;
};

export default ProtectedRoute;
