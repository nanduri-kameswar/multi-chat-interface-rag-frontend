// components/chat/ConversationList.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useConversationStore } from "../store/chat.store";
import {
  deleteConversation,
  getAllConversations,
  updateConversation,
} from "../backend-api";
import { ConfirmDialog } from "./ConfirmationDialog";
import { Pencil, Trash2 } from "lucide-react";

export function ConversationList() {
  const router = useRouter();
  const { conversationId } = useParams<{ conversationId?: string }>();

  const { conversations, setConversations, rename, remove } =
    useConversationStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    getAllConversations().then((res) => setConversations(res));
  }, [setConversations]);

  const commitRename = async (id: string) => {
    const name = draftName.trim();
    if (!name) return;

    rename(id, name); // optimistic
    setEditingId(null);

    try {
      await updateConversation(id, name);
    } catch {
      // optional: refetch on failure
      getAllConversations().then((res) => setConversations(res));
    }
  };

  const confirmDelete = async (id: string) => {
    remove(id); // optimistic
    setDeleteId(null);

    try {
      await deleteConversation(id);
      if (conversationId === id) {
        router.push("/chat");
      }
    } catch {
      getAllConversations().then((res) => setConversations(res));
    }
  };

  return (
    <>
      <ul className="space-y-1">
        {conversations.map((c) => {
          const active = c.id === conversationId;

          return (
            <li
              key={c.id}
              className={`group rounded-md ${
                active ? "bg-slate-800" : "hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center px-3 py-2 gap-2">
                {editingId === c.id ? (
                  <input
                    autoFocus
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    onBlur={() => commitRename(c.id)}
                    onKeyDown={(e) => e.key === "Enter" && commitRename(c.id)}
                    className="flex-1 bg-transparent border-b border-slate-600 text-gray-200 text-sm"
                  />
                ) : (
                  <button
                    onClick={() => router.push(`/chat/${c.id}`)}
                    className="flex-1 text-left text-sm text-slate-300 truncate"
                  >
                    {c.title}
                  </button>
                )}

                {/* Actions */}
                <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(c.id);
                      setDraftName(c.title);
                    }}
                    className="text-xs text-slate-400 hover:text-white"
                    title="Rename"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(c.id)}
                    className="text-xs text-slate-400 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Delete confirmation */}
      {deleteId && (
        <ConfirmDialog
          title="Delete conversation?"
          message="This action cannot be undone."
          onCancel={() => setDeleteId(null)}
          onConfirm={() => confirmDelete(deleteId)}
        />
      )}
    </>
  );
}
