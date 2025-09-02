import React, { useState } from "react";
import { uploadInvoiceFile, scanInvoiceText } from "../services/api";

function Invoice() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Select file first");
    try {
      const res = await uploadInvoiceFile(file);
      setResult(res);
    } catch (e) {
      console.error(e);
      setResult({ verdict: "SAFE", explanation: "Demo response, backend not available or returned error." });
    }
  };

  const handleScanText = async () => {
    if (!text || text.length < 10) return alert("Enter invoice text (min 10 chars)");
    try {
      const res = await scanInvoiceText(text);
      setResult(res);
    } catch (e) {
      console.error(e);
      setResult({ verdict: "SAFE", explanation: "Demo response, backend not available or returned error." });
    }
  };

  return (
    <div>
      <h3>Invoice Scanner</h3>
      <div className="mb-3">
        <label>Upload invoice file (PDF/image)</label><br/>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button className="btn btn-primary ms-2" onClick={handleUpload}>Upload</button>
      </div>

      <div className="mb-3">
        <label>Or paste invoice text</label>
        <textarea className="form-control" rows={6} value={text} onChange={(e)=>setText(e.target.value)} />
        <button className="btn btn-secondary mt-2" onClick={handleScanText}>Scan Text</button>
      </div>

      {result && (
        <div className="card p-3 mt-3">
          <h5>Verdict: {result.verdict}</h5>
          <p>Score: {result.score ?? "N/A"}</p>
          <p>{result.explanation}</p>
        </div>
      )}
    </div>
  );
}

export default Invoice;
