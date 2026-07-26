const http = require('http');
const fs = require('fs');
const path = require('path');

// Safe configuration loading credentials from env variables
const loginPayload = JSON.stringify({
    emailOrLdapLoginId: process.env.N8N_USER_EMAIL || 'admin@example.com',
    password: process.env.N8N_USER_PASSWORD || 'password123'
});

function makeRequest(options, body) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                resolve({ status: res.statusCode, headers: res.headers, body: data });
            });
        });
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}

async function main() {
    console.log('Logging in to local n8n instance...');
    const loginRes = await makeRequest({
        hostname: 'localhost',
        port: 5678,
        path: '/rest/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginPayload) }
    }, loginPayload);
    
    console.log('Login status:', loginRes.status);
    
    if (loginRes.status !== 200) {
        console.log('Response:', loginRes.body.substring(0, 300));
        console.log('Ensure N8N_USER_EMAIL and N8N_USER_PASSWORD are set correctly.');
        return;
    }
    
    const cookies = loginRes.headers['set-cookie'];
    const cookieHeader = cookies ? cookies.map(c => c.split(';')[0]).join('; ') : '';
    
    // Fetch current workflow
    const workflowId = process.env.N8N_WORKFLOW_ID || 'N7gxCDvi0PdQRGbI';
    console.log(`Fetching current workflow ${workflowId}...`);
    const getRes = await makeRequest({
        hostname: 'localhost',
        port: 5678,
        path: `/rest/workflows/${workflowId}`,
        method: 'GET',
        headers: { 'Cookie': cookieHeader }
    });
    
    console.log('Get status:', getRes.status);
    
    if (getRes.status !== 200) {
        console.log('Get response:', getRes.body.substring(0, 300));
        return;
    }
    
    const currentWorkflow = JSON.parse(getRes.body);
    const versionId = currentWorkflow.data?.versionId || currentWorkflow.versionId;
    console.log('Version ID:', versionId);
    
    // Load local JSON relative to script directory
    const localJsonPath = path.join(__dirname, 'CredifyAI_Verification_v2.json');
    if (!fs.existsSync(localJsonPath)) {
        console.error(`Local JSON file not found at: ${localJsonPath}`);
        return;
    }
    const localWorkflow = JSON.parse(fs.readFileSync(localJsonPath, 'utf8'));
    
    console.log('Pushing full workflow update from local JSON...');
    
    const updatePayload = JSON.stringify({
        name: localWorkflow.name,
        nodes: localWorkflow.nodes,
        connections: localWorkflow.connections,
        settings: localWorkflow.settings,
        active: localWorkflow.active,
        versionId: versionId
    });
    
    const updateRes = await makeRequest({
        hostname: 'localhost',
        port: 5678,
        path: `/rest/workflows/${workflowId}`,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(updatePayload),
            'Cookie': cookieHeader
        }
    }, updatePayload);
    
    console.log('Update status:', updateRes.status);
    
    if (updateRes.status === 200) {
        console.log('SUCCESS! Workflow fully synchronized with local JSON!');
    } else {
        console.log('Update response:', updateRes.body.substring(0, 500));
    }
}

main().catch(e => console.log('Error:', e.message));
