import { z } from "zod";
import { passwordSchema, UserRoleSchema, utcTimestampSchema } from "./schemas.zod";


export const LoginSchema = z.object({
    email: z.email(),
    password: passwordSchema
});

export const RegisterSchema = LoginSchema.extend({
    name: z.string().min(2).max(50)
});

export const UpdatePasswordSchema = z.object({
    current_password: passwordSchema,
    new_password: passwordSchema
});

export const UserSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.email(),
    role: UserRoleSchema,
    create_at: utcTimestampSchema
});

export type Login = z.infer<typeof LoginSchema>;
export type Register = z.infer<typeof RegisterSchema>;
export type UpdatePassword = z.infer<typeof UpdatePasswordSchema>
export type User = z.infer<typeof UserSchema>