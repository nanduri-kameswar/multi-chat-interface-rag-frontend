import NewChatForm from "@/lib/components/NewChatForm";
import { theme } from "../../lib/styles/theme";


export default function ChatPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <h2 className={`text-xl mb-2 ${theme.textPrimary}`}>
          Start a conversation
        </h2>
        <p className={`text-sm ${theme.textSecondary}`}>
          Select an existing chat or create a new one below to begin.
        </p>
        <NewChatForm />
      </div>
    </div>
  );
}
