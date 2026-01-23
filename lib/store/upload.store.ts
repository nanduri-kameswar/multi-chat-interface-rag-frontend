import { create } from "zustand";
import { DocumentStatus } from "../types/schemas.zod";

type ConversationUpload = {
  documentId?: string;
  filename?: string;
  status: DocumentStatus;
};

type UploadStore = {
  uploads: Record<string, ConversationUpload>;

  startUpload: (
    conversationId: string,
    documentId: string,
    filename: string
  ) => void;

  setStatus: (conversationId: string, status: DocumentStatus) => void;

  reset: (conversationId: string) => void;

  hydrateFromBackend: (
    conversationId: string,
    doc: {
      id: string;
      filename: string;
      status: DocumentStatus;
    } | null
  ) => void;
};

export const useUploadStore = create<UploadStore>((set) => ({
  uploads: {},

  startUpload: (conversationId, documentId, filename) =>
    set((state) => ({
      uploads: {
        ...state.uploads,
        [conversationId]: {
          documentId,
          filename,
          status: DocumentStatus.PENDING,
        },
      },
    })),

  setStatus: (conversationId, status) =>
    set((state) => ({
      uploads: {
        ...state.uploads,
        [conversationId]: {
          ...state.uploads[conversationId],
          status,
        },
      },
    })),

  reset: (conversationId) =>
    set((state) => {
      const next = { ...state.uploads };
      delete next[conversationId];
      return { uploads: next };
    }),
  
  hydrateFromBackend: (conversationId, doc) =>
    set((s) => {
      if (!doc) return s;

      return {
        uploads: {
          ...s.uploads,
          [conversationId]: {
            documentId: doc.id,
            filename: doc.filename,
            status: doc.status,
          },
        },
      };
    }),
}));
