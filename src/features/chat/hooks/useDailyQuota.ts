import { useQuery } from "@tanstack/react-query";
import { getDailyQuota } from "../services";
import type { DailyQuotaRes, Quota } from "../types";

export const dailyQuotaKeys = {
    all: ["daily-quota"] as const,
};

export const useDailyQuota = () => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: dailyQuotaKeys.all,
        queryFn: getDailyQuota,
        staleTime: 30 * 1000,
    });

    return {
        quota: data,
        quotas: data?.quotas ?? [],
        isLoading,
        isError,
        refetch,
    };
};

export const getFeatureQuota = (
    quota: DailyQuotaRes | Quota[] | undefined,
    feature: Quota["feature"]
) => {
    const quotas = Array.isArray(quota) ? quota : quota?.quotas;
    return quotas?.find((item) => item.feature === feature);
};

export const isQuotaLow = (quota?: Quota) =>
    Boolean(quota && quota.remaining > 0 && quota.remaining <= 2);

export const isQuotaExhausted = (quota?: Quota) =>
    Boolean(quota && quota.remaining <= 0);
