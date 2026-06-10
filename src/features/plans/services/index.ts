import request from "@/shared/api/request";
import type { CreateSubscriptionResponse, PaymentActionResponse, PlansResponse } from "../types";
import api from "@/shared/api";
import { paymentService, subscriptionsService } from "../helpers";

 
export const getPlans = () => request<PlansResponse>(api.get(`${subscriptionsService}/plans`))

export const createSubscription = (data: {planId: string, autoRenew: boolean}) => request<CreateSubscriptionResponse>(api.post(`${subscriptionsService}/subscriptions`, data));

export const paymentAction = (subscriptionId: string) => request<PaymentActionResponse>(api.post(`${paymentService}/payments/${subscriptionId}`)) 