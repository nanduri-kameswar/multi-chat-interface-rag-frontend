import { z } from "zod";

export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be at most 50 characters");

export const filenameSchema = z.union([
  z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .endsWith(".pdf"),
  z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .endsWith(".txt"),
]);

export const utcTimestampSchema = z.coerce
  .date()
  .transform((d) => new Date(d.toISOString())); // ensures UTC

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password must be at most 64 characters")
  .regex(/[A-Z]/, "Must include at least one uppercase letter")
  .regex(/[a-z]/, "Must include at least one lowercase letter")
  .regex(/[0-9]/, "Must include at least one number")
  .regex(/[^A-Za-z0-9]/, "Must include at least one special character");

export enum MessageRole {
  SYSTEM = "system",
  ASSISTANT = "assistant",
  USER = "user",
}
export const MessageRoleSchema = z.enum(MessageRole);

export enum DocumentStatus {
  NONE = "none",
  PENDING = "pending",
  PROCESSING = "processing",
  READY = "ready",
  FAILED = "failed",
}
export const DocumentStatusSchema = z.enum(DocumentStatus);

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}
export const UserRoleSchema = z.enum(UserRole);
