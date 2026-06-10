import type z from "zod";
import type { loginSchema, signUpSchema, forgotPasswordSchema, resetPasswordSchema } from "../schema";



export type LoginValues = z.infer<typeof loginSchema>;

export type SignUpValues = z.infer<typeof signUpSchema>;

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;


export interface AuthStore {
    accessToken: string | null,
    setAccessToken: (newToken: string) => void,
    removeAccessToken: () => void
}



export interface SignUpResponse {
    message: string;
    email: string;
}


export interface LoginResponse {
    accessToken: string;
    expiresIn: number;
}


export interface GoogleResponse {
    url: string;
}


export interface VerifyEmailResponse {
    message: string;
}


export interface ForgotPasswordResponse {
    message: string;
}


// ProfileResponse
export interface ProfileResponse {
    active: boolean;
    createdAt: Date;
    deleted: boolean;
    email: string;
    id: string;
    name: string;
    roles: string[];
    subscriptionInfo: SubscriptionInfo[];
    updatedAt: Date;
}

export interface SubscriptionInfo {
    autoRenew: boolean;
    createdAt: Date;
    endDate: Date;
    id: string;
    planId: string;
    planName: string;
    price: number;
    startDate: Date;
    status: string;
    updatedAt: Date;
    userId: string;
}




export interface userSessionRes {
    sessionId: string;
    ipAddress: string;
    browser: string;
    os: string;
    location: string;
    loginAt: Date;
    current: boolean;
}


