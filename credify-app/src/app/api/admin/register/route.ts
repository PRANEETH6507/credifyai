import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "credifyai_super_secret_session_key_2026";
const UNIVERSITY_API_KEY = process.env.UNIVERSITY_API_KEY || "UNIVERSITY_API_KEY";

function verifyToken(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const [header, data, signature] = parts;
    
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${data}`)
      .digest("base64url");
      
    if (signature !== expectedSignature) return false;
    
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
    if (payload.exp < Date.now()) return false;
    
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("credify_admin_token")?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { roll_number, name, program, semester, sgpa, issue_date } = body;

    if (!roll_number || !name || !program || !semester || sgpa === undefined || !issue_date) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Resolve base n8n webhook URL from environment variables dynamically
    const webhookUrl = process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook/credifyai-verify";
    const baseUrl = new URL(webhookUrl).origin;
    const registrationUrl = `${baseUrl}/webhook/register-student-record`;

    const n8nRes = await fetch(registrationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${UNIVERSITY_API_KEY}`
      },
      body: JSON.stringify({
        roll_number,
        name,
        program,
        semester,
        sgpa,
        issue_date
      })
    });

    if (!n8nRes.ok) {
      const errorText = await n8nRes.text();
      return NextResponse.json({ success: false, message: `n8n Webhook Error: ${errorText}` }, { status: n8nRes.status });
    }

    const result = await n8nRes.json();
    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
