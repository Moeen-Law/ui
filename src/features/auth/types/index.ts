import type z from "zod";
import type { loginSchema, signUpSchema } from "../schema";



export type LoginValues = z.infer<typeof loginSchema>;

export type SignUpValues = z.infer<typeof signUpSchema>;


export interface AuthStore {
    accessToken: string | null,
    setAccessToken: (newToken: string) => void,
    removeAccessToken: () => void
}



export interface SignUpResponse {
    message: string;
    email:   string;
}
