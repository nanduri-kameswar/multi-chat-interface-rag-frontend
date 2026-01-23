"use client";

import { useRouter } from "next/navigation";

export function NewChatButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/chat")}
      className="
        w-full text-left px-3 py-2
        rounded-md text-sm
        text-slate-300
        hover:bg-slate-800
        transition
      "
    >
      + New Chat
    </button>
  );
}
