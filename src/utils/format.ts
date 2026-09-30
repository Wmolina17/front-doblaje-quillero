import type { Currency } from "@/types";

const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export const formatMoney = (value: number, currency: Currency = "COP") =>
  currency === "USD" ? `${usdFormatter.format(value)} USD` : copFormatter.format(value);

export const formatNumber = (value: number) => new Intl.NumberFormat("es-CO").format(value);

export const calculateTotal = (
  ticketPrice: number,
  quantity: number,
  currency: Currency,
  usdRate: number,
) => {
  const totalCop = ticketPrice * quantity;
  if (currency === "USD") return Math.round((totalCop / usdRate) * 100) / 100;
  return Math.round(totalCop);
};

export const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });

export const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

export const whatsappLink = (phone: string, text?: string) => {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
};
