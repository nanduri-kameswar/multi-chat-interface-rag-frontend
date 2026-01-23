"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { theme } from "@/lib/styles/theme";
import { Register, RegisterSchema } from "@/lib/types/auth.zod";
import { registerUser } from "@/lib/backend-api";
import { FormError } from "@/lib/components/FormError";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Register>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: Register) => {
    await registerUser(data);
    router.push("/chat");
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${theme.background}`}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`w-full max-w-sm p-6 rounded-md border ${theme.surface} ${theme.border}`}
      >
        <h1 className={`text-xl mb-4 ${theme.textPrimary} text-center font-bold`}>Register</h1>

        <label htmlFor="name" className="text-sm text-slate-400 mb-1 block">
          Name
        </label>
        <input
          id="name"
          {...register("name")}
          placeholder="Name"
          type="text"
          className="w-full mb-3 p-2 rounded bg-transparent border border-slate-700 text-gray-200"
          required
        />
        <FormError message={errors.name?.message} />

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

        <label htmlFor="password" className="text-sm text-slate-400 mb-1 block">
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
          Register
        </button>
        <p className="text-center mt-3 text-white">
          <Link href={"/login"}>Already a registered user? Login here</Link>
        </p>
      </form>
    </div>
  );
}
