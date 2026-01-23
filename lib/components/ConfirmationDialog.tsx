"use client";

import { theme } from "../styles/theme";
import { Modal } from "./BaseModal";

type Props = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ title, message, onConfirm, onCancel }: Props) {
  return (
    <Modal onClose={onCancel}>
      <div
        className={`w-full max-w-md p-6 rounded-md border ${theme.surface} ${theme.border}`}
      >
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="w-full max-w-sm p-5 rounded-md bg-slate-950 border border-slate-800">
            <h3 className="text-lg text-gray-200 mb-2">{title}</h3>
            <p className="text-sm text-slate-400 mb-4">{message}</p>

            <div className="flex justify-end gap-2">
              <button
                onClick={onCancel}
                className="px-3 py-1.5 rounded border border-slate-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-3 py-1.5 rounded bg-red-500 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
