import { z } from "zod";
import { DocumentStatusSchema, filenameSchema } from "./schemas.zod";

export const UploadDocumentRequestSchema = z.object({
  file: z
    .instanceof(File)
    .refine(f => ["application/pdf", "text/plain"].includes(f.type), {
      message: "Only PDF or text files allowed",
    }),
});

export const UploadDocumentResponseSchema = z.object({
    id: z.uuid(),
    file_name: filenameSchema,
    status: DocumentStatusSchema
});

export type UploadDocumentRequest = z.infer<typeof UploadDocumentRequestSchema>;
export type UploadeDocumentResponse = z.infer<typeof UploadDocumentResponseSchema>;