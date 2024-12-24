import { jsPDF } from "jspdf";
import { NextResponse } from "next/server";

// Helper function to fetch and convert an image to base64 using Buffer
async function getBase64ImageFromUrl(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

// This function handles the PDF generation for a specific employee
export async function GET(req, context) {
  const { params } = context;
  const { id } = params;

  // Fetch data from the main employee endpoint
  const employeeResponse = await fetch(`http://localhost:3000/api/employee/${id}`);
  if (!employeeResponse.ok) {
    return new Response("Employee not found", { status: 404 });
  }
  const employeeData = await employeeResponse.json();

  // Fetch operational costs and average costs
  const operationalResponse = await fetch(`http://localhost:3000/api/employee/opCosts?userId=${id}`);
  if (!operationalResponse.ok) {
    return new Response("Operational costs not found", { status: 404 });
  }
  const operationalData = await operationalResponse.json();

  // Create a new jsPDF instance
  const doc = new jsPDF("p", "in", "a4");

  const pageWidth = 8.27;
  const pageHeight = 11.69;  
  
  const logoBase64 = await getBase64ImageFromUrl("http://localhost:3000/images/logo.png");
  const watermarkBase64 = await getBase64ImageFromUrl("http://localhost:3000/images/watermark.png");
  const employeeImageBase64 = await getBase64ImageFromUrl(employeeData.photo || "http://localhost:3000/images/placeholder.webp");

  const logoWidth = 5; // Width of the watermark (in inches)
  const logoHeight = 4; // Height of the watermark (in inches)
  const logoX = (pageWidth - logoWidth) / 2; // Center the watermark horizontally
  const logoY = (pageHeight - logoHeight) / 2; // Center the watermark vertically

  // Add the watermark logo with transparency (very faint)
  doc.addImage(watermarkBase64, "PNG", logoX, logoY, logoWidth, logoHeight, "", "SLOW");

  // Fetch the logo and employee images as base64


  doc.setLineWidth(1 / 72);

  // Margin of 3mm, converted to inches (3mm = 0.1181in)
  const margin = 3 / 25.4;  // 3mm = 0.1181 inches

  // Adjusted positions for the lines
  const left = margin;
  const right = pageWidth - margin;
  const top = margin;
  const bottom = pageHeight - margin;

  // Set line width
  doc.setLineWidth(1 / 72);

  // Draw the lines with the adjusted coordinates
  doc.line(left, top, left, bottom);  // Left vertical line
  doc.line(right, top, right, bottom); // Right vertical line
  doc.line(left, top, right, top);  // Top horizontal line
  doc.line(left, bottom, right, bottom);  // Bottom horizontal line

  doc.line(left, 3, right, 3);  // Top horizontal line
  doc.line(left, 8, right, 8);
  doc.line(left, 8.1, right, 8.1);
  doc.line(left, 10, right, 10);
  doc.line(left, 10.1, right, 10.1);
  

  // Add logo to the PDF at the top-left corner, 100x100 pixels (converted to inches: 100px = 1.0417in, 100px = 1.0417in)
  doc.addImage(logoBase64, "PNG", 0.3937, 0.3937, 1.5748, 1.1811);  // (10mm = 0.3937in, 40mm = 1.5748in, etc.)
  
  // Add employee image to the PDF at the top-right corner, 200x200 pixels (converted to inches: 200px = 2.0833in)
  doc.addImage(employeeImageBase64, "PNG", 5.3150, 0.3937, 2.3622, 2.3622);  // (135mm = 5.315in, 60mm = 2.3622in, etc.)
  
  doc.setFontSize(10);
  const addressY = 0.3937 + 1.1811 + 0.7;  // Logo Y position + logo height + 0.9-inch margin

  // Add "Tinted Giant Investments" and address with spacing between lines
  const lineHeight = 0.2; // Define the margin between lines of text (0.2 inches)
  
  doc.text("Tinted Giant Investments", 0.3937, addressY);
  doc.text("2936 Dulibadzimu, Beitbridge", 0.3937, addressY + lineHeight);
  doc.text("Zimbabwe", 0.3937, addressY + 2 * lineHeight); // Further adjust Y-coordinate

  // Populate PDF with employee information
  doc.setFontSize(12);
  doc.text(`Employee ID: ${employeeData.nationalID}`, 0.3937, 3.7244); // (10mm = 0.3937in, 120mm = 4.7244in)
  doc.text(`Name: ${employeeData.name}`, 0.3937, 4.1181); // (130mm = 5.1181in)
  doc.text(`Position: ${employeeData.occupation}`, 0.3937, 4.5118); // (140mm = 5.5118in)

  doc.text(`Age: ${employeeData.age}`, 0.3937, 4.9055); // (150mm = 5.9055in)
  doc.text(`Gender: ${employeeData.gender}`, 0.3937, 5.2980); // (160mm = 6.2980in)
  doc.text(`Nationality: ${employeeData.nationality}`, 0.3937, 5.6906); // (170mm = 6.6906in)
  doc.text(`Passport No: ${employeeData.passportNumber}`, 0.3937, 6.0831); // (180mm = 7.0831in)
  doc.text(`Km Travelled: ${operationalData.totalKmTravelled}`, 0.3937, 6.4756); // (190mm = 7.4756in)
  doc.text(`Average Km Travelled: ${operationalData.avgKmTravelled}`, 0.3937, 6.8681); // (200mm = 7.8681in)
  doc.text(`Journeys: ${operationalData.totalJourneys}`, 0.3937, 7.2606); // (210mm = 8.2606in)

  // Display Operational Costs
  let y = 8.5; // Start at y = 3 inches
  doc.setFontSize(12);
  doc.text("Operational Costs:", 0.3937, y);
  operationalData?.totalExpenses?.forEach((expense, index) => {
    doc.text(
      `${expense.currency}: ${expense.operation_costs}`,
      1.5,
      y + 0.3 + index * 0.2
    );
  });

  y += 1; // Move to next section

  // Average Operational Costs
  doc.text("Average Operational Costs:", 0.3937, y);
  operationalData?.averageOperationalCosts?.forEach((expense, index) => {
    doc.text(
      `${expense.currency}: ${expense.avg_operational_costs}`,
      1.5,
      y + 0.3 + index * 0.2
    );
  });



  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString();

  doc.setFontSize(10); // Set smaller font size for the footer
  const footerY = pageHeight - margin; // Position it near the bottom, within the margin
  doc.text(`Printed on: ${formattedDate}`, margin+0.2, footerY-0.2);

 
    

  // Generate the PDF as a buffer
  const pdfData = doc.output("arraybuffer");

  // Return the PDF as a downloadable response
  return new NextResponse(Buffer.from(pdfData), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=employee_${id}_details.pdf`,
    },
  });
}
