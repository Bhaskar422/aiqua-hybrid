import { z } from "zod";

export const SignInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(5, "Password must contain atleast 10 characters"),
});

export type TSignInSchema = z.infer<typeof SignInSchema>;
