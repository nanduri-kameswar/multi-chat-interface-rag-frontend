import { uploadDocument, getUploadStatus } from "../backend-api";
import { useUploadStore } from "../store/upload.store";
import { DocumentStatus } from "../types/schemas.zod";


export async function uploadWithPolling(
  conversationId: string,
  file: File
) {
  const store = useUploadStore.getState();

  const formData = new FormData();
  formData.append("file", file);

  const res = await uploadDocument(formData, {convo_id: conversationId, overwrite: true});
  const documentId = res.id;

  store.startUpload(conversationId, documentId, file.name);

  const interval = setInterval(async () => {
    try {
      const statusRes = await getUploadStatus(documentId);
      const status = statusRes.status;

      store.setStatus(conversationId, status);

      if (status === DocumentStatus.READY || status === DocumentStatus.FAILED) {
        clearInterval(interval);
      }
    } catch {
      store.setStatus(conversationId, DocumentStatus.FAILED);
      clearInterval(interval);
    }
  }, 2000);
}
