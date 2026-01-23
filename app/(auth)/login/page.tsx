"use client";

import { FormError } from "@/lib/components/FormError";
import { loginUser } from "@/lib/backend-api";
import { Login, LoginSchema } from "@/lib/types/auth.zod";
import { theme } from "@/lib/styles/theme";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<Login>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: Login) => {
    try {
      await loginUser(data);
      router.replace("/chat");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Backend-driven message if available
        setError(
          error.response?.data?.detail ??
            "Invalid email or password"
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${theme.background}`}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`w-full max-w-sm p-6 rounded-md border ${theme.surface} ${theme.border}`}
      >
        <h1 className={`text-xl mb-4 ${theme.textPrimary} text-center font-bold`}>Login</h1>

        {/* Form-level error */}
        {error && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/30">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <label htmlFor="email" className="text-sm text-slate-400 mb-1 block">
          Email
        </label>
        <input
          id="email"
          {...register("email")}
          placeholder="Email"
          type="email"
          className="w-full mb-3 p-2 rounded bg-transparent border border-slate-700 text-gray-200"
          required
        />
        <FormError message={errors.email?.message} />

        <label
          htmlFor="password"
          className="text-sm text-slate-400 mb-1 block"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register("password")}
          placeholder="Password"
          className="w-full mb-3 p-2 rounded bg-transparent border border-slate-700 text-gray-200"
          required
        />
        <FormError message={errors.password?.message} />

        <button
          disabled={isSubmitting}
          className={`w-full py-2 rounded ${theme.accent} text-white`}
        >
          Login
        </button>
        <p className="text-center mt-3 text-white">
          <Link href={"/register"}>New user? Register Now</Link>
        </p>
      </form>
    </div>
  );
}
