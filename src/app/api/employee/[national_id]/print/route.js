import { jsPDF } from "jspdf";
import { NextResponse } from 'next/server';

export async function GET() {
  // Create a new jsPDF instance
  const doc = new jsPDF();

  // Set up text and formatting
  doc.setFontSize(16);
  doc.text("Hello from jsPDF on Node.js!", 10, 10);

  // Generate the PDF as a buffer
  const pdfData = doc.output("arraybuffer");

  // Create a Response with the PDF data
  return new NextResponse(Buffer.from(pdfData), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=generated.pdf",
    },
  });
}
