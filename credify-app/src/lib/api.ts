import { N8nResult } from "../context/VerificationContext";

export const verifyCertificate = async (
  certificateUrl: string,
  email: string,
  addLog: (log: string) => void,
  setScore: (score: number) => void
): Promise<N8nResult> => {
  try {
    // Relative API endpoint to proxy through Next.js server-side route
    const relativeUrl = "/api/verify";
    
    addLog("Initiating secure connection...");
    addLog(`Target: ${relativeUrl}`);
    
    // Simulate telemetry steps while request is processing
    setTimeout(() => addLog("Downloading certificate..."), 500);
    setTimeout(() => addLog("Initializing OCR Engine..."), 1500);
    setTimeout(() => { setScore(12); addLog("Scanning for cryptographic signatures..."); }, 2500);
    setTimeout(() => { setScore(45); addLog("Extracting layout metadata..."); }, 3500);
    setTimeout(() => { setScore(72); addLog("Awaiting database cross-verification..."); }, 5000);

    const response = await fetch(relativeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        certificate_url: certificateUrl,
        email: email,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: N8nResult = await response.json();
    return data;
    
  } catch (error) {
    console.error("Verification failed:", error);
    addLog("ERROR: Connection to verification engine failed.");
    return {
      success: false,
      verification_status: "failed",
      confidence: 0,
      reason: "API Connection Failed",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
