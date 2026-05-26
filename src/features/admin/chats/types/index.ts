

// chat overview 
export interface StatsOverviewRes {
    totalChats: number;
    totalMessages: number;
    totalDocuments: number;
    uniqueUsers: number;
    periods: Periods;
    messagesBySender: MessagesBySender;
}

interface MessagesBySender {
    ai: number;
    system: number;
    user: number;
}

interface Periods {
    chats: Chats;
    messages: Chats;
    documents: Chats;
}

interface Chats {
    today: number;
    last7d: number;
    last30d: number;
}



// chat activity 
export interface ActivityRes {
    interval: string;
    from: Date;
    to: Date;
    chats: Chat[];
    messages: Message[];
    documents: Chat[];
}

interface Chat {
    period: Date;
    count: number;
}

interface Message {
    period: Date;
    sender: Sender;
    count: number;
}


export type Sender = "ai" | "system" | "user";

export type ActivityInterval = "day" | "week" | "month";

export interface ActivityStatsParams {
    interval: ActivityInterval;
    from?: string;
    to?: string;
}





// users stats
export interface UsersStatsRes {
    uniqueUsers: number;
    topUsers: TopUser[];
    averageChatsPerUser: number;
    averageMessagesPerChat: number;
    newUsersOverTime: NewUsersOverTime[];
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
}

interface NewUsersOverTime {
    userId: string;
    firstChatDate: Date;
}

interface TopUser {
    userId: string;
    chatCount: number;
    messageCount: number;
}



// user stats
export interface UserStatsRes {
    userId: string;
    chatCount: number;
    messageCount: number;
    documentCount: number;
    timeline: unknown[];
    avgMsgsPerChat: number;
}



// documents stats
export interface DocumentsStatsRes {
    totalDocuments: number;
    bySource: BySource;
    periods: DocsPeriods;
    avgDocumentsPerChat: number;
    topUploaders: TopUploader[];
}

interface BySource {
    USER: number;
}

interface DocsPeriods {
    last7d: number;
    last30d: number;
}

interface TopUploader {
    userId: string;
    documentCount: number;
}



// chat stats
export interface ChatsStatsRes {
    avgLifespan: AvgLifespan;
    abandonmentRate: AbandonmentRate;
    mostActiveChats: MostActiveChat[];
}

interface AbandonmentRate {
    rate: number;
    abandonedChats: number;
    totalChats: number;
}

interface AvgLifespan {
    avgLifespanSeconds: number;
    chatCount: number;
}

interface MostActiveChat {
    chatId: string;
    messageCount: number;
    firstMessage: Date;
    lastMessage: Date;
}
