import request from "@/shared/api/request";
import type { PlansResponse } from "../types";
import api from "@/shared/api";
import { subscriptionsService } from "../helpers";

 
export const getPlans = () => request<PlansResponse>(api.get(`${subscriptionsService}/plans`))