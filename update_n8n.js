const fs = require('fs');
const path = require('path');

const cryptoNodeTemplate = {
  parameters: {
    action: "hash",
    type: "SHA256",
    value: "={{$binary.certificate.data}}", // Base64 data of the file
    dataPropertyName: "certificate_hash",
    encoding: "hex"
  },
  id: "hash-node-id",
  name: "Generate_Certificate_Hash",
  type: "n8n-nodes-base.crypto",
  typeVersion: 1,
  position: [720, -64]
};

const filePaths = [
    'C:/Users/eswar/Desktop/CredifyAI Frontend/CredifyAI_Verification_v2.json',
    'C:/Users/eswar/Desktop/CredifyAI Frontend/CredifyAI_University_Registration.json',
    'C:/Users/eswar/.n8n-local/registry_verify.json',
    'C:/Users/eswar/.n8n-local/registry_register.json'
];

filePaths.forEach(filepath => {
    try {
        if (!fs.existsSync(filepath)) {
            console.log('File not found:', filepath);
            return;
        }
        
        let data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        let modified = false;
        
        if (data.nodes) {
            const index = data.nodes.findIndex(n => n.name === 'Generate_Certificate_Hash');
            if (index !== -1) {
                // Keep original ID and Position
                const originalNode = data.nodes[index];
                const newNode = { ...cryptoNodeTemplate };
                newNode.id = originalNode.id || newNode.id;
                newNode.position = originalNode.position || newNode.position;
                
                // Swap the Code node with the new Crypto node
                data.nodes[index] = newNode;
                modified = true;
            }
        }
        
        if (modified) {
            fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
            console.log('Successfully updated:', filepath);
        } else {
            console.log('Node "Generate_Certificate_Hash" not found in:', filepath);
        }
    } catch (err) {
        console.error('Failed to process', filepath, err);
    }
});
