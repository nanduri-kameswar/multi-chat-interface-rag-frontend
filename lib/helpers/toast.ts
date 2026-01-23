import { toast } from "react-toastify";

export const showUploadFailedToast = (conversationId: string) => {
  toast.error("Upload failed. Please upload the document again.", {
    toastId: `upload-failed-${conversationId}`,
  });
};

export const showInfoToast = (conversationId: string, message: string) => {
  toast.info(message, {
    toastId: `upload-info-${conversationId}`,
  });
};

export const showSuccessToast = (conversationId: string, message: string) => {
  toast.success(message, {
    toastId: `upload-success-${conversationId}`,
  });
};
