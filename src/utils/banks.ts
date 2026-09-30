import type { Currency } from "@/types";

export interface BankProvider {
  id: string;
  name: string;
  country: "CO" | "US" | "INT";
  currency: Currency;
  domain?: string;
  simpleIcon?: string;
  fields: string[];
}

const CO_BANK_FIELDS = ["Tipo de cuenta", "Número de cuenta", "Llave Bre-B", "Cédula / NIT"];
const US_BANK_FIELDS = ["Routing number", "Account number", "Tipo de cuenta"];

export const BANK_PROVIDERS: BankProvider[] = [
  { id: "nequi", name: "Nequi", country: "CO", currency: "COP", domain: "nequi.com.co", fields: ["Número Nequi", "Llave Bre-B"] },
  { id: "bancolombia", name: "Bancolombia", country: "CO", currency: "COP", domain: "bancolombia.com", fields: CO_BANK_FIELDS },
  { id: "daviplata", name: "Daviplata", country: "CO", currency: "COP", domain: "daviplata.com", fields: ["Número Daviplata", "Llave Bre-B"] },
  { id: "breb", name: "Llave Bre-B", country: "CO", currency: "COP", domain: "banrep.gov.co", fields: ["Llave Bre-B", "Tipo de llave"] },
  { id: "davivienda", name: "Davivienda", country: "CO", currency: "COP", domain: "davivienda.com", fields: CO_BANK_FIELDS },
  { id: "bancodebogota", name: "Banco de Bogotá", country: "CO", currency: "COP", domain: "bancodebogota.com", fields: CO_BANK_FIELDS },
  { id: "bbva", name: "BBVA Colombia", country: "CO", currency: "COP", domain: "bbva.com.co", fields: CO_BANK_FIELDS },
  { id: "nu", name: "Nu Colombia", country: "CO", currency: "COP", domain: "nu.com.co", fields: ["Número de cuenta", "Llave Bre-B"] },
  { id: "bancodeoccidente", name: "Banco de Occidente", country: "CO", currency: "COP", domain: "bancodeoccidente.com.co", fields: CO_BANK_FIELDS },
  { id: "bancopopular", name: "Banco Popular", country: "CO", currency: "COP", domain: "bancopopular.com.co", fields: CO_BANK_FIELDS },
  { id: "avvillas", name: "AV Villas", country: "CO", currency: "COP", domain: "avvillas.com.co", fields: CO_BANK_FIELDS },
  { id: "cajasocial", name: "Banco Caja Social", country: "CO", currency: "COP", domain: "bancocajasocial.com", fields: CO_BANK_FIELDS },
  { id: "colpatria", name: "Scotiabank Colpatria", country: "CO", currency: "COP", domain: "scotiabankcolpatria.com", fields: CO_BANK_FIELDS },
  { id: "itau", name: "Itaú", country: "CO", currency: "COP", domain: "itau.co", fields: CO_BANK_FIELDS },
  { id: "bancoagrario", name: "Banco Agrario", country: "CO", currency: "COP", domain: "bancoagrario.gov.co", fields: CO_BANK_FIELDS },
  { id: "falabella", name: "Banco Falabella", country: "CO", currency: "COP", domain: "bancofalabella.com.co", fields: CO_BANK_FIELDS },
  { id: "lulo", name: "Lulo Bank", country: "CO", currency: "COP", domain: "lulobank.com", fields: ["Número de cuenta", "Llave Bre-B"] },
  { id: "dale", name: "dale!", country: "CO", currency: "COP", domain: "dale.com.co", fields: ["Número de celular", "Llave Bre-B"] },
  { id: "movii", name: "MOVii", country: "CO", currency: "COP", domain: "movii.com.co", fields: ["Número de celular"] },
  { id: "rappipay", name: "RappiPay", country: "CO", currency: "COP", domain: "rappipay.co", fields: ["Número de cuenta", "Llave Bre-B"] },
  { id: "paypal", name: "PayPal", country: "INT", currency: "USD", simpleIcon: "paypal", fields: ["Correo PayPal", "Link de pago"] },
  { id: "zelle", name: "Zelle", country: "US", currency: "USD", simpleIcon: "zelle", fields: ["Correo o teléfono Zelle"] },
  { id: "cashapp", name: "Cash App", country: "US", currency: "USD", simpleIcon: "cashapp", fields: ["$Cashtag"] },
  { id: "venmo", name: "Venmo", country: "US", currency: "USD", simpleIcon: "venmo", fields: ["Usuario Venmo"] },
  { id: "chase", name: "Chase", country: "US", currency: "USD", domain: "chase.com", fields: US_BANK_FIELDS },
  { id: "bankofamerica", name: "Bank of America", country: "US", currency: "USD", domain: "bankofamerica.com", fields: US_BANK_FIELDS },
  { id: "wellsfargo", name: "Wells Fargo", country: "US", currency: "USD", domain: "wellsfargo.com", fields: US_BANK_FIELDS },
  { id: "citi", name: "Citibank", country: "US", currency: "USD", domain: "citi.com", fields: US_BANK_FIELDS },
  { id: "capitalone", name: "Capital One", country: "US", currency: "USD", domain: "capitalone.com", fields: US_BANK_FIELDS },
  { id: "binance", name: "Binance", country: "INT", currency: "USD", simpleIcon: "binance", fields: ["Binance Pay ID", "Correo Binance"] },
  { id: "wise", name: "Wise", country: "INT", currency: "USD", simpleIcon: "wise", fields: ["Correo Wise", "Número de cuenta"] },
  { id: "custom", name: "Otro / Personalizado", country: "INT", currency: "COP", fields: [] },
];

export const COUNTRY_LABELS: Record<BankProvider["country"], string> = {
  CO: "Colombia",
  US: "Estados Unidos",
  INT: "Internacional",
};

export const FIELD_SUGGESTIONS = Array.from(
  new Set([
    ...BANK_PROVIDERS.flatMap((provider) => provider.fields),
    "Titular",
    "Número de celular",
    "Correo",
    "Código QR (link)",
  ]),
);

export const findProvider = (id?: string) => BANK_PROVIDERS.find((provider) => provider.id === id);

export const providerLogo = (provider?: BankProvider) => {
  if (!provider) return "";
  if (provider.simpleIcon) return `https://cdn.simpleicons.org/${provider.simpleIcon}`;
  if (provider.domain) return `https://www.google.com/s2/favicons?domain=${provider.domain}&sz=128`;
  return "";
};
