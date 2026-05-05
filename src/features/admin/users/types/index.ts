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
