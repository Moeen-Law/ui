import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/render";
import ChatInput from "./ChatInput";

const defaultProps = {
    inputValue: "",
    setInputValue: vi.fn(),
    handleSendMessage: vi.fn(),
    streamStatus: "idle" as const,
    onStopStreaming: vi.fn(),
    selectedFiles: [],
    onSelectFiles: vi.fn(),
    onRemoveFile: vi.fn(),
};

describe("ChatInput", () => {
    it("selects files through the attachment input", async () => {
        const user = userEvent.setup();
        const onSelectFiles = vi.fn();
        const { container } = renderWithProviders(
            <ChatInput {...defaultProps} onSelectFiles={onSelectFiles} />
        );
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;
        const file = new File(["content"], "contract.pdf", { type: "application/pdf" });

        await user.upload(input, file);

        expect(onSelectFiles).toHaveBeenCalledWith([file]);
    });

    it("renders removable selected file chips", async () => {
        const user = userEvent.setup();
        const onRemoveFile = vi.fn();
        const file = new File(["content"], "contract.pdf", { type: "application/pdf" });

        renderWithProviders(
            <ChatInput
                {...defaultProps}
                selectedFiles={[{ id: "file-1", file, status: "selected" }]}
                onRemoveFile={onRemoveFile}
            />
        );

        expect(screen.getByText("contract.pdf")).toBeInTheDocument();

        await user.click(screen.getByTitle("Remove file"));

        expect(onRemoveFile).toHaveBeenCalledWith("file-1");
    });
});

