const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;
      let newContent = content;
      
      for(let i=0; i<3; i++) {
          newContent = newContent.replace(/style=\{\{([^}]+)\}\}\s*style=\{\{([^}]+)\}\}/g, (match, p1, p2) => {
              changed = true;
              return `style={{${p1}, ${p2}}}`;
          });
      }

      if (changed) {
          fs.writeFileSync(fullPath, newContent, 'utf-8');
          console.log('Fixed styles in ' + fullPath);
      }
    }
  }
}
walkDir('E:/favior/src/app/dashboard');
walkDir('E:/favior/src/components/admin');
