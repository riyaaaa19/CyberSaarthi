import React, { useState, useContext, useEffect, useRef } from "react";
import { useT } from "../i18n";
import { ThemeLangContext } from "../ThemeLangContext";
import { generateScanReport } from "../utils/pdfGenerator";
import { highlightSuspiciousKeywords, countSuspiciousKeywords, getSuspiciousKeywordsFound } from "../utils/keywordHighlighter";

function Scanner() {
  const t = useT();
  const { theme, lang } = useContext(ThemeLangContext);

  const [activeTab, setActiveTab] = useState("email");
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    setInput("");
    setSelectedFile(null);
    setUploading(false);
    setScanning(false);
    setResult(null);
    setShowResult(false);
  }, [activeTab]);




  // Verdict badge styling
  const getVerdictBadgeStyle = (verdict) => {
    const baseStyle = {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 20px",
      borderRadius: "50px",
      fontSize: "14px",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.025em",
      boxShadow: theme === "dark" ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "0 2px 8px rgba(0, 0, 0, 0.1)",
    };

    if (verdict?.toLowerCase().includes("safe")) {
      return {
        ...baseStyle,
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        color: "#ffffff",
        boxShadow: "0 4px 16px rgba(16, 185, 129, 0.3)",
      };
    } else if (verdict?.toLowerCase().includes("suspicious")) {
      return {
        ...baseStyle,
        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        color: "#ffffff",
        boxShadow: "0 4px 16px rgba(245, 158, 11, 0.3)",
      };
    } else if (verdict?.toLowerCase().includes("malicious")) {
      return {
        ...baseStyle,
        background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        color: "#ffffff",
        boxShadow: "0 4px 16px rgba(239, 68, 68, 0.3)",
      };
    }
    return {
      ...baseStyle,
      background: theme === "dark" ? "var(--bg-tertiary-dark)" : "var(--bg-tertiary-light)",
      color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary-light)",
      border: theme === "dark" ? "1px solid var(--border-dark)" : "1px solid var(--border-light)",
    };
  };

  // Progress bar for risk score
  const progressBarStyle = (score) => ({
    width: "100%",
    height: "10px",
    background: theme === "dark" ? "var(--bg-tertiary-dark)" : "var(--bg-tertiary-light)",
    borderRadius: "5px",
    overflow: "hidden",
    margin: "12px 0 20px 0",
    border: theme === "dark" ? "1px solid var(--border-dark)" : "1px solid var(--border-light)",
  });

  const progressFillStyle = (score) => ({
    height: "100%",
    width: `${Math.min(score * 100, 100)}%`,
    background: score >= 0.7 ? "#ef4444" : score >= 0.45 ? "#f59e0b" : "#10b981",
    borderRadius: "5px",
    transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: `0 0 10px ${score >= 0.7 ? 'rgba(239, 68, 68, 0.5)' : score >= 0.45 ? 'rgba(245, 158, 11, 0.5)' : 'rgba(16, 185, 129, 0.5)'}`,
  });

  function showNotification(title, body) {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, { body });
        } else {
          alert(`${title}: ${body}`);
        }
      });
    } else {
      alert(`${title}: ${body}`);
    }
  }

  const handleScan = async () => {
    if (!input.trim()) {
      setResult({ verdict: "⚠️", explanation: t("explanation.safe") });
      setShowResult(true);
      return;
    }

    setScanning(true);
    setResult({ verdict: "⏳", explanation: t("scanner.scanning") || "Scanning..." });
    setShowResult(true);

    const endpoint =
      activeTab === "email"
        ? "http://localhost:8000/v1/scan/email"
        : "http://localhost:8000/v1/scan/invoice";

    const body =
      activeTab === "email"
        ? { email_text: input, lang }
        : { invoice_text: input, lang };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": localStorage.getItem("API_KEY") || "changeme-demo-key",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setResult(data);
      showNotification("Scan Result", `${data.verdict} - ${data.explanation}`);
    } catch (err) {
      console.error(err);
      setResult({ verdict: "ERROR", explanation: "⚠️ Error scanning. Check backend." });
      showNotification("Scan Error", "Could not reach backend.");
    } finally {
      setScanning(false);
    }
  };

  const handleInvoiceFileUpload = async () => {
    if (!selectedFile) {
      setResult({ verdict: "⚠️", explanation: t("scanner.selectFile") || "Select a file first" });
      setShowResult(true);
      return;
    }

    setUploading(true);
    setUploadSuccess(false);
    setResult({ verdict: "⏳", explanation: t("scanner.scanning") || "Scanning file..." });
    setShowResult(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("http://localhost:8000/v1/scan/invoice/upload", {
        method: "POST",
        headers: {
          "x-api-key": localStorage.getItem("API_KEY") || "changeme-demo-key",
        },
        body: formData,
      });

      const data = await res.json();
      setResult(data);
      setUploadSuccess(true);
      showNotification("Scan Result", `${data.verdict} - ${data.explanation}`);
      
      // Hide success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setResult({ verdict: "ERROR", explanation: "⚠️ Error scanning file. Check backend." });
      showNotification("Scan Error", "Could not reach backend.");
    } finally {
      setUploading(false);
    }
  };

  const getLocalizedVerdict = (verdict) => {
    if (!verdict) return "";
    const v = verdict.toLowerCase();
    if (v.includes("safe")) return t("email.safe");
    if (v.includes("susp")) return t("email.suspicious");
    if (v.includes("mal")) return t("email.malicious");
    return verdict;
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && activeTab === "invoice") {
      const file = files[0];
      if (file.type === "application/pdf" ||
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.name.endsWith('.docx') || file.name.endsWith('.pdf')) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`scanner-container ${theme === "dark" ? "dark" : "light"}`}>
      {/* Header */}
      <div className="scanner-header">
        <h1>{t("scanner.title")}</h1>
        <p>
          Analyze emails and invoices for potential threats using AI-powered detection
        </p>
      </div>

      {/* Tabs */}
      <div className="scanner-tabs">
        <button
          className={activeTab === "email" ? "active" : ""}
          onClick={() => setActiveTab("email")}
        >
          📧 {t("scanner.emailTab")}
        </button>
        <button
          className={activeTab === "invoice" ? "active" : ""}
          onClick={() => setActiveTab("invoice")}
        >
          📄 {t("scanner.invoiceTab")}
        </button>
      </div>

      {/* Main Input Card */}
      <div className="scanner-card scanner-card-flat">

        {/* Input Section - Groups textarea and upload area */}
        <div className="scanner-input-section">
          {/* Textarea */}
          <div className={`scanner-textarea-wrapper ${isTextareaFocused || input ? "filled focus" : ""}`}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsTextareaFocused(true)}
              onBlur={() => setIsTextareaFocused(false)}
              className="scanner-textarea"
              aria-label={activeTab === "email" ? t("email.placeholder") : t("invoice.placeholder")}
            />
            <label>
              {activeTab === "email" ? t("email.placeholder") : t("invoice.placeholder")}
            </label>
          </div>

          {/* Invoice File Upload - Drag and Drop Area */}
          {activeTab === "invoice" && (
            <>
              {/* Divider */}
              <div className="scanner-divider">
                <span>OR upload a file</span>
              </div>

              {/* Drag and Drop Upload Area */}
              <div
                className={`scanner-upload-area ${isDragOver ? "dragover" : ""} ${selectedFile ? "has-file" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleUploadClick}
                style={{
                  border: "2px dashed",
                  borderColor: isDragOver ? "#4f46e5" : theme === "dark" ? "#4b5563" : "#cbd5e1",
                  borderRadius: "12px",
                  padding: "40px 20px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: isDragOver 
                    ? (theme === "dark" ? "rgba(79, 70, 229, 0.08)" : "rgba(79, 70, 229, 0.04)")
                    : selectedFile
                    ? (theme === "dark" ? "#2a3f5f" : "#f0f9ff")
                    : "transparent",
                  boxShadow: isDragOver ? `inset 0 0 20px rgba(79, 70, 229, 0.1)` : "none",
                }}
                onMouseEnter={(e) => {
                  if (!uploading) {
                    e.currentTarget.style.borderColor = "#4f46e5";
                    e.currentTarget.style.background = theme === "dark" ? "rgba(79, 70, 229, 0.08)" : "rgba(79, 70, 229, 0.04)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDragOver && !uploading) {
                    e.currentTarget.style.borderColor = theme === "dark" ? "#4b5563" : "#cbd5e1";
                    e.currentTarget.style.background = selectedFile
                      ? (theme === "dark" ? "#2a3f5f" : "#f0f9ff")
                      : "transparent";
                  }
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="scanner-upload-input"
                  style={{ display: "none" }}
                />

                {uploading ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                    {/* Loading Spinner */}
                    <div style={{
                      width: "48px",
                      height: "48px",
                      border: "4px solid",
                      borderColor: theme === "dark" ? "#4b5563" : "#e2e8f0",
                      borderTopColor: "#4f46e5",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}></div>
                    <p style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary-light)",
                      margin: 0,
                    }}>
                      Scanning file...
                    </p>
                    <p style={{
                      fontSize: "13px",
                      color: theme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary-light)",
                      margin: 0,
                    }}>
                      {selectedFile?.name}
                    </p>
                  </div>
                ) : (
                  <div className="scanner-upload-content" style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                  }}>
                    <div style={{
                      fontSize: "48px",
                      lineHeight: "1",
                    }}>
                      {selectedFile ? "✅" : "📤"}
                    </div>

                    {selectedFile ? (
                      <>
                        <p style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary-light)",
                          margin: "0 0 4px 0",
                          wordBreak: "break-word",
                          maxWidth: "100%",
                        }}>
                          {selectedFile.name}
                        </p>
                        <p style={{
                          fontSize: "13px",
                          color: theme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary-light)",
                          margin: "0 0 8px 0",
                        }}>
                          {(selectedFile.size / 1024).toFixed(2)} KB • Click to replace
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                            setUploadSuccess(false);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          style={{
                            background: "transparent",
                            border: "1px solid #ef4444",
                            color: "#ef4444",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = "#fee2e2";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = "transparent";
                          }}
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <>
                        <p style={{
                          fontSize: "16px",
                          fontWeight: "700",
                          color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary-light)",
                          margin: "0 0 4px 0",
                        }}>
                          Drag & Drop or Click to Upload
                        </p>
                        <p style={{
                          fontSize: "13px",
                          color: theme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary-light)",
                          margin: 0,
                        }}>
                          PDF, DOCX files supported (Max 10 MB)
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Success Message */}
              {uploadSuccess && (
                <div style={{
                  marginTop: "16px",
                  padding: "12px 16px",
                  background: "#dcfce7",
                  border: "1px solid #86efac",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  animation: "slideInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}>
                  <span style={{ fontSize: "18px" }}>✅</span>
                  <span style={{
                    color: "#166534",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}>
                    File uploaded and scanned successfully!
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Button Row - Responsive layout */}
        <div className="scanner-button-row" style={{
          display: "flex",
          gap: "12px",
          marginTop: "20px",
          flexWrap: "wrap",
        }}>
          {activeTab === "invoice" && selectedFile && (
            <button
              onClick={handleInvoiceFileUpload}
              disabled={uploading}
              style={{
                flex: 1,
                minWidth: "140px",
                padding: "12px 24px",
                background: uploading
                  ? "linear-gradient(135deg, #cbd5e1, #94a3b8)"
                  : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: uploading ? "not-allowed" : "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                opacity: uploading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                if (!uploading) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 20px rgba(16, 185, 129, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (!uploading) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }
              }}
            >
              <span style={{ fontSize: "16px" }}>
                {uploading ? "🔄" : "📎"}
              </span>
              {uploading ? "Uploading..." : "Scan File"}
            </button>
          )}

          <button
            onClick={handleScan}
            disabled={scanning}
            style={{
              flex: 1,
              minWidth: "140px",
              padding: "12px 24px",
              background: scanning
                ? "linear-gradient(135deg, #cbd5e1, #94a3b8)"
                : "linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: scanning ? "not-allowed" : "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              opacity: scanning ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              if (!scanning) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 20px rgba(79, 70, 229, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!scanning) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }
            }}
          >
            <span style={{ fontSize: "16px" }}>
              {scanning ? "🔄" : "🔍"}
            </span>
            {scanning
              ? "Scanning..."
              : activeTab === "email"
                ? t("email.scan")
                : t("invoice.scanText")
            }
          </button>
        </div>
      </div>

      {/* Results Card */}
      {result && showResult && (
        <div className={`scanner-result-card ${showResult ? "active" : ""}`}>
          {theme === "dark" && <div className="card-glow"></div>}
          <div className="result-header"> 
            <span style={getVerdictBadgeStyle(result.verdict)}>
              {result.verdict === "⏳" ? "⏳" : "🛡️"}
              {getLocalizedVerdict(result.verdict)}
            </span>
            {result.score !== undefined && result.score !== null && (
              <div style={{
                fontSize: "16px",
                color: theme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary-light)",
                fontWeight: "500"
              }}>
                Risk Score: {(result.score * 100).toFixed(1)}%
              </div>
            )}
          </div>

          {result.score !== undefined && result.score !== null && (
            <div style={progressBarStyle(result.score)}>
              <div style={progressFillStyle(result.score)}></div>
            </div>
          )}

          <div style={{
            color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary-light)",
            lineHeight: "1.7",
            fontSize: "16px",
          }}>
            <strong style={{
              color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary-light)",
              fontWeight: "600"
            }}>
              Analysis:
            </strong>
            <div style={{
              marginTop: "12px",
              whiteSpace: "pre-line",
              color: theme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary-light)",
            }}>
              {typeof result.explanation === "object" && result.explanation !== null
                ? result.explanation[localStorage.getItem("LANG") || "en"] || result.explanation["en"] || ""
                : result.explanation
              }
            </div>
          </div>

          {/* Scanned Content Preview with Highlighted Keywords */}
          {input && (
            <div style={{
              marginTop: "24px",
              borderTop: `1px solid ${theme === "dark" ? "var(--border-dark)" : "var(--border-light)"}`,
              paddingTop: "24px",
            }}>
              <strong style={{
                color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary-light)",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}>
                📋 Scanned Content
                {countSuspiciousKeywords(input) > 0 && (
                  <span style={{
                    background: "#ff6b6b",
                    color: "#ffffff",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}>
                    {countSuspiciousKeywords(input)} risk keywords found
                  </span>
                )}
              </strong>

              {/* Warning Banner if suspicious keywords found */}
              {countSuspiciousKeywords(input) > 0 && (
                <div style={{
                  background: "#fee2e2",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  padding: "12px",
                  marginBottom: "12px",
                  color: "#991b1b",
                  fontSize: "13px",
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: "16px", marginTop: "2px" }}>⚠️</span>
                  <div>
                    <strong>Suspicious keywords detected:</strong>
                    <div style={{ marginTop: "4px", fontSize: "12px" }}>
                      {getSuspiciousKeywordsFound(input).slice(0, 5).join(", ")}
                      {getSuspiciousKeywordsFound(input).length > 5 && ` +${getSuspiciousKeywordsFound(input).length - 5} more`}
                    </div>
                  </div>
                </div>
              )}

              {/* Content with highlighted keywords */}
              <div style={{
                background: theme === "dark" ? "#374151" : "#f9fafb",
                border: `1px solid ${theme === "dark" ? "var(--border-dark)" : "var(--border-light)"}`,
                borderRadius: "8px",
                padding: "16px",
                fontSize: "14px",
                lineHeight: "1.8",
                color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary-light)",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
                maxHeight: "300px",
                overflowY: "auto",
                fontFamily: '"Fira Code", "Courier New", monospace',
              }}>
                {highlightSuspiciousKeywords(input.substring(0, 1000))}
                {input.length > 1000 && (
                  <div style={{
                    marginTop: "12px",
                    fontSize: "12px",
                    color: theme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary-light)",
                    fontStyle: "italic",
                  }}>
                    ... ({input.length - 1000} more characters)
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Download Report Button */}
          <button
            onClick={() => generateScanReport(result, activeTab, input || selectedFile?.name)}
            style={{
              marginTop: "24px",
              padding: "12px 24px",
              background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              width: "100%",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 20px rgba(79, 70, 229, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            📥 Download Report
          </button>
        </div>
      )}
    </div>
  );
}

export default Scanner;
