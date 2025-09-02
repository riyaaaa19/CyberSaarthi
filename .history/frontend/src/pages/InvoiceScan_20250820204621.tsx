import React, { useState } from "react";
import axios from "axios";

const InvoiceScan: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("http://localhost:8000/v1/invoice/scan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data);
    } catch (err: any) {
      setError("Scan failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const container: React.CSSProperties = {
    padding: "20px",
    animation: "fadeIn 0.6s ease-in-out",
  };

  const title: React.CSSProperties = {
    fontSize: "22px",
    fontWeight: 700,
    marginBottom: "20px",
    color: "#0B1930",
  };

  const card: React.CSSProperties = {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  };

  const button: React.CSSProperties = {
    background: "#1B5EAA",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 18px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  const buttonHover: React.CSSProperties = {
    ...button,
    background: "#14467D",
  };

  return (
    <div style={container}>
      <h2 style={title}>Invoice Scan</h2>

      <div style={card}>
        <input
          type="file"
          accept="application/pdf,image/*"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          style={{
            display: "block",
            marginBottom: "16px",
            padding: "8px",
            border: "1px solid #E4E7EC",
            borderRadius: "8px",
            width: "100%",
          }}
        />

        <button
          style={button}
          onMouseOver={(e) =>
            ((e.target as HTMLButtonElement).style.background = "#14467D")
          }
          onMouseOut={(e) =>
            ((e.target as HTMLButtonElement).style.background = "#1B5EAA")
          }
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Scanning..." : "Scan Invoice"}
        </button>

        {error && (
          <div
            style={{
              marginTop: "16px",
              padding: "12px",
              borderRadius: "8px",
              background: "#FDECEA",
              color: "#C62828",
              fontWeight: 500,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {result && (
          <div
            style={{
              marginTop: "20px",
              padding: "16px",
              borderRadius: "10px",
              background: "#F5F7FA",
            }}
          >
            <h4 style={{ marginBottom: "10px" }}>Scan Result</h4>
            <p>
              <b>Verdict:</b>{" "}
              <span
                style={{
                  color:
                    result.verdict === "SAFE"
                      ? "#1E824C"
                      : result.verdict === "SUSPICIOUS"
                      ? "#C98300"
                      : "#C62828",
                  fontWeight: 600,
                }}
              >
                {result.verdict}
              </span>
            </p>
            <p>
              <b>Score:</b> {result.score}
            </p>
            <p>
              <b>Explanation:</b> {result.explanation}
            </p>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default InvoiceScan;
