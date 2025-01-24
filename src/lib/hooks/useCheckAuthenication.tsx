import Spinner from "@/app/loading/Spinner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useCheckAuthentication = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const checkAuthenticationAndRedirect = async () => {
    setIsLoading(true); // Show loading overlay
    try {
      const response = await fetch("/api/proxy/me", {
        method: "GET",
        credentials: "include", // Include cookies in the request
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Authenticated user:", data);

        // Redirect to dashboard if authenticated
        router.push("/dashboard");
      }
    } catch (authError) {
      console.error("Authentication check failed:", authError);
    } finally {
      setIsLoading(false); // Hide loading overlay
    }
  };

  const SpinnerOverlay = () => isLoading && <Spinner overlay={true} />;

  return { checkAuthenticationAndRedirect, SpinnerOverlay };
};
