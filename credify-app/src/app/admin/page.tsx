"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, 
  Plus, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Database,
  Users,
  Activity,
  X,
  FileText,
  TrendingUp,
  Trash2
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";

interface VerificationLog {
  id: number;
  status: string;
  confidence: number;
  reason: string;
  verified_at: string;
}

interface StudentRecord {
  roll_number: string;
  name: string;
  program: string;
  semester: string;
  sgpa: number;
  issue_date: string;
  verification_count: number;
  last_verification_status: string;
  last_verification_date: string | null;
  verification_history: VerificationLog[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [records, setRecords] = useState<StudentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Detail Logs Modal State
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);

  // Form State
  const [rollNumber, setRollNumber] = useState("");
  const [name, setName] = useState("");
  const [program, setProgram] = useState("B.Tech CSE");
  const [semester, setSemester] = useState("1-1");
  const [sgpa, setSgpa] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  const fetchRecords = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/records?t=${Date.now()}`);
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setRecords(data.records);
      }
    } catch (err) {
      console.error("Failed to fetch registry records", err);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchRecords();
    
    // Auto-refresh stats every 10 seconds for real-time tracking
    const interval = setInterval(fetchRecords, 10000);
    return () => clearInterval(interval);
  }, [fetchRecords]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      console.error("Logout failed");
    }
  };

  const handleDeleteStudent = async (rollNumber: string) => {
    if (!confirm(`Are you sure you want to permanently delete student record for Roll Number: ${rollNumber}? This will also wipe all associated verification logs.`)) {
      return;
    }
    
    try {
      const res = await fetch(`/api/admin/records?roll_number=${rollNumber}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        // Refresh records list
        fetchRecords();
      } else {
        alert(data.message || "Failed to delete student record.");
      }
    } catch {
      alert("Error communicating with server.");
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess(false);

    // Roll number validation (12 digits)
    if (!/^\d{12}$/.test(rollNumber)) {
      setFormError("Roll number must be exactly 12 digits.");
      return;
    }

    // SGPA validation
    const numSgpa = parseFloat(sgpa);
    if (isNaN(numSgpa) || numSgpa < 0 || numSgpa > 10) {
      setFormError("SGPA must be a decimal number between 0.0 and 10.0.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roll_number: rollNumber,
          name: name.trim().toUpperCase(),
          program,
          semester,
          sgpa: numSgpa,
          issue_date: issueDate,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFormSuccess(true);
        // Clear fields
        setRollNumber("");
        setName("");
        setSgpa("");
        
        // Refresh grid
        fetchRecords();
        
        // Wait 1.5s then close slide-over
        setTimeout(() => {
          setShowAddModal(false);
          setFormSuccess(false);
        }, 1500);
      } else {
        setFormError(data.message || "Failed to register student record.");
      }
    } catch {
      setFormError("Communication error with registry webhook.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Aggregated Stats
  const totalStudents = records.length;
  const totalVerifications = records.reduce((acc, r) => acc + r.verification_count, 0);
  const totalFraud = records.reduce((acc, r) => acc + r.verification_history.filter(v => v.status === "fake").length, 0);
  const totalSuccess = records.reduce((acc, r) => acc + r.verification_history.filter(v => v.status === "verified").length, 0);
  const successRate = totalVerifications > 0 ? Math.round((totalSuccess / totalVerifications) * 100) : 100;

  // Filtered records
  const filteredRecords = records.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.roll_number.includes(searchQuery)
  );

  return (
    <main className="relative min-h-screen bg-void text-ghost px-6 md:px-8 pt-36 md:pt-40 pb-12 font-sora selection:bg-plasma selection:text-void">
      <Navbar />

      {/* Cyber Background Lights */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-plasma/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] rounded-full bg-purple-700/5 blur-[120px] pointer-events-none" />

      {/* Header Panel */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/5 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-plasma tracking-widest font-data uppercase mb-1">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            Live Database Connected
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Academic Registry <span className="text-plasma">Console</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-data">
            SYSTEM CONTROL LAYER FOR DOCUMENT VERIFICATION PROTOCOLS
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-plasma hover:bg-plasma/90 text-void font-bold text-xs px-4 py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(123,97,255,0.15)] uppercase tracking-wider hover:scale-[1.01] active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            Register Student
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-400 text-xs px-4 py-2.5 rounded-lg transition-all font-semibold uppercase tracking-wider font-data"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-20 relative z-10">
          <div className="w-12 h-12 border-4 border-plasma border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm text-gray-400 font-data uppercase tracking-wider">Syncing cryptographic records registry...</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto relative z-10 space-y-8">
          
          {/* Analytics Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="glass-panel p-5 rounded-2xl bg-graphite/30 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 text-plasma/20 group-hover:text-plasma/40 transition-colors">
                <Users className="w-12 h-12" />
              </div>
              <p className="text-xs text-gray-500 font-data uppercase tracking-wider mb-1">Total Profiles</p>
              <h3 className="text-2xl font-bold text-white tracking-tight font-data">{totalStudents}</h3>
              <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1 font-data">
                <Database className="w-3 h-3 text-plasma" /> Active Registry Records
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl bg-graphite/30 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 text-plasma/20 group-hover:text-plasma/40 transition-colors">
                <Activity className="w-12 h-12" />
              </div>
              <p className="text-xs text-gray-500 font-data uppercase tracking-wider mb-1">Total Audits</p>
              <h3 className="text-2xl font-bold text-white tracking-tight font-data">{totalVerifications}</h3>
              <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1 font-data">
                <Clock className="w-3 h-3 text-plasma" /> Verification attempts logged
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl bg-graphite/30 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors">
                <TrendingUp className="w-12 h-12" />
              </div>
              <p className="text-xs text-gray-500 font-data uppercase tracking-wider mb-1">Integrity Rate</p>
              <h3 className="text-2xl font-bold text-emerald-400 tracking-tight font-data">{successRate}%</h3>
              <p className="text-[10px] text-emerald-500/60 mt-2 flex items-center gap-1 font-data">
                <CheckCircle className="w-3 h-3 text-emerald-400" /> {totalSuccess} Successful Matches
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl bg-graphite/30 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 text-red-500/20 group-hover:text-red-500/40 transition-colors">
                <AlertTriangle className="w-12 h-12" />
              </div>
              <p className="text-xs text-gray-500 font-data uppercase tracking-wider mb-1">Fraud Flagged</p>
              <h3 className="text-2xl font-bold text-red-400 tracking-tight font-data">{totalFraud}</h3>
              <p className="text-[10px] text-red-500/60 mt-2 flex items-center gap-1 font-data">
                <AlertTriangle className="w-3 h-3 text-red-400" /> Mismatches and altered files
              </p>
            </div>

          </div>

          {/* Search Filter Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search registry by Roll Number or Student Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0D0D18] border border-white/5 rounded-xl pl-12 pr-4 py-3.5 text-sm text-ghost focus:border-plasma/50 focus:ring-1 focus:ring-plasma/30 transition-all font-sora placeholder:text-gray-600 outline-none"
            />
          </div>

          {/* Records Table Card */}
          <div className="glass-panel rounded-2xl bg-graphite/20 overflow-hidden border border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-[#0A0A14]/50 text-xs font-semibold uppercase tracking-wider text-gray-400 font-data">
                    <th className="py-4 px-6">Roll Number</th>
                    <th className="py-4 px-6">Student Name</th>
                    <th className="py-4 px-6">Program</th>
                    <th className="py-4 px-6">Semester</th>
                    <th className="py-4 px-6 text-center">SGPA</th>
                    <th className="py-4 px-6 text-center">Verifications</th>
                    <th className="py-4 px-6 text-center">Security Status</th>
                    <th className="py-4 px-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  <AnimatePresence>
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map((student) => (
                        <motion.tr 
                          key={student.roll_number}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-4 px-6 font-data font-medium text-plasma/90">
                            {student.roll_number}
                          </td>
                          <td className="py-4 px-6 font-semibold text-white">
                            {student.name}
                          </td>
                          <td className="py-4 px-6 text-gray-400">
                            {student.program}
                          </td>
                          <td className="py-4 px-6 text-gray-400">
                            {student.semester}
                          </td>
                          <td className="py-4 px-6 text-center font-data font-bold text-gray-200">
                            {student.sgpa.toFixed(2)}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className="font-data text-gray-400 bg-white/5 px-2 py-0.5 rounded text-xs">
                              {student.verification_count}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            {student.last_verification_status === "verified" ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Verified Match
                              </span>
                            ) : student.last_verification_status === "fake" ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.05)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                                Tamper Alert
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-400 border border-gray-500/20">
                                Unverified
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-4">
                              <button
                                onClick={() => setSelectedStudent(student)}
                                className="text-xs text-plasma hover:text-plasma/80 hover:underline flex items-center gap-1 font-data"
                              >
                                Audit Log <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(student.roll_number)}
                                className="text-xs text-red-400 hover:text-red-300 hover:underline flex items-center gap-1 font-data"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-gray-500 font-data">
                          NO REGISTRY ENTRIES MATCHING SELECTION
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Slide-over Registration Panel */}
      <AnimatePresence>
        {showAddModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-void/80 z-50 backdrop-blur-sm"
            />

            {/* Slide over */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0D0D18]/95 border-l border-white/10 p-8 z-50 shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-plasma" />
                    Register Student
                  </h2>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {formError && (
                  <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-data">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{formError}</span>
                  </div>
                )}

                {formSuccess && (
                  <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-xs font-data">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Student record updated in Supabase registry.</span>
                  </div>
                )}

                <form onSubmit={handleAddStudent} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider font-semibold text-gray-400 font-data">Roll Number (12 Digits)</label>
                    <input
                      type="text"
                      required
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value.replace(/\D/g, "").slice(0, 12))}
                      placeholder="e.g. 324606402455"
                      className="w-full bg-void border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-plasma/50 focus:ring-1 focus:ring-plasma/30 transition-all font-data text-ghost outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider font-semibold text-gray-400 font-data">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. JOHN DOE"
                      className="w-full bg-void border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-plasma/50 focus:ring-1 focus:ring-plasma/30 transition-all text-ghost outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider font-semibold text-gray-400 font-data">Program / Course</label>
                    <select
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                      className="w-full bg-void border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-plasma/50 focus:ring-1 focus:ring-plasma/30 transition-all text-ghost outline-none"
                    >
                      <option value="B.Tech Computer Science and Engineering">B.Tech CSE</option>
                      <option value="B.Tech Electronics and Communication Engineering">B.Tech ECE</option>
                      <option value="B.Tech Electrical and Electronics Engineering">B.Tech EEE</option>
                      <option value="B.Tech Mechanical Engineering">B.Tech Mechanical</option>
                      <option value="B.Tech Civil Engineering">B.Tech Civil</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider font-semibold text-gray-400 font-data">Semester</label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full bg-void border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-plasma/50 focus:ring-1 focus:ring-plasma/30 transition-all text-ghost outline-none"
                    >
                      <option value="1-1">1st Year 1st Sem (1-1)</option>
                      <option value="1-2">1st Year 2nd Sem (1-2)</option>
                      <option value="2-1">2nd Year 1st Sem (2-1)</option>
                      <option value="2-2">2nd Year 2nd Sem (2-2)</option>
                      <option value="3-1">3rd Year 1st Sem (3-1)</option>
                      <option value="3-2">3rd Year 2nd Sem (3-2)</option>
                      <option value="4-1">4th Year 1st Sem (4-1)</option>
                      <option value="4-2">4th Year 2nd Sem (4-2)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-wider font-semibold text-gray-400 font-data">SGPA</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={sgpa}
                        onChange={(e) => setSgpa(e.target.value)}
                        placeholder="e.g. 8.15"
                        className="w-full bg-void border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-plasma/50 focus:ring-1 focus:ring-plasma/30 transition-all font-data text-ghost outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-wider font-semibold text-gray-400 font-data">Issue Date</label>
                      <input
                        type="date"
                        required
                        value={issueDate}
                        onChange={(e) => setIssueDate(e.target.value)}
                        className="w-full bg-void border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-plasma/50 focus:ring-1 focus:ring-plasma/30 transition-all font-data text-ghost outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-plasma hover:bg-plasma/90 text-void font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(123,97,255,0.2)] flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 text-xs uppercase tracking-wider"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-void border-t-transparent rounded-full animate-spin" />
                        Syncing with n8n Engine...
                      </>
                    ) : (
                      "Add Student Record"
                    )}
                  </button>
                </form>
              </div>

              <div className="text-[10px] text-gray-600 font-data uppercase tracking-wider text-center mt-6">
                Cryptographic Key Verification Active
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Detailed Logs Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="fixed inset-0 bg-void/80 z-50 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:h-auto bg-[#0D0D18] border border-white/10 rounded-2xl p-6 z-50 shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-plasma" />
                    Verification Logs: {selectedStudent.name}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-data mt-1 uppercase tracking-wider">
                    Roll: {selectedStudent.roll_number} | Sem: {selectedStudent.semester}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[50vh] pr-2 space-y-4">
                {selectedStudent.verification_history.length > 0 ? (
                  selectedStudent.verification_history.map((log) => (
                    <div 
                      key={log.id} 
                      className={`p-4 rounded-xl border ${
                        log.status === "verified" 
                          ? "bg-emerald-500/[0.02] border-emerald-500/15" 
                          : "bg-red-500/[0.02] border-red-500/15"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold ${
                          log.status === "verified" 
                            ? "bg-emerald-500/10 text-emerald-400" 
                            : "bg-red-500/10 text-red-400"
                        }`}>
                          {log.status === "verified" ? "Verified Match" : "Tamper Alert"}
                        </span>
                        
                        <span className="text-[10px] text-gray-500 font-data">
                          {new Date(log.verified_at).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-xs text-gray-300 font-data bg-void/50 p-2.5 rounded-lg border border-white/5">
                        {log.reason || "Verification details unavailable."}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500 font-data">
                    NO VERIFICATION REQUESTS DETECTED FOR THIS PROFILE
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/5 text-right mt-4">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="bg-white/5 hover:bg-white/10 text-ghost text-xs font-semibold px-4 py-2 rounded-lg transition-colors uppercase tracking-wider"
                >
                  Close Audit
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
