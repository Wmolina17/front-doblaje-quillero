import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import type {
  AdminStats,
  LookupResult,
  PaymentMethod,
  Raffle,
  RaffleHistoryItem,
  RaffleResponse,
  Settings,
  SummaryItem,
  Ticket,
  TicketPage,
  TopBuyer,
} from "@/types";

const TOKEN_KEY = "dq_admin_session";
const OFFSET_KEY = "dq_clock_offset";

export const tokenStorage = {
  get: () => {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    try {
      const { token, expiresAt } = JSON.parse(raw) as { token: string; expiresAt: number };
      if (expiresAt > Date.now()) return token;
    } catch {
      localStorage.removeItem(TOKEN_KEY);
    }
    return null;
  },
  set: (token: string, expiresAt: number, serverTime: number) => {
    localStorage.setItem(TOKEN_KEY, JSON.stringify({ token, expiresAt }));
    localStorage.setItem(OFFSET_KEY, String(serverTime - Date.now()));
  },
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

const clockOffset = () => Number(localStorage.getItem(OFFSET_KEY)) || 0;

const base64Url = (buffer: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const signRequest = async (token: string, message: string) => {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(token), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return base64Url(await crypto.subtle.sign("HMAC", key, encoder.encode(message)));
};

const sha256 = async (value: string) =>
  base64Url(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));

const rawApiUrl = (import.meta.env.VITE_API_URL ?? "http://localhost:5000").trim().replace(/\/+$/, "");
const API_URL = `${/^https?:\/\//.test(rawApiUrl) ? rawApiUrl : `https://${rawApiUrl}`}/api`;

const signConfig = async (instance: AxiosInstance, config: InternalAxiosRequestConfig, token: string) => {
  let bodyHash = "";
  if (config.data !== undefined && config.data !== null) {
    const body = typeof config.data === "string" ? config.data : JSON.stringify(config.data);
    config.data = body;
    config.headers["Content-Type"] = "application/json";
    bodyHash = await sha256(body);
  }
  const timestamp = Date.now() + clockOffset();
  const nonce = base64Url(crypto.getRandomValues(new Uint8Array(12)).buffer);
  const path = new URL(instance.getUri(config)).pathname;
  const method = (config.method ?? "get").toUpperCase();
  const signature = await signRequest(token, `${timestamp}.${nonce}.${method}.${path}.${bodyHash}`);
  config.headers.Authorization = `Bearer ${token}.${timestamp}.${nonce}.${signature}`;
  return config;
};

const toError = (error: AxiosError<{ error?: string }>) =>
  new Error(error.response?.data?.error ?? "Error de conexión con el servidor");

let clientSession: { token: string; expiresAt: number } | null = null;
let clientSessionRequest: Promise<string> | null = null;

const getClientToken = async () => {
  if (clientSession && clientSession.expiresAt - 60_000 > Date.now()) return clientSession.token;
  clientSessionRequest ??= axios
    .get<{ token: string; expiresAt: number; serverTime: number }>(`${API_URL}/client-token`)
    .then(({ data }) => {
      clientSession = { token: data.token, expiresAt: data.expiresAt };
      localStorage.setItem(OFFSET_KEY, String(data.serverTime - Date.now()));
      return data.token;
    })
    .finally(() => {
      clientSessionRequest = null;
    });
  return clientSessionRequest;
};

const publicHttp = axios.create({ baseURL: API_URL });

publicHttp.interceptors.request.use(async (config) => signConfig(publicHttp, config, await getClientToken()));

publicHttp.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ error?: string; code?: string }>) => {
    const config = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
    if (config && !config._retried && error.response?.data?.code === "INVALID_SIGNATURE") {
      config._retried = true;
      clientSession = null;
      if (typeof config.data === "string") config.data = JSON.parse(config.data);
      return publicHttp(config);
    }
    return Promise.reject(toError(error));
  },
);

const http = axios.create({ baseURL: API_URL });

http.interceptors.request.use(async (config) => {
  const token = tokenStorage.get();
  return token ? signConfig(http, config, token) : config;
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string }>) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith("/admin/panel")) {
      tokenStorage.clear();
      window.location.href = "/admin";
    }
    return Promise.reject(toError(error));
  },
);

export interface NewTicket {
  numberTickets: number;
  fullName: string;
  email: string;
  phone: string;
  reference: string;
  paymentMethodId: string;
  voucher: string;
}

export interface TicketFilters {
  raffleId?: string;
  status: "all" | "pending" | "approved";
  paymentMethod?: string;
  q?: string;
  page: number;
  limit: number;
  order: "asc" | "desc";
}

export type TicketUpdate = Partial<Pick<Ticket, "email" | "phone" | "numberTickets" | "paymentMethodId">>;

export const api = {
  login: async (username: string, password: string) => {
    const { data } = await publicHttp.post<{ token: string; expiresAt: number; serverTime: number }>("/admin/auth", {
      username,
      password,
    });
    tokenStorage.set(data.token, data.expiresAt, data.serverTime);
  },

  getSettings: () => publicHttp.get<Settings>("/settings").then((r) => r.data),
  updateSettings: (data: Partial<Settings>) => http.put<Settings>("/settings", data).then((r) => r.data),

  getRaffle: () => publicHttp.get<RaffleResponse>("/raffle").then((r) => r.data),
  getFullRaffle: () => http.get<Raffle | null>("/raffle/full").then((r) => r.data),
  getAdminStats: () => http.get<AdminStats>("/raffle/stats").then((r) => r.data),
  createRaffle: (data: Raffle) => http.post("/raffle", data).then((r) => r.data),
  updateRaffle: (data: Partial<Raffle>) => http.put("/raffle", data).then((r) => r.data),
  finishRaffle: () => http.post("/raffle/finish").then((r) => r.data),
  getRaffleHistory: () => http.get<RaffleHistoryItem[]>("/raffles/history").then((r) => r.data),
  resumeRaffle: (id: string) => http.post(`/raffles/${id}/resume`).then((r) => r.data),
  toggleRaffleVisibility: () =>
    http.post<{ visible: boolean }>("/raffle/toggle-visibility").then((r) => r.data),

  getPaymentMethods: () => publicHttp.get<PaymentMethod[]>("/payment-methods").then((r) => r.data),
  getAllPaymentMethods: () => http.get<PaymentMethod[]>("/payment-methods/all").then((r) => r.data),
  savePaymentMethod: (data: PaymentMethod) =>
    (data._id
      ? http.put<PaymentMethod>(`/payment-methods/${data._id}`, data)
      : http.post<PaymentMethod>("/payment-methods", data)
    ).then((r) => r.data),
  deletePaymentMethod: (id: string) => http.delete(`/payment-methods/${id}`).then((r) => r.data),

  createTicket: (data: NewTicket) =>
    publicHttp.post<{ ticket: Pick<Ticket, "amountPaid" | "currency" | "paymentMethod"> }>("/tickets", data).then((r) => r.data),
  lookupTickets: (email: string) => publicHttp.post<LookupResult>("/tickets/lookup", { email }).then((r) => r.data),

  getTickets: (filters: TicketFilters) => http.get<TicketPage>("/tickets", { params: filters }).then((r) => r.data),
  getVoucher: (id: string) => http.get<{ voucher: string }>(`/tickets/${id}/voucher`).then((r) => r.data.voucher),
  findTicketByNumber: (code: string) =>
    http
      .get<{ sold: boolean; ticket: Ticket | null }>(`/tickets/number/${encodeURIComponent(code)}`)
      .then((r) => r.data),
  approveTicket: (id: string) =>
    http.post<{ approvalCodes: string[]; emailSent: boolean }>(`/tickets/${id}/approve`).then((r) => r.data),
  rejectTicket: (id: string) => http.delete(`/tickets/${id}`).then((r) => r.data),
  resendTicket: (id: string) => http.post(`/tickets/${id}/resend`).then((r) => r.data),
  updateTicket: (id: string, data: TicketUpdate) =>
    http.put<{ ticket: Ticket }>(`/tickets/${id}`, data).then((r) => r.data.ticket),
  getTopBuyers: (startDate?: string, endDate?: string) =>
    http.get<TopBuyer[]>("/tickets/top-buyers", { params: { startDate, endDate } }).then((r) => r.data),
  getSummary: () => http.get<SummaryItem[]>("/tickets/summary").then((r) => r.data),
};
