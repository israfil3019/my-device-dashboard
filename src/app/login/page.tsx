'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth(); 
  const { register, handleSubmit } = useForm<LoginFormInputs>();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      // Fetch users from users.json
      const response = await fetch('/mock/users.json');
      const users = await response.json();

      const user = users.find(
        (u: { email: string; password: string }) =>
          u.email === data.email && u.password === data.password,
      );

      if (user) {
        login({
          id: user.id,
          name: user.name,
          email: user.email,
        });

        localStorage.setItem('token', user.accessToken);
        router.push('/dashboard');
      } else {
        setError('Invalid email or password.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md max-w-sm w-full"
      >
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            {...register('email', { required: 'Email is required' })}
            type="email"
            className="w-full p-2 border rounded"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Password</label>
          <input
            {...register('password', { required: 'Password is required' })}
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
