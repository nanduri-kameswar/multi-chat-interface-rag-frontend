import { create } from "zustand";
import { Conversation } from "../types/conversation.zod";

// Conversations
type ConversationState = {
  conversations: Conversation[];
  setConversations: (c: Conversation[]) => void;
  addConversation: (c: Conversation) => void;
  rename: (id: string, title: string) => void;
  remove: (id: string) => void;
};

export const useConversationStore = create<ConversationState>((set) => ({
  conversations: [],
  setConversations: (conversations) => set({ conversations }),
  
  addConversation: (conversation: Conversation) =>
    set((prev) => ({
      conversations: [conversation, ...prev.conversations],
    })),

  rename: (id, title) =>
    set((prev) => ({
      conversations: prev.conversations.map((convo) =>
        convo.id === id ? { ...convo, title } : convo
      ),
    })),

  remove: (id) =>
    set((prev) => ({
      conversations: prev.conversations.filter((convo) => convo.id !== id),
    })),
}));

// Upload Document Modal
type ModalState = {
  uploadOpen: boolean;
  openUpload: () => void;
  closeUpload: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  uploadOpen: false,
  openUpload: () => set({ uploadOpen: true }),
  closeUpload: () => set({ uploadOpen: false }),
}));

// New Chat
type NewChatState = {
  title: string;
  loading: boolean;
  error?: string;

  setTitle: (title: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
  reset: () => void;
};

export const useNewChatStore = create<NewChatState>((set) => ({
  title: "",
  loading: false,

  setTitle: (title) => set({ title }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set({ title: "", loading: false, error: undefined }),
}));
