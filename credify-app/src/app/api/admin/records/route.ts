import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "credifyai_super_secret_session_key_2026";
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

export const dynamic = "force-dynamic";

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

interface DBStudent {
  roll_number: string;
  name: string;
  program: string;
  semester: string;
  sgpa: number;
  issue_date: string;
}

interface DBVerification {
  id: number;
  roll_number: string;
  status: string;
  confidence: number;
  reason: string;
  verified_at: string;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("credify_admin_token")?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json({ success: false, message: "Database configuration is missing" }, { status: 500 });
    }

    const [studentsRes, verificationsRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/student_records?order=roll_number.asc`, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        },
        next: { revalidate: 0 } // Disable caching to fetch real-time logs
      }),
      fetch(`${SUPABASE_URL}/rest/v1/verifications?order=verified_at.desc`, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        },
        next: { revalidate: 0 }
      })
    ]);

    if (!studentsRes.ok || !verificationsRes.ok) {
      return NextResponse.json({ success: false, message: "Failed to fetch registry data" }, { status: 500 });
    }

    const students: DBStudent[] = await studentsRes.json();
    const verifications: DBVerification[] = await verificationsRes.json();

    const aggregated = students.map((student: DBStudent) => {
      const studentVerifications = verifications.filter(
        (v: DBVerification) => String(v.roll_number) === String(student.roll_number)
      );
      
      const lastVer = studentVerifications[0] || null;
      
      return {
        ...student,
        verification_count: studentVerifications.length,
        last_verification_status: lastVer ? lastVer.status : "unchecked",
        last_verification_date: lastVer ? lastVer.verified_at : null,
        verification_history: studentVerifications
      };
    });

    return NextResponse.json(
      { success: true, records: aggregated, all_verifications: verifications },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      }
    );
  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("credify_admin_token")?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json({ success: false, message: "Database configuration is missing" }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const roll_number = searchParams.get("roll_number");

    if (!roll_number) {
      return NextResponse.json({ success: false, message: "Missing roll number" }, { status: 400 });
    }

    // 1. Delete matching verification logs first to avoid foreign key constraint violations
    await fetch(`${SUPABASE_URL}/rest/v1/verifications?roll_number=eq.${roll_number}`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    // 2. Delete student record
    const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/student_records?roll_number=eq.${roll_number}`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!dbRes.ok) {
      const errorText = await dbRes.text();
      return NextResponse.json({ success: false, message: `Database error: ${errorText}` }, { status: dbRes.status });
    }

    return NextResponse.json({ success: true, message: "Student record and associated logs removed successfully" });
  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
