const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, '..', 'resources', 'js');
const envVar = 'import.meta.env.VITE_ADMIN_PORTAL_PREFIX';

function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            processFile(fullPath);
        }
    });
}

function processFile(filepath) {
    let content = fs.readFileSync(filepath, 'utf8');
    
    if (!content.includes('/admin/')) return;
    
    let original = content;

    // 1. JSX href="/admin/..." -> href={`/${env_var}/...`}
    content = content.replace(/([a-zA-Z_]+)="\/admin\/([^"]*)"/g, `$1={\`/\${${envVar}}/$2\`}`);
    
    // 2. String literal "/admin/..." -> `/${env_var}/...`
    content = content.replace(/"\/admin\/([^"]*)"/g, `\`/\${${envVar}}/$1\``);
    
    // 3. String literal '/admin/...' -> `/${env_var}/...`
    content = content.replace(/'\/admin\/([^']*)'/g, `\`/\${${envVar}}/$1\``);
    
    // 4. Template literal `/admin/...` -> `/${env_var}/...`
    content = content.replace(/`\/admin\/([^`]*)`/g, `\`/\${${envVar}}/$1\``);
    
    if (content !== original) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Updated ${filepath}`);
    }
}

walkDir(dirPath);
