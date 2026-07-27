# CredifyAI 🛡️

**CredifyAI** is a premium, 3D interactive academic credential verification web application. It integrates Next.js, React Three Fiber (Three.js), n8n workflow automation, and Supabase database cross-verification to create an instant, automated, and secure certificate authenticity checker.

---

## 🚀 Key Features

*   **Interactive 3D UI**: Fully responsive and interactive 3D shield visualizer powered by React Three Fiber (R3F) and Framer Motion.
*   **Real-time Telemetry logs**: Simulates and displays live connection states, OCR progress, and database checks.
*   **Serverless API Proxy**: Secures internal webhook endpoints and resolves CORS challenges by proxying traffic on the Vercel edge network.
*   **n8n Workflow Automation**: Integrates OCR parsing, university database lookup, email dispatching, and webhook feedback in a visual low-code canvas.
*   **Supabase Database**: Cross-references OCR student metadata (Name, Roll Number, Program) with university registration records.

---

## 🛠️ Tech Stack

*   **Frontend**: Next.js (App Router), React Three Fiber, Tailwind CSS, Lucide Icons.
*   **Backend Automation**: n8n Workflow Engine.
*   **Database**: Supabase (PostgreSQL).
*   **Tunneling (Development)**: localhost.run / localtunnel.

---

## 📂 Project Structure

```bash
├── backend/
│   └── n8n/
│       ├── CredifyAI_VerifyProfile.json           # Active Verification n8n workflow
│       ├── CredifyAI_University_Registration.json  # University registration workflow
│       ├── push_to_n8n.js                         # Sync local workflow changes to n8n
│       ├── update_n8n.js                          # Node configuration script
│       └── restore_n8n.js                         # Node restoration script
├── credify-app/                                   # Next.js Frontend Application
│   ├── src/
│   │   ├── app/                                   
│   │   │   ├── admin/                             # University admin portal & login views
│   │   │   ├── api/                               # Secure API handlers & n8n proxies
│   │   │   └── page.tsx                           # Public verification homepage
│   │   ├── components/                            # R3F canvas & page sections
│   │   └── context/                               # Global state managers
│   ├── .npmrc                                     # Legacy peer dependency configuration
│   └── next.config.mjs                            # NextJS configuration
└── LICENSE                                        # MIT License
```

---

## ⚙️ Installation & Setup

### 1. Database Schema Setup (Supabase)
Create the following two tables in your Supabase database console:

```sql
-- 1. Student registry table
CREATE TABLE student_records (
    roll_number VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    program VARCHAR NOT NULL,
    semester VARCHAR,
    sgpa NUMERIC,
    issue_date DATE
);

-- 2. Audit/Verification attempt logs table
CREATE TABLE verifications (
    id SERIAL PRIMARY KEY,
    roll_number VARCHAR REFERENCES student_records(roll_number) ON DELETE CASCADE,
    status VARCHAR NOT NULL,
    confidence NUMERIC,
    reason TEXT,
    verified_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Frontend Configuration (Next.js)

1. Navigate to the app directory:
   ```bash
   cd credify-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with the following variables:
   ```env
   # Database connection
   SUPABASE_URL=https://your-supabase-project.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key

   # n8n Automation Engine Webhooks
   N8N_WEBHOOK_URL=http://localhost:5678/webhook/credifyai-verify

   # Registrar Admin Panel Credentials
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin@credifyai
   JWT_SECRET=super_secret_session_key_for_registrar

   # Registry security token for n8n API calls
   UNIVERSITY_API_KEY=your-secret-api-key
   ```
4. Run in development:
   ```bash
   npm run dev
   ```
5. Build for production:
   ```bash
   npm run build
   ```

---

## ⚡ Production Deployment (Vercel)

1. **Deploy to Vercel**: Connect this GitHub repository directly to Vercel.
2. **Environment Variables**: Add all variables defined in `.env.local` inside the Vercel project configuration dashboard.
3. **Tunneling (Local Backend)**: If running n8n locally on your system, expose it to Vercel via:
   ```bash
   ssh -R 80:127.0.0.1:5678 nokey@localhost.run
   ```
   Copy the generated `https://xxxx.lhr.life` URL, configure it as `N8N_WEBHOOK_URL` in the Vercel project dashboard, and trigger a **Redeploy**.

---

## 📄 License
This project is open-source software licensed under the [MIT License](LICENSE).
