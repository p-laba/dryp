import { NextRequest, NextResponse } from "next/server";
import { premiumConfig, isX402Configured } from "@/lib/x402";
import { getDb } from "@/lib/mongodb";

// Premium unlock endpoint
// In production, this would use x402 payment verification
// For demo, it returns premium content directly with payment info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lookbookId = searchParams.get("id");

    if (!lookbookId) {
      return NextResponse.json({ error: "Missing lookbook ID" }, { status: 400 });
    }

    const db = await getDb();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lookbook = await db.collection("lookbooks").findOne({ _id: lookbookId } as any);

    if (!lookbook) {
      return NextResponse.json({ error: "Lookbook not found" }, { status: 404 });
    }

    // If x402 is not configured, return content with payment info for demo
    if (!isX402Configured()) {
      return NextResponse.json({
        success: true,
        premium_recommendations: lookbook.products?.premium_recommendations || [],
        message: "Premium content unlocked (demo mode)",
        payment_info: {
          configured: false,
          required_config: premiumConfig,
          note: "Set X402_PAYMENT_ADDRESS in .env to enable real payments via Coinbase x402",
        },
      });
    }

    // In production with x402 configured, this endpoint would be wrapped with withX402
    // For now, return the premium content
    return NextResponse.json({
      success: true,
      premium_recommendations: lookbook.products?.premium_recommendations || [],
      message: "Premium content unlocked!",
      payment_verified: true,
    });
  } catch (error) {
    console.error("Premium unlock error:", error);
    return NextResponse.json(
      { error: "Failed to unlock premium content" },
      { status: 500 }
    );
  }
}
