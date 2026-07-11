import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/render";
import { TaskHistoryList } from "./TaskHistory";

const labels = { empty: "No history", error: "History failed", retry: "Retry", loadMore: "Load more" };
const items = [{ id: "one", title: "First item" }, { id: "two", title: "Second item" }];

describe("TaskHistoryList", () => {
    it("renders items and selects the requested item", async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();
        const onItemSelected = vi.fn();
        renderWithProviders(<TaskHistoryList items={items} getItemId={(item) => item.id} selectedId="one" renderItem={(item) => item.title} onSelect={onSelect} onItemSelected={onItemSelected} hasNextPage={false} isFetchingNextPage={false} onLoadMore={vi.fn()} labels={labels} />);
        await user.click(screen.getByRole("button", { name: "Second item" }));
        expect(onSelect).toHaveBeenCalledWith(items[1]);
        expect(onItemSelected).toHaveBeenCalledOnce();
    });

    it("renders empty, error, and retry behavior", async () => {
        const user = userEvent.setup();
        const onRetry = vi.fn();
        const { rerender } = renderWithProviders(<TaskHistoryList items={[]} getItemId={(item: { id: string }) => item.id} renderItem={() => null} onSelect={vi.fn()} hasNextPage={false} isFetchingNextPage={false} onLoadMore={vi.fn()} labels={labels} />);
        expect(screen.getByText("No history")).toBeInTheDocument();
        rerender(<TaskHistoryList items={[]} getItemId={(item: { id: string }) => item.id} renderItem={() => null} onSelect={vi.fn()} isError hasNextPage={false} isFetchingNextPage={false} onLoadMore={vi.fn()} onRetry={onRetry} labels={labels} />);
        await user.click(screen.getByRole("button", { name: "Retry" }));
        expect(onRetry).toHaveBeenCalledOnce();
    });

    it("loads another page and disables the control while fetching", async () => {
        const user = userEvent.setup();
        const onLoadMore = vi.fn();
        const { rerender } = renderWithProviders(<TaskHistoryList items={items} getItemId={(item) => item.id} renderItem={(item) => item.title} onSelect={vi.fn()} hasNextPage isFetchingNextPage={false} onLoadMore={onLoadMore} labels={labels} />);
        await user.click(screen.getByRole("button", { name: "Load more" }));
        expect(onLoadMore).toHaveBeenCalledOnce();
        rerender(<TaskHistoryList items={items} getItemId={(item) => item.id} renderItem={(item) => item.title} onSelect={vi.fn()} hasNextPage isFetchingNextPage onLoadMore={onLoadMore} labels={labels} />);
        expect(screen.getByRole("button", { name: "Load more" })).toBeDisabled();
    });
});
