"use client";

import { DragEvent, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModalStore } from "../store/chat.store";
import { theme } from "../styles/theme";
import {
  UploadDocumentRequest,
  UploadDocumentRequestSchema,
} from "../types/document.zod";
import { uploadWithPolling } from "../helpers/upload";
import { useUploadStore } from "../store/upload.store";
import { DocumentStatus } from "../types/schemas.zod";
import { useParams } from "next/navigation";
import { Modal } from "./BaseModal";

export default function UploadModal() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { closeUpload } = useModalStore();
  const upload = useUploadStore((s) => s.uploads[conversationId]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UploadDocumentRequest>({
    resolver: zodResolver(UploadDocumentRequestSchema),
  });

  const file = watch("file");

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) setValue("file", dropped, { shouldValidate: true });
  };

  const onSubmit = async (data: UploadDocumentRequest) => {
    await uploadWithPolling(conversationId, data.file);
    closeUpload();
  };

  return (
    <Modal onClose={closeUpload}>
      <div
        className={`w-full max-w-md p-6 rounded-md border ${theme.surface} ${theme.border}`}
      >
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div
            className={`w-full max-w-md p-6 rounded-md border ${theme.surface} ${theme.border}`}
          >
            <h3 className={`text-lg mb-4 ${theme.textPrimary}`}>
              Upload Document
            </h3>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="
              border border-dashed border-slate-600
              rounded-md p-6 text-center
              text-slate-400 cursor-pointer
            "
                onClick={() => fileInputRef.current?.click()}
              >
                {file ? (
                  <p className="text-gray-200">
                    <strong>{file.name}</strong>
                    <br />
                    {`(click again to change the file)`}
                  </p>
                ) : (
                  <p>
                    Drag & drop or click to select a file
                    <br />
                    (only .pdf or .txt are allowed)
                  </p>
                )}
              </div>

              <input
                ref={fileInputRef}
                id="file-input"
                type="file"
                accept=".pdf,.txt"
                hidden
                onChange={(e) =>
                  e.target.files &&
                  setValue("file", e.target.files[0], {
                    shouldValidate: true,
                  })
                }
              />

              {errors.file && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.file.message}
                </p>
              )}

              {/* progress bar */}
              {upload?.status !== DocumentStatus.NONE && upload?.filename && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-slate-400 mb-1">
                    <span>{upload.filename}</span>
                    <span>{upload.status}</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded">
                    <div
                      className={`h-2 rounded transition-all ${
                        upload.status === DocumentStatus.READY
                          ? "bg-green-500 w-full"
                          : upload.status === DocumentStatus.FAILED
                          ? "bg-red-500 w-full"
                          : "bg-blue-500 w-1/2"
                      }`}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={closeUpload}
                  className="px-4 py-2 border border-slate-700 rounded text-slate-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !file?.name}
                  className={`px-4 py-2 rounded text-white transition
                    ${
                      isSubmitting || !file?.name
                        ? "bg-gray-400 cursor-not-allowed"
                        : theme.accent
                    }
                  `}
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}
