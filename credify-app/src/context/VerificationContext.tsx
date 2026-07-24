"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type VerificationStatus = "idle" | "scanning" | "verified" | "fake" | "unclear" | "failed";

export interface N8nResult {
  success?: boolean;
  verification_status?: VerificationStatus;
  confidence?: number;
  reason?: string;
  student_name?: string;
  roll_number?: string;
  message?: string;
}

interface VerificationContextProps {
  status: VerificationStatus;
  setStatus: (status: VerificationStatus) => void;
  telemetryLogs: string[];
  setTelemetryLogs: React.Dispatch<React.SetStateAction<string[]>>;
  addLog: (log: string) => void;
  score: number;
  setScore: (score: number) => void;
  result: N8nResult | null;
  setResult: (result: N8nResult | null) => void;
}

const VerificationContext = createContext<VerificationContextProps | undefined>(undefined);

export const VerificationProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<VerificationStatus>("idle");
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>(["Awaiting document..."]);
  const [score, setScore] = useState<number>(0);
  const [result, setResult] = useState<N8nResult | null>(null);

  const addLog = (log: string) => {
    setTelemetryLogs((prev) => [...prev, log].slice(-5)); // Keep last 5 logs
  };

  return (
    <VerificationContext.Provider
      value={{
        status,
        setStatus,
        telemetryLogs,
        setTelemetryLogs,
        addLog,
        score,
        setScore,
        result,
        setResult,
      }}
    >
      {children}
    </VerificationContext.Provider>
  );
};

export const useVerification = () => {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error("useVerification must be used within a VerificationProvider");
  }
  return context;
};
