import React, { useState } from "react";
import { endpoints, InvoiceCheckPayload, InvoiceCheckResponse } from "../api";

export default function InvoiceScan() {
  const [form, setForm] = useState<InvoiceCheckPayload>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InvoiceCheckResponse | null>(null);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setResult(null);
    try {
      setLoading(true);
      const res = await endpoints.invoiceCheck(form);
      setResult(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Check failed. Verify Base URL & API key.");
    } finally {
      setLoading(false);
    }
  };

  const set = (k: keyof InvoiceCheckPayload, v: any) => setForm({ ...form, [k]: v });

  return (
    <div className="container py-4">
      <div className="p-4 bg-white" style={{ borderRadius: 16, border: "1px solid #eee", boxShadow: "0 10px 30px rgba(0,0,0,.05)" }}>
        <h4 className="mb-3">Invoice Check (Manual)</h4>
        <form onSubmit={onSubmit}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Amount</label>
              <input className="form-control" type="number" step="0.01" onChange={(e)=>set("amount", Number(e.target.value)||0)} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Vendor Name</label>
              <input className="form-control" onChange={(e)=>set("vendor_name", e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label">GSTIN</label>
              <input className="form-control" onChange={(e)=>set("gstin", e.target.value)} />
            </div>

            <div className="col-md-4">
              <label className="form-label">Invoice Number</label>
              <input className="form-control" onChange={(e)=>set("invoice_number", e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Bank Account</label>
              <input className="form-control" onChange={(e)=>set("bank_account", e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label">IFSC</label>
              <input className="form-control" onChange={(e)=>set("ifsc", e.target.value)} />
            </div>

            <div className="col-md-4">
              <label className="form-label">Date</label>
              <input className="form-control" type="date" onChange={(e)=>set("date", e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Email</label>
              <input className="form-control" type="email" onChange={(e)=>set("email", e.target.value)} />
            </div>
            <div className="col-md-12">
              <label className="form-label">Notes</label>
              <textarea className="form-control" rows={3} onChange={(e)=>set("notes", e.target.value)} />
            </div>
          </div>

          <button className="btn btn-primary mt-3" disabled={loading}>
            {loading ? "Checking..." : "Check Invoice"}
          </button>
        </form>

        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {result && (
          <div className="alert mt-3" style={{ background: "#f8f9fa" }}>
            <div className="d-flex align-items-center gap-3">
              <div className="display-6 fw-bold mb-0">{result.score}</div>
              <div>
                <div className="fw-bold text-capitalize">{result.result}</div>
                <div className="small text-muted">Risk Score</div>
              </div>
            </div>
            {result.flags?.length ? (
              <ul className="mt-3 mb-0">
                {result.flags.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
