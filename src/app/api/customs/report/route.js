import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { connectToDatabase } from '@/utils/mongo';

export async function GET(req, context) {
    try {
        const { db } = await connectToDatabase();

        // Parse the query parameters
        const { searchParams } = new URL(req.url);
        const fromDate = searchParams.get('from');
        const toDate = searchParams.get('to');

        // Validate the date range
        if (!fromDate || !toDate) {
            return NextResponse.json(
                { error: "Both 'from' and 'to' date parameters are required" },
                { status: 400 }
            );
        }

        const from = new Date(fromDate);
        const to = new Date(toDate);

        // Ensure the "to" date includes the entire day
        to.setHours(23, 59, 59, 999);

        // Check for invalid date formats
        if (isNaN(from) || isNaN(to)) {
            return NextResponse.json(
                { error: "Invalid date format. Please use 'YYYY-MM-DD'" },
                { status: 400 }
            );
        }

        // Query the database with the date range using createdAt
        const data = await db
            .collection("customs")
            .find({
                createdAt: {
                    $gte: from,
                    $lte: to,
                },
            })
            .toArray();

        if (!data || data.length === 0) {
            return NextResponse.json(
                { error: "No data found for the given date range" },
                { status: 404 }
            );
        }

        // Get the current date for file naming
        const currentDate = new Date();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthIndex = currentDate.getMonth();
        const monthName = monthNames[monthIndex];
        const day = currentDate.getDate();
        const year = currentDate.getFullYear();
        const formattedDate = `${day}/${monthName}/${year}`;

        // Create a new Excel workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Customs Data');

        // Add columns
        worksheet.columns = [
            { header: 'Date', key: 'date', width: 20 },
            { header: 'Reference', key: 'reference', width: 20 },
            { header: 'Transporter', key: 'transporter', width: 25 },
            { header: 'Exporter', key: 'exporter', width: 25 },
            { header: 'Importer', key: 'importer', width: 15 },
            { header: 'Trailer Plate', key: 'trailerPlate', width: 20 },
            { header: 'Cargo', key: 'cargo', width: 30 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'BOE', key: 'BOE', width: 15 },
            { header: 'Horse Plate', key: 'horse_plate', width: 20 },
            { header: 'Trailer Plate (Numeric)', key: 'trailer_plate', width: 25 },
            { header: 'Invoice', key: 'invoice', width: 15 },
            { header: 'Invoice Photo', key: 'invoice_photo', width: 20 },
            {
                header: 'Duty',
                key: 'duty',
                width: 15,
                style: { numFmt: '"$"#,##0.00' }, // Apply US dollar format
            },
        ];

        // Style header row
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // White text
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF000000' }, // Black background
            };
        });

        // Add rows dynamically from the data object
        data.forEach((record) => {
            const row = {};
            worksheet.columns.forEach((col) => {
                row[col.key] = record[col.key] || ''; // Match column key with record field
            });
            worksheet.addRow(row);
        });

        // Write the workbook to a buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Return the Excel file as a response
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename=Customs_Clearance_${fromDate}_to_${toDate}.xlsx`,
            },
        });
    } catch (error) {
        console.error("Error generating Excel:", error);
        return NextResponse.json({ error: "Failed to generate Excel file" }, { status: 500 });
    }
}
