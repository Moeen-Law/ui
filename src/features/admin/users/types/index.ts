export interface AllUsersRes {
  content: User[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  active: boolean;
  subscriptionInfo: SubscriptionInfo[];
  createdAt: string | Date;
  updatedAt: string | Date | null;
  deleted: boolean;
  emailVerified?: boolean;
}

export interface SubscriptionInfo {
  autoRenew: boolean;
  createdAt: string | Date;
  endDate: string | Date | null;
  id: string;
  planId: string;
  planName: string;
  price: number;
  startDate: string | Date | null;
  status: string;
  updatedAt: string | Date | null;
  userId: string;
}

export interface UserStats {
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

export interface MessageRes {
  message: string;
}

export interface GetUsersParams {
  page?: number;
  size?: number;
  id?: string;
  name?: string;
  email?: string;
  active?: boolean;
  deleted?: boolean;
  emailVerified?: boolean;
}

export interface ToggleUserRolesParams {
  userId: string;
  action: "promote" | "demote";
  role: UserRole;
}

export type UserRole = "USER" | "ADMIN";

export type UsersSearchField = "name" | "email" | "id";

export type UsersStatusFilter = "all" | "active" | "banned";

export type UsersDeletedFilter = "all" | "deleted" | "notDeleted";

export type UsersEmailVerifiedFilter = "all" | "verified" | "unverified";

export interface UsersFilters {
  search: string;
  searchField: UsersSearchField;
  status: UsersStatusFilter;
  deleted: UsersDeletedFilter;
  emailVerified: UsersEmailVerifiedFilter;
}

export interface UserActionTarget {
  user: User;
  action: "toggleActivation" | "delete" | "promote" | "demote";
  role?: UserRole;
}
