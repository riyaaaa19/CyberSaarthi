import axios from "axios";

export type Verdict = "SAFE" | "SUSPICIOUS" | "MALICIOUS";

export type ScanResponse = {
  verdict: Verdict;
  score: number;
  explanation: string;
  lang: string;
};

export type HistoryItem = {
  id: number;
  scan_type: string;
  verdict: Verdict;
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

const LS_KEYS = {
  BASE_URL: "cs.base_url",
  API_KEY: "cs.api_key",
  LANG: "cs.lang",
} as const;

export function getLang() {
  return localStorage.getItem(LS_KEYS.LANG) || "en";
}
export function setLang(lang: string) {
  localStorage.setItem(LS_KEYS.LANG, lang);
}

export function getBaseUrl(): string {
  const env = process.env.REACT_APP_API_URL || "";
  const ls = localStorage.getItem(LS_KEYS.BASE_URL) || "";
  const base = (ls || env || "http://localhost:8000").replace(/\/+$/, "");
  return base + "/v1";
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

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const key = getApiKey();
  if (key) config.headers["X-API-KEY"] = key;
  return config;
});

// Endpoints
export const endpoints = {
  scanEmail: (email_text: string, lang: string = getLang()) =>
    api.post<ScanResponse>("/scan/email", { email_text, lang }),

  scanInvoiceText: (invoice_text: string, lang: string = getLang()) =>
    api.post<ScanResponse>("/scan/invoice", { invoice_text, lang }),

  uploadInvoice: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api.post<ScanResponse>("/scan/invoice/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  history: (limit = 50, offset = 0) =>
    api.get<HistoryPage>("/reports/history", { params: { limit, offset } }),
};

export const storage = { LS_KEYS, getBaseUrl, setBaseUrl, getApiKey, setApiKey, getLang, setLang };
export default api;
