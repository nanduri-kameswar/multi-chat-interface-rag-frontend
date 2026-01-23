import { z } from "zod";

const ReferenceSchema = z.record(
  z.number(),
  z.record(
    z.string(),
    z.union([z.string(), z.number()])
  )
);

export const AskQuestionSchema = z.object({
  query: z.string().min(1),
  conversation_id: z.uuid(),
});

export const LLMAnswerSchema = z.object({
  query: z.string().min(1),
  answer: z.string(),
  reference: ReferenceSchema,

});

export type AskQuestion = z.infer<typeof AskQuestionSchema>
export type LLMAnswer = z.infer<typeof LLMAnswerSchema>