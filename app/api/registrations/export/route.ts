// app/api/registrations/export/route.ts

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("📥 CSV Export request received");

    // ✅ Database theke sob registration fetch koro
    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
    });

    console.log(`📊 Found ${registrations.length} registrations`);

    if (registrations.length === 0) {
      return NextResponse.json(
        { success: false, error: "No registrations found" },
        { status: 404 }
      );
    }

    // ✅ CSV Headers define koro
    const headers = [
      "Id",
      "Full Name",
      "Email",
      "Mobile Number",
      "Participation Type",
      "Total Participants",
      "Adults",
      "Children",
      "Infants",
      "Amount",
      "Payment Status",
      "Transaction ID",
      "Created At",
    ];

    // ✅ CSV Rows create koro
    const rows = registrations.map((reg) => [
      reg.id,
      reg.fullName,
      reg.email || "",
      reg.mobileNumber,
      reg.participationType,
      reg.totalParticipants,
      reg.adults,
      reg.children,
      reg.infants,
      reg.amount,
      reg.paymentStatus,
      reg.transactionId || "",
      reg.createdAt.toISOString(),
    ]);

    // ✅ CSV content build koro
    const csvContent = [
      headers.join(","), // Header row
      ...rows.map((row) =>
        row
          .map((cell) => {
            // Handle cells with commas or quotes
            const cellStr = String(cell);
            if (cellStr.includes(",") || cellStr.includes('"')) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          })
          .join(",")
      ),
    ].join("\n");

    console.log("✅ CSV generated successfully");

    // ✅ CSV file hisebe download pathao
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="registrations_${
          new Date().toISOString().split("T")[0]
        }.csv"`,
      },
    });
  } catch (error) {
    console.error("❌ CSV Export Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Export failed",
      },
      { status: 500 }
    );
  }
}
