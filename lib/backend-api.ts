import api from "./axios-setup";
import {
  Login,
  LoginSchema,
  Register,
  RegisterSchema,
  UpdatePassword,
  UpdatePasswordSchema,
  UserSchema,
} from "./types/auth.zod";
import {
  ConversationResponseSchema,
  CreateOrUpdateConversationSchema,
} from "./types/conversation.zod";
import { UploadDocumentResponseSchema } from "./types/document.zod";
import { MessageResponseSchema } from "./types/message.zod";
import { AskQuestion, AskQuestionSchema, LLMAnswerSchema } from "./types/query.zod";

/* ---------- AUTH ---------- */
export const loginUser = async (data: Login) => {
  const payload = LoginSchema.parse(data);
  const body = new URLSearchParams({
    username: payload.email,   // OAuth2 expects "username"
    password: payload.password,
  });

  return await api.post("/user/login", body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const registerUser = async (data: Register) => {
  const payload = RegisterSchema.parse(data);
  return await api.post("/user/register", payload);
};

export const updatePassword = async (data: UpdatePassword) => {
  const payload = UpdatePasswordSchema.parse(data);
  return await api.put("/user/update-password", payload);
};

export const logout = async () => await api.post("/user/logout");

export const getUser = async () => {
  const res = await api.get("/user/me");
  return UserSchema.parse(res.data);
};

/* ---------- CONVERSATIONS ---------- */
export const createConversation = async (title: string) => {
  const payload = CreateOrUpdateConversationSchema.parse({ title });
  const res = await api.post("/conversations/create", payload);
  return ConversationResponseSchema.parse(res.data);
};

export const getConversation = async (id: string) => {
  const res = await api.get(`/conversations/${id}`);
  return ConversationResponseSchema.parse(res.data);
};

export const getAllConversations = async () => {
  const res = await api.get("/conversations");
  return ConversationResponseSchema.array().parse(res.data);
};

export const updateConversation = async (id: string, title: string) => {
  const payload = CreateOrUpdateConversationSchema.parse({ title });
  return await api.patch(`/conversations/update/${id}`, payload);
};

export const deleteConversation = async (id: string) =>
  await api.delete(`/conversations/delete/${id}`);

/* ---------- MESSAGES ---------- */
export const getRecentKMessages = async (conversationId: string, limit = 10) => {
  const res = await api.get(
    `/messages?conversation_id=${conversationId}&limit=${limit}`
  );
  return MessageResponseSchema.array().parse(res.data);
};

export const askQuestion = async (data: AskQuestion) => {
  const payload = AskQuestionSchema.parse(data);
  const res = await api.post("/chat/query", payload);
  return LLMAnswerSchema.parse(res.data);
};

/* ---------- DOCUMENTS ---------- */
export const uploadDocument = async (formData: FormData, params: { convo_id?: string; overwrite?: boolean }) => {
  const res = await api.post("/documents/upload", formData, {params});
  return UploadDocumentResponseSchema.parse(res.data);
};

export const getUploadStatus = async (id: string) => {
  const res = await api.get(`/documents/${id}`);
  return UploadDocumentResponseSchema.parse(res.data);
};

export const deleteDocument = async (id: string) =>
  await api.delete(`/documents/delete/${id}`);

export const getAllConversationDocuments = async (conversation_id: string) => {
  const res = await api.get(`/documents`, {
    params: {conversation_id}
  });
  return UploadDocumentResponseSchema.array().parse(res.data);
}