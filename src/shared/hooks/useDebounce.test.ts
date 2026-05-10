import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
    it("updates the value after the configured delay", () => {
        vi.useFakeTimers();

        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 300),
            { initialProps: { value: "first" } }
        );

        expect(result.current).toBe("first");

        rerender({ value: "second" });
        expect(result.current).toBe("first");

        act(() => {
            vi.advanceTimersByTime(299);
        });
        expect(result.current).toBe("first");

        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(result.current).toBe("second");

        vi.useRealTimers();
    });
});
