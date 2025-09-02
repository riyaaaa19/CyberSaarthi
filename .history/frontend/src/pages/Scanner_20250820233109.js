import React, { useState } from "react";
import { scanEmail, scanInvoiceText, uploadInvoiceFile } from "../services/api";
import { t } from "../i18n";

function Scanner() {
  const [activeTab, setActiveTab] = useState("email");
  const [emailText, setEmailText] = useState("");
  const [invoiceText, setInvoiceText] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const cardStyle = { padding:"15px", border:"1px solid #ddd", borderRadius:"10px", marginTop:"20px", boxShadow:"0 2px 5px rgba(0,0,0,0.1)" };
  const buttonStyle = { marginTop:"10px", padding:"8px 15px", border:"none", borderRadius:"5px", background:"#2196f3", color:"white", cursor:"pointer" };
  const tabStyle = (tab) => ({
    flex:1,
    padding:"10px",
    textAlign:"center",
    cursor:"pointer",
    borderBottom: activeTab === tab ? "3px solid #2196f3" : "1px solid #ccc",
    fontWeight: activeTab === tab ? "bold" : "normal"
  });

  const handleScanEmail = async () => {
    if (!emailText || emailText.length < 10) return alert("Enter email text (min 10 chars)");
    try {
      const res = await scanEmail(emailText);
      setResult(res);
    } catch {
      setResult({ verdict: "SAFE", explanation: t("email.safe") });
    }
  };

  const handleScanInvoiceText = async () => {
    if (!invoiceText || invoiceText.length < 10) return alert("Enter invoice text (min 10 chars)");
    try {
      const res = await scanInvoiceText(invoiceText);
      setResult(res);
    } catch {
      setResult({ verdict: "SAFE", explanation: t("invoice.safe") });
    }
  };

  const handleUploadInvoice = async () => {
    if (!file) return alert("Select file first");
    try {
      const res = await uploadInvoiceFile(file);
      setResult(res);
    } catch {
      setResult({ verdict: "SAFE", explanation: t("invoice.safe") });
    }
  };

  const getVerdictMsg = (type, verdict) => {
    if (!verdict) return "";
    return t(`${type}.${verdict.toLowerCase()}`);
  };

  return (
    <div style={{ padding:"20px" }}>
      <h2>{t("scanner.title")}</h2>

      {/* Tabs */}
      <div style={{ display:"flex", marginTop:"10px", borderBottom:"1px solid #ccc" }}>
        <div style={tabStyle("email")} onClick={()=>setActiveTab("email")}>{t("scanner.emailTab")}</div>
        <div style={tabStyle("invoice")} onClick={()=>setActiveTab("invoice")}>{t("scanner.invoiceTab")}</div>
      </div>

      {/* Email Scanner */}
      {activeTab === "email" && (
        <div style={{ marginTop:"20px" }}>
          <label>{t("email.paste")}</label>
          <textarea
            style={{ width:"100%", height:"150px", marginTop:"10px", padding:"10px", borderRadius:"5px", border:"1px solid #ccc" }}
            value={emailText}
            onChange={(e)=>setEmailText(e.target.value)}
            placeholder="Paste suspicious email text here"
          />
          <button style={buttonStyle} onClick={handleScanEmail}>{t("email.scanText")}</button>
        </div>
      )}

      {/* Invoice Scanner */}
      {activeTab === "invoice" && (
        <div style={{ marginTop:"20px" }}>
          <label>{t("invoice.upload")}</label><br/>
          <input type="file" onChange={(e)=>setFile(e.target.files[0])} style={{ marginTop:"10px" }} />
          <button style={buttonStyle} onClick={handleUploadInvoice}>Upload</button>

          <div style={{ marginTop:"20px" }}>
            <label>{t("invoice.paste")}</label>
            <textarea
              style={{ width:"100%", height:"120px", marginTop:"10px", padding:"10px", borderRadius:"5px", border:"1px solid #ccc" }}
              value={invoiceText}
              onChange={(e)=>setInvoiceText(e.target.value)}
            />
            <button style={{ ...buttonStyle, background:"#4caf50" }} onClick={handleScanInvoiceText}>{t("invoice.scanText")}</button>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={cardStyle}>
          <h4>Verdict: {result.verdict}</h4>
          <p><b>Score:</b> {result.score ?? "N/A"}</p>
          <p>{getVerdictMsg(activeTab, result.verdict)}</p>
        </div>
      )}
    </div>
  );
}

export default Scanner;
