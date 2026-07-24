import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const n8nUrl = process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook/credifyai-verify";

    const response = await fetch(n8nUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Bypass-Tunnel-Reminder": "true",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Verification engine returned status ${response.status}` },
        { status: response.status }
      );
    }

    const text = await response.text();
    if (!text) {
      return NextResponse.json({
        success: false,
        verification_status: "fake",
        confidence: 0,
        reason: "Invalid Certificate File or URL",
        message: "The verification engine was unable to download or process the certificate file. Make sure the link is a direct public URL to a PDF/image."
      });
    }

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch (e) {
      return NextResponse.json({
        success: false,
        verification_status: "fake",
        confidence: 0,
        reason: "Invalid JSON from verification engine",
        message: text
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("Error proxying verification request:", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
