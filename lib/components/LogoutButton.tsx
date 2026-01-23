"use client";

import { useRouter } from "next/navigation";
import { logout } from "../backend-api";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      // middleware will block /chat after cookies are cleared
      router.replace("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="
        text-sm text-slate-400
        hover:text-red-400
        transition
      "
    >
      Logout
    </button>
  );
}
