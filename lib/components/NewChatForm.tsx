"use client";

import { useRouter } from "next/navigation";
import { createConversation } from "../backend-api";
import { useConversationStore, useNewChatStore } from "../store/chat.store";
import { theme } from "../styles/theme";
import { CreateOrUpdateConversationSchema } from "../types/conversation.zod";

export default function ChatPage() {
  const router = useRouter();

  const { title, loading, error, setTitle, setLoading, setError, reset } =
    useNewChatStore();
  const addConversation = useConversationStore((s) => s.addConversation);

  const handleCreate = async () => {
    const parsed = CreateOrUpdateConversationSchema.safeParse({ title });

    if (!parsed.success) {
      setError(parsed.error.message);
      return;
    }

    try {
      setLoading(true);
      setError(undefined);

      const res = await createConversation(parsed.data.title);
      addConversation(res);
      const conversationId: string = res.id;
      reset();
      router.push(`/chat/${conversationId}`);
    } catch {
      setError("Failed to create conversation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <label htmlFor="title">
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Project requirements"
          className="
        w-full p-2 rounded
        bg-transparent border border-slate-700
        text-gray-200 mt-4
        "
        />
      </label>

      {error && <p className="text-sm text-red-400 mt-2">{error}</p>}

      <div className="flex justify-end mt-4">
        <button
          onClick={handleCreate}
          disabled={!title.trim() || loading}
          className={`
              px-4 py-2 rounded
              ${theme.accent}
              text-white
              disabled:opacity-50
            `}
        >
          {loading ? "Creating…" : "Create"}
        </button>
      </div>
    </>
  );
}
