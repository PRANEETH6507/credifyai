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
│   │   ├── app/                                   # Page routes & API proxy handlers
│   │   ├── components/                            # R3F canvas & page sections
│   │   └── context/                               # Global state managers
│   ├── .npmrc                                     # Legacy peer dependency configuration
│   └── next.config.mjs                            # NextJS configuration
├── Testing Certificates/                           # Mock university certificate files (PDFs/Images)
└── LICENSE                                        # MIT License
```

---

## ⚙️ Installation & Setup

### 1. Frontend Setup (Next.js)

1. Navigate to the app directory:
   ```bash
   cd credify-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file:
   ```env
   N8N_WEBHOOK_URL=http://localhost:5678/webhook/credifyai-verify
   ```
4. Run in development:
   ```bash
   npm run dev
   ```
5. Build for production:
   ```bash
   npm run build
   ```

### 2. Backend Setup (n8n & Supabase)

1. Make sure **n8n** is running on your machine:
   ```bash
   n8n start
   ```
2. Open your local n8n instance (`http://localhost:5678`) and import the workflow file:
   `backend/n8n/CredifyAI_VerifyProfile.json`.
3. Set up a PostgreSQL table named `student_records` in your Supabase database:
   ```sql
   CREATE TABLE student_records (
       roll_number VARCHAR PRIMARY KEY,
       name VARCHAR NOT NULL,
       program VARCHAR NOT NULL,
       semester VARCHAR,
       sgpa NUMERIC,
       issue_date DATE
   );
   ```
4. Activate the n8n workflow.

---

## 🧪 Testing Locally vs Production

### Local Testing with Tunnel
To test n8n webhooks from the deployed Vercel instance, expose n8n using a secure SSH tunnel:
```bash
ssh -R 80:127.0.0.1:5678 nokey@localhost.run
```
Copy the generated `https://xxxx.lhr.life` URL, configure it as `N8N_WEBHOOK_URL` in your Vercel Dashboard, and trigger a **Redeploy**.

---

## 📄 License
This project is open-source software licensed under the [MIT License](LICENSE).
