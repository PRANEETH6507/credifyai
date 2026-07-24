const fs = require('fs');

const originalCodeNode = {
  parameters: {
    jsCode: "const crypto = require('crypto');\n\nconst binaryData = $input.first().binary.certificate;\n\nif (!binaryData) {\n    throw new Error('Binary property \"certificate\" not found.');\n}\n\nconst buffer = await $helpers.getBinaryDataBuffer(0, 'certificate');\nconst hash = crypto.createHash('sha256').update(buffer).digest('hex');\n\nreturn {\n  certificate_hash: hash\n};"
  },
  id: "hash-node-id",
  name: "Generate_Certificate_Hash",
  type: "n8n-nodes-base.code",
  typeVersion: 2,
  position: [720, -64]
};

const filePaths = [
    'C:/Users/eswar/Desktop/CredifyAI Frontend/CredifyAI_Verification_v2.json',
    'C:/Users/eswar/.n8n-local/registry_verify.json'
];

filePaths.forEach(filepath => {
    try {
        if (!fs.existsSync(filepath)) return;
        
        let data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        let modified = false;
        
        if (data.nodes) {
            const index = data.nodes.findIndex(n => n.name === 'Generate_Certificate_Hash');
            if (index !== -1) {
                // Keep the exact ID and position if it differs slightly
                const currentNode = data.nodes[index];
                const restoredNode = { ...originalCodeNode };
                restoredNode.id = currentNode.id || restoredNode.id;
                restoredNode.position = currentNode.position || restoredNode.position;
                
                data.nodes[index] = restoredNode;
                modified = true;
            }
        }
        
        if (modified) {
            fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
            console.log('Restored original Code Node in:', filepath);
        }
    } catch (err) {
        console.error('Failed to process', filepath, err);
    }
});
