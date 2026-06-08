export type UserStatus = "active" | "banned"

export type UserStatusFilter = "all" | UserStatus

export type UserPlan = "professional" | "free" | "enterprise"

export interface LocalizedText {
  ar: string
  en: string
}

export interface AdminUser {
  id: string
  name: LocalizedText
  email: string
  phone: string
  initial: LocalizedText
  plan: UserPlan
  usage: {
    used: number
    limit: number | null
  }
  joinedAt: string
  status: UserStatus
}

export type UserActionType = "ban" | "unban" | "delete"



// get all users 
export interface GetAllUsersResponse {
  content: Content[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
  
export interface Content  {
  id: string;
  name: string;
  email: string;
  roles: string[];
  active: boolean;
  subscriptionInfo: any[];
  createdAt: Date;
  updatedAt: Date | null;
  deleted: boolean;
}



// get user by id 
export interface GetUserByIdRes  {
  id: string;
  name: string;
  email: string;
  roles: string[];
  active: boolean;
  subscriptionInfo: any[];
  createdAt: Date;
  updatedAt: null;
  deleted: boolean;
}


// users stats 
export interface UserStatsRes {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  deletedUsers: number;
  usersRegisteredLast24Hours: number;
  usersRegisteredLast48Hours: number;
  usersRegisteredLastWeek: number;
  usersRegisteredLastMonth: number;
  usersRegisteredLast3Months: number;
  usersRegisteredLastYear: number;
}


// toggle ban user 
export interface ToggleBanUserAndDeleteUserAndAssignRoleRes {
  message: string;
}

 
// get users by their name
export interface GetUsersByNameRes {
  id: string;
  name: string;
  email: string;
  roles: string[];
  active: boolean;
  subscriptionInfo: SubscriptionInfo[];
  createdAt: Date;
  updatedAt: Date | null;
  deleted: boolean;
}

export interface SubscriptionInfo {
  autoRenew: boolean;
  createdAt: Date;
  endDate: Date;
  id: string;
  planId: string;
  planName: string;
  price: number;
  startDate: Date;
  status: string;
  updatedAt: Date;
  userId: string;
}


