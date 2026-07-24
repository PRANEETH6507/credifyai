const http = require('http');
const fs = require('fs');
const path = require('path');

// n8n uses /rest/login for auth
const loginPayload = JSON.stringify({
    emailOrLdapLoginId: 'pranee.eswar@gmail.com',
    password: 'Praneeth@6507'
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
    // Step 1: Login
    console.log('Logging in...');
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
        return;
    }
    
    const cookies = loginRes.headers['set-cookie'];
    const cookieHeader = cookies ? cookies.map(c => c.split(';')[0]).join('; ') : '';
    console.log('Cookies:', cookieHeader ? 'OK' : 'NONE');
    
    // Step 2: Get current workflow to get versionId
    console.log('Fetching current workflow...');
    const getRes = await makeRequest({
        hostname: 'localhost',
        port: 5678,
        path: '/rest/workflows/N7gxCDvi0PdQRGbI',
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
    
    // Step 3: Load local JSON
    const localJsonPath = path.join(__dirname, 'CredifyAI_Verification_v2.json');
    const localWorkflow = JSON.parse(fs.readFileSync(localJsonPath, 'utf8'));
    
    console.log('Pushing full workflow update from local JSON...');
    
    // Step 4: Push the update
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
        path: '/rest/workflows/N7gxCDvi0PdQRGbI',
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
