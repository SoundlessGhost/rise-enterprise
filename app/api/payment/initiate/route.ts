// app/api/payment/initiate/route.ts

import { shurjopay } from "@/lib/shurjopay";
import { PrismaClient } from "@prisma/client";
import type { PaymentRequest } from "@/lib/shurjopay";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      amount,
      address,
      fullName,
      enterprise,
      sponsorName,
      sponsorPhone,
      mobileNumber,
    } = body;

    // ✅ FIRSTLY DATABASE এ REGISTRATION SAVE
    const registration = await prisma.registration.create({
      data: {
        email,
        amount,
        address,
        fullName,
        enterprise,
        sponsorName,
        sponsorPhone,
        mobileNumber,
        paymentStatus: "PENDING",
      },
    });

    console.log("✅ REGISTRATION SAVED TO DATABASE:", registration.id);

    // PAYMENT INITIATE
    const paymentRequest: PaymentRequest = {
      currency: "BDT",
      customer_city: "Bangladesh",
      customer_address: address,
      customer_name: fullName,
      customer_phone: mobileNumber,
      order_id: registration.id,
      amount: parseFloat(body.amount),
      customer_email: email,
      customer_state: "",
      customer_postcode: "",
      // option: "",
    };

    const response = await shurjopay.makePayment(paymentRequest);

    if (response.checkout_url) {
      // TRANSACTION ID UPDATE
      await prisma.registration.update({
        where: { id: registration.id },
        data: { transactionId: response.sp_order_id },
      });

      return NextResponse.json({
        success: true,
        data: response,
      });
    }

    throw new Error("Failed to initiate payment");
  } catch (error) {
    console.error("Payment initiation error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Payment initiation failed",
      },
      { status: 500 }
    );
  }
}
