import axios from "axios";

const LS_KEYS = {
  BASE_URL: "cs.base_url",
  API_KEY: "cs.api_key",
};

export function getBaseUrl(): string {
  const env = process.env.REACT_APP_API_URL;
  const ls = localStorage.getItem(LS_KEYS.BASE_URL) || "";
  return (ls || env || "http://localhost:8000").replace(/\/+$/, "");
}

export function setBaseUrl(url: string) {
  localStorage.setItem(LS_KEYS.BASE_URL, url);
  api.defaults.baseURL = getBaseUrl();
}

export function getApiKey(): string {
  return localStorage.getItem(LS_KEYS.API_KEY) || "";
}

export function setApiKey(key: string) {
  localStorage.setItem(LS_KEYS.API_KEY, key);
}

// Axios instance
export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 20000,
});

// ✅ Correct way: use headers.set()
api.interceptors.request.use((config) => {
  const key = getApiKey();
  if (key) {
    config.headers.set("Authorization", `Bearer ${key}`);
  }
  return config;
});

// ---- Endpoints ----
export type PhishingScanPayload = { input: string };
export type PhishingScanResponse = {
  result: "safe" | "suspicious" | "malicious";
  score: number;
  reasons?: string[];
};

export type InvoiceCheckPayload = {
  amount?: number;
  vendor_name?: string;
  gstin?: string;
  invoice_number?: string;
  bank_account?: string;
  ifsc?: string;
  date?: string;
  email?: string;
  notes?: string;
};
export type InvoiceCheckResponse = {
  result: "valid" | "risky" | "fraudulent";
  score: number;
  flags?: string[];
};

export type UploadInvoiceResponse = {
  result: "valid" | "risky" | "fraudulent";
  score: number;
  details?: Record<string, any>;
};

export type ThreatItem = {
  id: string | number;
  type: "phishing" | "invoice" | "access" | "other";
  risk: "high" | "medium" | "low";
  title: string;
  timestamp: string;
  meta?: Record<string, any>;
};

export type ReportsSummary = {
  totals: { high: number; medium: number; low: number };
  recent: ThreatItem[];
};

export const endpoints = {
  phishingScan: (payload: PhishingScanPayload) =>
    api.post<PhishingScanResponse>("/phishing/scan", payload),

  invoiceCheck: (payload: InvoiceCheckPayload) =>
    api.post<InvoiceCheckResponse>("/invoice/check", payload),

  uploadInvoice: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api.post<UploadInvoiceResponse>("/invoice/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  reportsSummary: () => api.get<ReportsSummary>("/reports/summary"),
  reportsList: () => api.get<ThreatItem[]>("/reports"),
};

export const storage = { LS_KEYS, getBaseUrl, setBaseUrl, getApiKey, setApiKey };
