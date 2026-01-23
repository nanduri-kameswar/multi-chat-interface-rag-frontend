import { ReactNode } from "react";
import { theme } from "../../lib/styles/theme";
import { ToastProvider } from "@/lib/components/ToastProvider";
import { LogoutButton } from "@/lib/components/LogoutButton";
import { NewChatButton } from "@/lib/components/NewChatButton";
import { ConversationList } from "@/lib/components/ConvesationList";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`h-screen flex ${theme.background}`}>
      {/* Sidebar */}
      <aside
        className={`w-72 border-r ${theme.border} ${theme.surface} flex flex-col`}
      >
        <div className="p-4 border-b border-slate-800">
          <h2 className={`text-lg ${theme.textPrimary}`}>Conversations</h2>
          <LogoutButton />
        </div>

        {/* New Chat */}
        <div className="p-2 border-b border-slate-800">
          <NewChatButton />
        </div>

        {/* Conversation list placeholder */}
        <div className="flex-1 overflow-y-auto p-2">
          <ConversationList />
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">{children}</main>
      <ToastProvider />
    </div>
  );
}
