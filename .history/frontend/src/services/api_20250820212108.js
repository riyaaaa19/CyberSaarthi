const API_BASE = "http://localhost:8000"; // change to your backend URL

export async function getDashboard() {
  const res = await fetch(`${API_BASE}/dashboard/summary`);
  return res.json();
}

export async function uploadInvoice(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/invoice/upload`, { method: "POST", body: formData });
  return res.json();
}

export async function getReports() {
  const res = await fetch(`${API_BASE}/reports`);
  return res.json();
}
