import { create } from "zustand";
import { MessageWithoutId } from "../types/message.zod";

type MessageState = {
  messages: MessageWithoutId[];
  setMessages: (m: MessageWithoutId[]) => void;
  appendMessage: (m: MessageWithoutId) => void;
  reset: () => void;
};

export const useMessageStore = create<MessageState>((set) => ({
  messages: [],

  setMessages: (messages) => set({ messages }),

  appendMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message].slice(-10),
    })),

  reset: () => set({ messages: [] }),
}));
