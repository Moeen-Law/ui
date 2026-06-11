import request from "@/shared/api/request";
import type { FailedPaymentsStats, PaymentsFullStatsRes, PaymentStatsByTime, PaymentStatsSummaryRes, PaymentTopUser, StuckPayment } from "../types";
import api from "@/shared/api";
import { adminService } from "../../helpers";


export const getFullPaymentsStats = () => request<PaymentsFullStatsRes>(
    api.get(`${adminService}/admin/payments/stats/full`)
) 


export const getPaymentStatsSummary = () => request<PaymentStatsSummaryRes>(
    api.get(`${adminService}/admin/payments/stats/summary`)
)


export const getPaymentsStatsByTime = (granularity: "DAILY" | "WEEKLY" | "MONTHLY") => request<PaymentStatsByTime[]>(
    api.get(`${adminService}/admin/payments/stats/time-series`, {
        params: {
            granularity
        }
    })
)


export const getFailedPaymentsStats = () => request<FailedPaymentsStats[]>(
    api.get(`${adminService}/admin/payments/stats/failures`) 
)


export const getTopUsers = () => request<PaymentTopUser[]>(
    api.get(`${adminService}/admin/payments/stats/top-users`)
)


export const getStuckPayments = () => request<StuckPayment[]>(
    api.get(`${adminService}/admin/payments/stats/stuck`)
)