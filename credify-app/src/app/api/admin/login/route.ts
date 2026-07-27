import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "credifyai_super_secret_session_key_2026";

function signToken(payload: object): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${data}`)
    .digest("base64url");
  return `${header}.${data}.${signature}`;
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    
    const expectedUsername = process.env.ADMIN_USERNAME || "admin";
    const expectedPassword = process.env.ADMIN_PASSWORD || "admin@credifyai";
    
    if (username !== expectedUsername || password !== expectedPassword) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }
    
    const token = signToken({ role: "admin", exp: Date.now() + 24 * 60 * 60 * 1000 });
    
    const response = NextResponse.json({ success: true, message: "Login successful" });
    response.cookies.set("credify_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });
    
    return response;
  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
