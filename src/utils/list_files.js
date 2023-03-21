const fs = require('fs');
const path = require('path');

module.exports = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];
  
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            const subFiles = module.exports(fullPath);
            files.push(...subFiles);
        } else {
            const contents = fs.readFileSync(fullPath, 'utf-8');
            files.push({ filename: fullPath, contents });
        }
    }
  
    return files;
}