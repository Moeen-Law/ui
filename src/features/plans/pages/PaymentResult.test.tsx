import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import i18n from "@/lib/i18n";
import { renderWithProviders } from "@/test/render";
import PaymentResult from "./PaymentResult";

describe("PaymentResult", () => {
    beforeEach(async () => {
        await i18n.changeLanguage("en");
    });

    it("renders a successful payment result with the payment id", () => {
        renderWithProviders(<PaymentResult />, {
            route: "/payment-result?status=success&paymentId=payment-1",
        });

        expect(screen.getByText("Payment completed")).toBeInTheDocument();
        expect(screen.getByText("payment-1")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /open chat/i })).toHaveAttribute("href", "/chat");
    });

    it("renders the payment-not-found failure reason", () => {
        renderWithProviders(<PaymentResult />, {
            route: "/payment-result?status=failed&reason=payment_not_found",
        });

        expect(screen.getByText("Payment failed")).toBeInTheDocument();
        expect(screen.getByText("The payment record could not be found. Please return to pricing and start a new payment.")).toBeInTheDocument();
    });
});
