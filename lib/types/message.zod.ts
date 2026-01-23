import z from "zod";
import { MessageRoleSchema, utcTimestampSchema } from "./schemas.zod";

export const MessageRequestSchema = z.object({
  conversation_id: z.uuid(),
  role: MessageRoleSchema,
  content: z.string(),
});

export const MessageResponseSchema = z.object({
  id: z.uuid(),
  role: MessageRoleSchema,
  content: z.string(),
  created_at: utcTimestampSchema,
});

export type MessageRequest = z.infer<typeof MessageRequestSchema>
export type Message = z.infer<typeof MessageResponseSchema>
export type MessageWithoutId = Omit<Message, "id" | "created_at">;
