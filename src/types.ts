export type Currency = "COP" | "USD";

export interface Prize {
  title: string;
  amount: string;
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
