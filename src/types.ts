export type Currency = "COP" | "USD";

export interface Prize {
  title: string;
  amount: string;
}

export interface Expense {
  concept: string;
  amount: number;
}

export interface Raffle {
  _id?: string;
  name: string;
  description: string;
  ticketPrice: number;
  minTickets: number;
  maxTicketsPerPurchase: number;
  totalTickets: number;
  drawDate?: string | null;
  images: string[];
  prizes: Prize[];
  prizeNumbersCount?: number;
  prizeNumbers?: string[];
  prizeNumberAmount?: string;
  expenses?: Expense[];
  goalPercent?: number;
  campaignDays?: number;
  visible: boolean;
  status?: "active" | "finished";
  createdAt?: string;
  finishedAt?: string;
}

export interface RaffleHistoryItem extends Raffle {
  _id: string;
  stats: {
    orders: number;
    buyers: number;
    sold: number;
    pending: number;
    totals: { currency: Currency; total: number }[];
  };
}

export interface RaffleResponse {
  raffle: Raffle | null;
  stats: { availablePercent: number; maxPurchasable: number } | null;
}

export interface AdminStats {
  sold: number;
  pending: number;
  pendingOrders: number;
  totalTickets: number;
}

export interface PaymentField {
  label: string;
  value: string;
}

export interface PaymentMethod {
  _id?: string;
  name: string;
  provider: string;
  logoUrl?: string;
  currency: Currency;
  holder?: string;
  fields: PaymentField[];
  instructions?: string;
  active: boolean;
  order: number;
}

export const SOCIAL_KEYS = [
  "tiktok",
  "instagram",
  "facebook",
  "facebookAlt",
  "youtube",
  "x",
  "threads",
  "kick",
  "twitch",
  "telegram",
  "whatsappChannel",
] as const;

export type SocialKey = (typeof SOCIAL_KEYS)[number];

export interface Settings {
  siteName: string;
  tagline: string;
  aboutText: string;
  logoUrl: string;
  supportPhone: string;
  supportWhatsapp: string;
  supportEmail: string;
  supportHours: string;
  advertisingPhone: string;
  usdRate: number;
  socials: Record<SocialKey, string>;
}

export interface Ticket {
  _id: string;
  numberTickets: number;
  fullName: string;
  email: string;
  phone: string;
  reference: string;
  paymentMethodId?: string;
  paymentMethod: string;
  currency: Currency;
  amountPaid: number;
  approved: boolean;
  approvalCodes: string[];
  createdAt: string;
}

export interface TicketPage {
  items: Ticket[];
  total: number;
  page: number;
  pages: number;
}

export interface LookupResult {
  fullName: string;
  email: string;
  codes: string[];
  pendingOrders: number;
}

export interface TopBuyer {
  _id: string;
  fullName: string;
  phone: string;
  totalTickets: number;
  purchases: number;
}

export interface SummaryItem {
  paymentMethod: string;
  currency: Currency;
  total: number;
  tickets: number;
}

export interface FinanceScenario {
  percent: number;
  numbers: number;
  revenue: number;
  result: number;
  margin: number;
  isGoal: boolean;
}

export interface FinanceDay {
  date: string;
  orders: number;
  numbers: number;
  revenue: number;
  cumulativeNumbers: number;
  cumulativeRevenue: number;
}

export interface FinanceReport {
  plan: {
    ticketPrice: number;
    totalTickets: number;
    minTickets: number;
    campaignDays: number;
    goalPercent: number;
    goalNumbers: number;
    goalRevenue: number;
    goalProfit: number;
    goalMargin: number;
    minPurchaseAmount: number;
    expenses: Expense[];
    totalExpenses: number;
    breakEvenNumbers: number;
    breakEvenPercent: number;
    dailyGoalNumbers: number;
    dailyGoalRevenue: number;
  };
  scenarios: FinanceScenario[];
  buyerScenarios: {
    perBuyer: number;
    goal: { buyers: number; perDay: number };
    full: { buyers: number; perDay: number };
  }[];
  milestones: { day: number; numbers: number; buyers: number; revenue: number }[];
  progress: {
    sold: number;
    pending: number;
    revenue: number;
    pendingRevenue: number;
    buyers: number;
    orders: number;
    result: number;
    soldPercent: number;
    goalProgressPercent: number;
    breakEvenReached: boolean;
    numbersToBreakEven: number;
    startDay: string;
    elapsedDays: number;
    daysLeft: number;
    avgNumbersPerDay: number;
    avgRevenuePerDay: number;
    avgBuyersPerDay: number;
    neededNumbersPerDay: number;
    projection: { numbers: number; revenue: number; result: number };
  };
  range: {
    startDate: string;
    endDate: string;
    days: number;
    orders: number;
    numbers: number;
    revenue: number;
    buyers: number;
    avgNumbersPerDay: number;
    avgRevenuePerDay: number;
    avgOrdersPerDay: number;
    bestDay: { date: string; numbers: number; revenue: number } | null;
  };
  daily: FinanceDay[];
  prizeNumbers: { code: string; holder: { fullName: string; email: string; phone: string } | null }[];
}
