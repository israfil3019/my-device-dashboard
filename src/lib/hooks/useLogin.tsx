import { useMutation, useQueryClient } from "@tanstack/react-query";

type LoginCredentials = {
  email: string;
  password: string;
};

type AuthResponse = {
  data: {
    id: number;
    isActive: boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    name: string;
    password: string;
    email: string;
    role: string;
    isSubscribed: boolean;
    lang: string;
    passwordKey: string;
    company: object;
    accessToken: string;
  };
};

type User = Omit<AuthResponse["data"], "password" | "passwordKey">;

const loginUser = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await fetch("/api/proxy/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) throw new Error("Authentication failed");
  return response.json();
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationKey: ["auth", "login"],
    mutationFn: loginUser,
    onSuccess: (response) => {
      console.log(response);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, passwordKey, ...userData } = response.data; // Remove password and passwordKey from user data

      localStorage.setItem("token", response.data.accessToken);
      queryClient.setQueryData<User>(["user"], userData);
    },
    onError: (error) => {
      console.error("Login error:", error.message);
    },
  });
};
