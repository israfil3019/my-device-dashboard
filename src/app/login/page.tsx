"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/utils/api";

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      if (![200, 201].includes(response.status)) {
        throw new Error("Invalid credentials");
      }
      const { name, email, role, accessToken, company } = response.data.data;
      localStorage.setItem("token", accessToken);
      login({
        name,
        email,
        role,
        companyName: company?.name || "Device Dashboard",
        accessToken,
      });
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg">Logging in, please wait...</p>
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md max-w-sm w-full"
      >
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            className="w-full p-2 border rounded"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Password</label>
          <input
            {...register("password", { required: "Password is required" })}
            type="password"
            className="w-full p-2 border rounded"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}
