import { keepPreviousData, useQuery } from "@tanstack/react-query"
import {
  getFailedPaymentsStats,
  getFullPaymentsStats,
  getPaymentStatsSummary,
  getPaymentsStatsByTime,
  getStuckPayments,
  getTopUsers,
} from "../services"
import type { PaymentStatsGranularity } from "../types"

const adminPaymentsKeys = {
  full: ["admin", "payments", "full"] as const,
  summary: ["admin", "payments", "summary"] as const,
  timeSeries: (granularity: PaymentStatsGranularity) =>
    ["admin", "payments", "time-series", granularity] as const,
  failures: ["admin", "payments", "failures"] as const,
  topUsers: ["admin", "payments", "top-users"] as const,
  stuck: ["admin", "payments", "stuck"] as const,
}

export const useAdminPaymentsFullStats = () =>
  useQuery({
    queryKey: adminPaymentsKeys.full,
    queryFn: getFullPaymentsStats,
    staleTime: 30_000,
  })

export const useAdminPaymentsSummary = () =>
  useQuery({
    queryKey: adminPaymentsKeys.summary,
    queryFn: getPaymentStatsSummary,
  })

export const useAdminPaymentsTimeSeries = (
  granularity: PaymentStatsGranularity
) =>
  useQuery({
    queryKey: adminPaymentsKeys.timeSeries(granularity),
    queryFn: () => getPaymentsStatsByTime(granularity),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })

export const useAdminPaymentsFailures = () =>
  useQuery({
    queryKey: adminPaymentsKeys.failures,
    queryFn: getFailedPaymentsStats,
  })

export const useAdminPaymentsTopUsers = () =>
  useQuery({
    queryKey: adminPaymentsKeys.topUsers,
    queryFn: getTopUsers,
  })

export const useAdminPaymentsStuck = () =>
  useQuery({
    queryKey: adminPaymentsKeys.stuck,
    queryFn: getStuckPayments,
  })

export { adminPaymentsKeys }
