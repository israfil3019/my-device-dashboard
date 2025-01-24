"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useLogin } from "@/lib/hooks/useLogin";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [isRouting, setIsRouting] = useState(false); // Add a state for routing
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const { mutate: login, isPending, error } = useLogin();

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    login(data, {
      onSuccess: () => {
        setIsRouting(true); // Start routing
        router.push("/dashboard");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-2">{error.message}</p>
          )}

          <button
            type="submit"
            disabled={isPending || isRouting} // Disable when pending or routing
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isPending || isRouting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isPending || isRouting ? "Signing in..." : "Sign In"}
          </button>

          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
