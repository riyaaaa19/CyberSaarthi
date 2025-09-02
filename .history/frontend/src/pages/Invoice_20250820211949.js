import React, { useState } from "react";
import { uploadInvoice } from "../services/api";

function Invoice() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Select file first");
    try {
      const res = await uploadInvoice(file);
      setResult(res);
    } catch {
      setResult({ verdict: "SAFE", explanation: "Demo response, backend not available" });
    }
  };

  return (
    <div>
      <h3>Invoice Scanner</h3>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button className="btn btn-primary ms-2" onClick={handleUpload}>Upload</button>
      {result && (
        <div className="card p-3 mt-3">
          <h5>Verdict: {result.verdict}</h5>
          <p>{result.explanation}</p>
        </div>
      )}
    </div>
  );
}

export default Invoice;
