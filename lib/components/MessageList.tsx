"use client";

import { useEffect } from "react";
import { useMessageStore } from "../store/message.store";
import { getRecentKMessages } from "../backend-api";
import { MessageWithoutId } from "../types/message.zod";
import { MessageRole } from "../types/schemas.zod";
type Props = {
  conversationId: string;
};

export function MessageList({ conversationId }: Props) {
  const { messages, setMessages, reset } = useMessageStore();

  useEffect(() => {
    let mounted = true;
    reset();

    getRecentKMessages(conversationId).then((res) => {
      if (mounted) {
        setMessages(res as MessageWithoutId[]);
      }
    });

    return () => {
      mounted = false;
    };
  }, [conversationId, setMessages, reset]);

  return (
    <div className="space-y-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`text-sm ${
            msg.role === MessageRole.USER
              ? "text-gray-200"
              : msg.role === MessageRole.ASSISTANT
              ? "text-slate-300"
              : "text-slate-500 italic"
          }`}
        >
          <pre className="whitespace-pre-wrap font-sans">
            {msg.content}
          </pre>
        </div>
      ))}
    </div>
  );
}
