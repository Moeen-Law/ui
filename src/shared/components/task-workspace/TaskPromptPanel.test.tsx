import { Sparkles } from "lucide-react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/render";
import { TaskPromptPanel } from "./TaskPromptPanel";

describe("TaskPromptPanel", () => {
    it("enforces minimum length and submits valid input", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        const onChange = vi.fn();
        const props = { id: "prompt", icon: Sparkles, title: "Search", description: "Describe it", label: "Prompt", placeholder: "Type", hint: "Hint", disclaimer: "Disclaimer", submitLabel: "Submit", pendingLabel: "Working", isPending: false, onChange, onSubmit };
        const { rerender } = renderWithProviders(<TaskPromptPanel {...props} value="a" />);
        expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
        rerender(<TaskPromptPanel {...props} value="valid" />);
        await user.click(screen.getByRole("button", { name: "Submit" }));
        expect(onSubmit).toHaveBeenCalledOnce();
    });
});
