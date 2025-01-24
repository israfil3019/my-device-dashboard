import { useMutation, useQueryClient } from "@tanstack/react-query";

type LoginCredentials = {
  email: string;
  password: string;
};

type AuthResponse = {
  success: boolean;
  message: string;
  user?: {
    id: number;
    name: string;
    role: string;
    company: { name: string };
  };
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<
    {
      success: boolean;
      message: string;
      user?: {
        id: number;
        name: string;
        role: string;
        company: { name: string };
      };
    },
    Error,
    LoginCredentials
  >({
    mutationKey: ["auth", "login"],
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await fetch("/api/proxy/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include", // Include cookies in the request
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const responseData: AuthResponse = await response.json();

      if (!responseData || responseData.success !== true) {
        throw new Error("Invalid response structure from API");
      }

      return responseData;
    },
    onSuccess: (response) => {
      if (response?.success) {
        console.log("Login successful:", response.message);

        if (response.user) {
          queryClient.setQueryData(["user"], response.user);
        }
      } else {
        console.error("Unexpected response structure:", response);
      }
    },
    onError: (error) => {
      console.error("Login error:", error.message);
    },
  });
};
