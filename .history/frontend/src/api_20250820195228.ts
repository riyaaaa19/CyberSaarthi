// src/api.ts
import axios from "axios";

const LS_KEYS = {
  BASE_URL: "cs.base_url",
  API_KEY: "cs.api_key",
};

// Default to localhost; let .env or localStorage override
export function getBaseUrl(): string {
  const env = process.env.REACT_APP_API_URL || "";
  const ls = localStorage.getItem(LS_KEYS.BASE_URL) || "";
  // Ensure no trailing slash
  const base = (ls || env || "http://localhost:8000").replace(/\/+$/, "");
  return base + "/v1"; // ✅ add API version prefix expected by backend
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

// ---- Axios instance ----
const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 20000,
});

// Send API key the way backend expects it
api.interceptors.request.use((config) => {
  const key = getApiKey();
  if (key) {
    config.headers.set("X-API-KEY", key); // ✅ match FastAPI dependency
  }
  return config;
});

// ---- Types matching backend ----
export type ScanResponse = {
  verdict: "SAFE" | "SUSPICIOUS" | "MALICIOUS";
  score: number;
  explanation: string;
  lang: string;
};

export type HistoryItem = {
  id: number;
  scan_type: string; // e.g., "email" | "invoice"
  verdict: "SAFE" | "SUSPICIOUS" | "MALICIOUS";
  score: number;
  explanation: string;
  created_at: string;
};

export type HistoryPage = {
  items: HistoryItem[];
  total: number;
  limit: number;
  offset: number;
};

// ---- Endpoints mapped to backend ----
export const endpoints = {
  // Email phishing scan
  scanEmail: (email_text: string, lang: string = "en") =>
    api.post<ScanResponse>("/scan/email", { email_text, lang }),

  // Invoice text scan
  scanInvoiceText: (invoice_text: string, lang: string = "en") =>
    api.post<ScanResponse>("/scan/invoice", { invoice_text, lang }),

  // Invoice file upload (PDF/DOCX)
  uploadInvoice: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api.post<ScanResponse>("/scan/invoice/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // History (server returns paginated records)
  history: (limit = 20, offset = 0) =>
    api.get<HistoryPage>("/reports/history", { params: { limit, offset } }),

  // Health
  health: () => api.get<{ status: string }>("/reports/health"),
};

// Convenience re-exports
export const storage = { LS_KEYS, getBaseUrl, setBaseUrl, getApiKey, setApiKey };
export default api;
