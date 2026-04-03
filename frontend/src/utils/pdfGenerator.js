import jsPDF from "jspdf";
import { countSuspiciousKeywords, getSuspiciousKeywordsFound } from "./keywordHighlighter";

export const generateScanReport = (result, scanType, input) => {
  // Create PDF
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Set default font
  pdf.setFont("helvetica");

  // Add background color to header
  pdf.setFillColor(79, 70, 229); // Purple
  pdf.rect(0, 0, pageWidth, 50, "F");

  // White text for header
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.text("CyberSaarthi", margin, 20);
  
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text("Threat Detection Report", margin, 32);

  yPosition = 60;

  // Date and Time
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(10);
  pdf.text(`Report Generated: ${dateStr} at ${timeStr}`, margin, yPosition);
  yPosition += 12;

  // Divider
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;

  // Scan Information Section
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Scan Information", margin, yPosition);
  yPosition += 10;

  // Scan Type
  const scanTypeLabel = scanType === "email" ? "Email Scan" : "Invoice Scan";
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor(60, 60, 60);
  pdf.text(`Type: ${scanTypeLabel}`, margin, yPosition);
  yPosition += 10;

  // Verdict Section
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Verdict", margin, yPosition);
  yPosition += 10;

  // Color code verdict
  let verdictColor = [16, 185, 129]; // Green for safe
  let verdictText = "Safe";

  if (result.verdict && result.verdict.toLowerCase().includes("malicious")) {
    verdictColor = [239, 68, 68]; // Red
    verdictText = "Malicious";
  } else if (result.verdict && result.verdict.toLowerCase().includes("suspicious")) {
    verdictColor = [245, 158, 11]; // Orange
    verdictText = "Suspicious";
  }

  // Verdict box with color
  const verdictBoxHeight = 12;
  pdf.setFillColor(...verdictColor);
  pdf.rect(margin, yPosition - 5, contentWidth, verdictBoxHeight, "F");
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text(verdictText, margin + 5, yPosition + 2);
  
  yPosition += 15;

  // Risk Score
  if (result.score !== undefined && result.score !== null) {
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(60, 60, 60);
    pdf.setFontSize(11);
    
    const riskPercentage = (result.score * 100).toFixed(1);
    pdf.text(`Risk Score: ${riskPercentage}%`, margin, yPosition);
    yPosition += 8;
    
    // Draw risk score bar
    const barWidth = 60;
    const barHeight = 3;
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(margin, yPosition, barWidth, barHeight);
    
    // Fill based on risk
    let fillColor = [16, 185, 129]; // Green
    if (result.score >= 0.7) {
      fillColor = [239, 68, 68]; // Red
    } else if (result.score >= 0.45) {
      fillColor = [245, 158, 11]; // Orange
    }
    
    pdf.setFillColor(...fillColor);
    const fillWidth = Math.max(result.score * barWidth, 2);
    pdf.rect(margin, yPosition, fillWidth, barHeight, "F");
    
    yPosition += 12;
  }

  // Analysis/Explanation
  if (yPosition > pageHeight - 60) {
    pdf.addPage();
    yPosition = margin;
  }

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Analysis", margin, yPosition);
  yPosition += 10;

  const explanation = typeof result.explanation === "string" 
    ? result.explanation 
    : result.explanation?.en || result.explanation?.hi || "No explanation available";

  // Convert explanation to lines
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(80, 80, 80);

  const explainLines = pdf.splitTextToSize(explanation, contentWidth - 5);
  
  explainLines.slice(0, 15).forEach((line) => {
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = margin;
    }
    pdf.text(line, margin + 2, yPosition);
    yPosition += 6;
  });

  // Input Preview
  if (input && input.trim()) {
    yPosition += 5;
    
    if (yPosition > pageHeight - 50) {
      pdf.addPage();
      yPosition = margin;
    }

    // Add suspicious keywords section if found
    const suspiciousCount = countSuspiciousKeywords(typeof input === "string" ? input : "");
    if (suspiciousCount > 0) {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(200, 0, 0); // Red for warning
      pdf.text("⚠️ Suspicious Keywords Detected", margin, yPosition);
      yPosition += 8;

      const suspiciousKeywords = getSuspiciousKeywordsFound(typeof input === "string" ? input : "");
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      
      const keywordsText = `Found ${suspiciousCount} occurrence(s) of: ${suspiciousKeywords.join(", ")}`;
      const keywordsLines = pdf.splitTextToSize(keywordsText, contentWidth - 2);
      
      keywordsLines.forEach((line) => {
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin + 2, yPosition);
        yPosition += 5;
      });

      yPosition += 3;
    }

    if (yPosition > pageHeight - 50) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Scanned Content Preview", margin, yPosition);
    yPosition += 8;

    // Show preview text - increased to 2000 chars to capture large invoices
    const previewText = typeof input === "string" 
      ? input.substring(0, 2000)
      : "File uploaded";
    
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    
    const previewLines = pdf.splitTextToSize(previewText, contentWidth - 2);
    previewLines.slice(0, 30).forEach((line) => {
      if (yPosition > pageHeight - 15) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin + 2, yPosition);
      yPosition += 4;
    });
  }

  // Footer
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.setFont("helvetica", "normal");
    pdf.text("CyberSaarthi - AI-Powered Threat Detection", margin, pageHeight - 8);
    pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, pageHeight - 8);
  }

  // Generate filename
  const now2 = new Date();
  const dateFormatted = now2.toISOString().split("T")[0]; // YYYY-MM-DD
  const filename = `report_${dateFormatted}.pdf`;

  // Download
  pdf.save(filename);
};
