import { z } from "zod";
import {
  nameSchema,
  utcTimestampSchema,
} from "./schemas.zod";

export const ConversationResponseSchema = z.object({
  id: z.uuid(),
  title: nameSchema,
  created_at: utcTimestampSchema,
  updated_at: utcTimestampSchema,
});

export const CreateOrUpdateConversationSchema = z.object({
  title: nameSchema,
});


export type Conversation = z.infer<typeof ConversationResponseSchema>
export type ConversationRequest = z.infer<typeof CreateOrUpdateConversationSchema>
