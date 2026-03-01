// /app/api/submit/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    // URL of your active n8n workflow webhook
    const webhookUrl = "https://amanguleria.app.n8n.cloud/webhook-test/8c71c168-2515-4262-9a61-b2fc2e66ae35";

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();

    // n8n webhook returns: { answer: "..." }
    return NextResponse.json({ answer: data.answer });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ answer: "Error: could not get response" });
  }
}