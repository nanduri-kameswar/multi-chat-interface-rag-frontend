export function ChatInfoBanner() {
  return (
    <div className="mb-4 p-3 rounded border border-slate-800 bg-slate-900">
      <p className="text-xs text-slate-400">
        Only the last <strong>10 messages</strong> are shown here to
        keep the chat fast and focused.
      </p>
    </div>
  );
}
