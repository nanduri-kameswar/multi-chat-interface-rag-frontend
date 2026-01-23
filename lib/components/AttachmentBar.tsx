"use client";

import { deleteDocument } from "../backend-api";
import { useUploadStore } from "../store/upload.store";
import { theme } from "../styles/theme";
import { DocumentStatus } from "../types/schemas.zod";
import { Paperclip, X } from "lucide-react";

type Props = {
  conversationId: string;
};

export function AttachmentBar({ conversationId }: Props) {
  const upload = useUploadStore(
    (s) => s.uploads[conversationId]
  );
  const reset = useUploadStore((s) => s.reset);

  if (!upload || upload.status !== DocumentStatus.READY) {
    return null;
  }

  const handleRemove = async () => {
    try {
      await deleteDocument(upload.documentId!);
    } finally {
      // Remove attachment from UI, NOT the conversation
      reset(conversationId);
    }
  };

  return (
    <div
      className={`
        px-3 py-2
        border-t ${theme.border}
        bg-slate-900
        flex items-center gap-2
      `}
    >
      <div
        className="
          flex items-center gap-2
          px-3 py-1.5
          rounded-full
          bg-slate-800
          text-sm text-slate-200
        "
      >
        <Paperclip size={14} className="text-slate-400" />
        <span className="truncate max-w-[200px]">
          {upload.filename}
        </span>
        <button
          onClick={handleRemove}
          className="ml-1 text-slate-400 hover:text-red-400"
          title="Remove document"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
