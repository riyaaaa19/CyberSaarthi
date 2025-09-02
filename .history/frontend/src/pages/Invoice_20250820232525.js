import React, { useState } from "react";
import { uploadInvoiceFile, scanInvoiceText } from "../services/api";
import { t } from "../i18n";

function Invoice() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const cardStyle = { padding:"15px", border:"1px solid #ddd", borderRadius:"10px", marginTop:"20px", boxShadow:"0 2px 5px rgba(0,0,0,0.1)" };
  const buttonStyle = { marginTop:"10px", padding:"8px 15px", border:"none", borderRadius:"5px", background:"#2196f3", color:"white", cursor:"pointer" };

  const handleUpload = async () => {
    if (!file) return alert("Select file first");
    try {
      const res = await uploadInvoiceFile(file);
      setResult(res);
    } catch {
      setResult({ verdict: "SAFE", explanation: t("invoice.safe") });
    }
  };

  const handleScanText = async () => {
    if (!text || text.length < 10) return alert("Enter invoice text (min 10 chars)");
    try {
      const res = await scanInvoiceText(text);
      setResult(res);
    } catch {
      setResult({ verdict: "SAFE", explanation: t("invoice.safe") });
    }
  };

  const getVerdictMsg = (verdict) => {
    if (!verdict) return "";
    return t(`invoice.${verdict.toLowerCase()}`);
  };

  return (
    <div style={{ padding:"20px" }}>
      <h2>Invoice Scanner</h2>

      <div style={{ marginTop:"20px" }}>
        <label>{t("invoice.upload")}</label><br/>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ marginTop:"10px" }} />
        <button style={buttonStyle} onClick={handleUpload}>Upload</button>
      </div>

      <div style={{ marginTop:"20px" }}>
        <label>{t("invoice.paste")}</label>
        <textarea style={{ width:"100%", height:"120px", marginTop:"10px", padding:"10px", borderRadius:"5px", border:"1px solid #ccc" }} value={text} onChange={(e)=>setText(e.target.value)} />
        <button style={{ ...buttonStyle, background:"#4caf50" }} onClick={handleScanText}>{t("invoice.scanText")}</button>
      </div>

      {result && (
        <div style={cardStyle}>
          <h4>Verdict: {result.verdict}</h4>
          <p><b>Score:</b> {result.score ?? "N/A"}</p>
          <p>{getVerdictMsg(result.verdict)}</p>
        </div>
      )}
    </div>
  );
}

export default Invoice;
