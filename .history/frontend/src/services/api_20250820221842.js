const DEFAULT_API_BASE = window.localStorage.getItem('API_BASE') || "http://localhost:8000";
const API_BASE = DEFAULT_API_BASE.replace(/\/$/, ""); 
const V1 = "/v1";

function getApiKeyHeader() {
  const key = window.localStorage.getItem('API_KEY');
  return key ? { "x-api-key": key } : {};
}

async function handleResp(res) {
  const contentType = res.headers.get('content-type') || '';
  if (!res.ok) {
    let text = await res.text();
    try { text = JSON.parse(text); } catch(e){}
    throw new Error(text.detail || text || 'Request failed');
  }
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

export async function healthCheck() {
  const res = await fetch(`${API_BASE}${V1}/reports/health`, { headers: getApiKeyHeader() });
  return handleResp(res);
}

export async function getHistory(limit=20, offset=0) {
  const url = new URL(`${API_BASE}${V1}/reports/history`);
  url.searchParams.set('limit', limit);
  url.searchParams.set('offset', offset);
  const res = await fetch(url.toString(), { headers: getApiKeyHeader() });
  return handleResp(res);
}

export async function scanEmail(emailText, lang="en") {
  const body = { email_text: emailText, lang };
  const res = await fetch(`${API_BASE}${V1}/scan/email`, {
    method: 'POST',
    headers: { "Content-Type": "application/json", ...getApiKeyHeader() },
    body: JSON.stringify(body),
  });
  return handleResp(res);
}

export async function scanInvoiceText(invoiceText, lang="en") {
  const body = { invoice_text: invoiceText, lang };
  const res = await fetch(`${API_BASE}${V1}/scan/invoice`, {
    method: 'POST',
    headers: { "Content-Type": "application/json", ...getApiKeyHeader() },
    body: JSON.stringify(body),
  });
  return handleResp(res);
}

export async function uploadInvoiceFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}${V1}/scan/invoice/upload`, {
    method: "POST",
    headers: getApiKeyHeader(),
    body: formData
  });
  return handleResp(res);
}

export function setRuntimeConfig({ apiBase, apiKey }) {
  if (apiBase !== undefined) window.localStorage.setItem('API_BASE', apiBase);
  if (apiKey !== undefined) {
    if (apiKey === "" || apiKey === null) window.localStorage.removeItem('API_KEY');
    else window.localStorage.setItem('API_KEY', apiKey);
  }
}

export { API_BASE };
