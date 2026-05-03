import type { TFunction } from "i18next";
import { describe, expect, it } from "vitest";
import { getLoginSchema, getResetPasswordSchema, getSignUpSchema } from ".";

const t = ((key: string) => key) as TFunction;

describe("auth schemas", () => {
    it("validates login email and password", () => {
        const schema = getLoginSchema(t);

        expect(schema.safeParse({ email: "bad-email", password: "123" }).success).toBe(false);
        expect(schema.safeParse({ email: "user@example.com", password: "Password1!" }).success).toBe(true);
    });

    it("requires strong signup passwords and matching confirmation", () => {
        const schema = getSignUpSchema(t);

        expect(schema.safeParse({
            name: "Test User",
            email: "user@example.com",
            password: "password",
            confirmPassword: "password",
        }).success).toBe(false);

        expect(schema.safeParse({
            name: "Test User",
            email: "user@example.com",
            password: "Password1!",
            confirmPassword: "Password2!",
        }).success).toBe(false);

        expect(schema.safeParse({
            name: "Test User",
            email: "user@example.com",
            password: "Password1!",
            confirmPassword: "Password1!",
        }).success).toBe(true);
    });

    it("validates reset password confirmation", () => {
        const schema = getResetPasswordSchema(t);

        expect(schema.safeParse({
            password: "Password1!",
            confirmPassword: "Password2!",
        }).success).toBe(false);

        expect(schema.safeParse({
            password: "Password1!",
            confirmPassword: "Password1!",
        }).success).toBe(true);
    });
});

