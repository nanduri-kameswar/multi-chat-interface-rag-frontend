"use client";

import { askQuestion, getAllConversationDocuments } from "@/lib/backend-api";
import { AttachmentBar } from "@/lib/components/AttachmentBar";
import { ChatInfoBanner } from "@/lib/components/ChatInfoBanner";
import { MessageList } from "@/lib/components/MessageList";
import UploadModal from "@/lib/components/UploadModal";
import {
  showInfoToast,
  showSuccessToast,
  showUploadFailedToast,
} from "@/lib/helpers/toast";
import { useModalStore } from "@/lib/store/chat.store";
import { useMessageStore } from "@/lib/store/message.store";
import { useUploadStore } from "@/lib/store/upload.store";
import { theme } from "@/lib/styles/theme";
import { DocumentStatus, MessageRole } from "@/lib/types/schemas.zod";
import { Plus, Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChatConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { uploadOpen, openUpload } = useModalStore();
  const { uploads, hydrateFromBackend } = useUploadStore();
  const appendMessage = useMessageStore((s) => s.appendMessage);
  const upload = uploads[conversationId];
  const isChatDisabled =
    upload?.status === DocumentStatus.PENDING ||
    upload?.status === DocumentStatus.PROCESSING;
  const showUploadButton = !upload || upload.status === DocumentStatus.FAILED;
  const [message, setMessage] = useState("");
  const canSend = !isChatDisabled && message.trim().length > 0;

  const handleSend = async () => {
    if (!canSend) return;
    const question = message.trim();
    setMessage("");
    appendMessage({
      role: MessageRole.USER,
      content: question,
    });

    try {
      const res = await askQuestion({
        query: question,
        conversation_id: conversationId,
      });

      appendMessage({
        role: MessageRole.ASSISTANT,
        content: res.answer,
      });
    } catch {
      appendMessage({
        role: MessageRole.ASSISTANT,
        content: "Sorry, something went wrong while answering your question.",
      });
    }
  };

  useEffect(() => {
    if (upload?.status === DocumentStatus.FAILED) {
      showUploadFailedToast(conversationId);
    } else if (upload?.status === DocumentStatus.READY) {
      showSuccessToast(
        conversationId,
        "Document is ready. You can continue chatting."
      );
    } else if (upload?.status === DocumentStatus.PROCESSING) {
      showInfoToast(conversationId, "The document is uploading...");
    }
  }, [conversationId, upload?.status]);

  useEffect(() => {
    let mounted = true;

    getAllConversationDocuments(conversationId).then((res) => {
      if (!mounted) return;

      const doc = res[0];
      if (doc && doc.status === DocumentStatus.READY) {
        hydrateFromBackend(conversationId, {
          id: doc.id,
          filename: doc.file_name,
          status: doc.status,
        });
      }
    });

    return () => {
      mounted = false;
    };
  }, [conversationId, hydrateFromBackend]);

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <ChatInfoBanner />
        <MessageList conversationId={conversationId} />
      </div>

      <AttachmentBar conversationId={conversationId} />

      {/* Input */}
      <div className={`border-t ${theme.border} p-3 flex items-center gap-2`}>
        {showUploadButton && (
          <button
            onClick={openUpload}
            className="text-slate-400 hover:text-white"
            title="Upload document"
          >
            <Plus size={18} />
          </button>
        )}
        {uploadOpen && <UploadModal />}

        <input
          value={message}
          disabled={isChatDisabled}
          placeholder={
            isChatDisabled ? "Document is being processed…" : "Ask a question…"
          }
          className="
            flex-1 p-2 rounded bg-transparent border
            border-slate-700 text-gray-200
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={handleSend}
          disabled={canSend}
          title="Send"
          className="
            text-slate-400 hover:text-white
            disabled:opacity-40
            disabled:cursor-not-allowed
          "
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
