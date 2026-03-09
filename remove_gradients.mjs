import fs from 'fs';
import path from 'path';

function removeGradients(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      removeGradients(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace bg-gradient... from... via... to...
      content = content.replace(/bg-gradient-to-[a-z]+\s+from-[a-zA-Z0-9\-\/]+\s+via-[a-zA-Z0-9\-\/]+\s+to-[a-zA-Z0-9\-\/]+/g, 'bg-accent-blue');
      // Replace bg-gradient... from... to...
      content = content.replace(/bg-gradient-to-[a-z]+\s+from-[a-zA-Z0-9\-\/]+\s+to-[a-zA-Z0-9\-\/]+/g, 'bg-accent-gold');
      // Replace rogue bg-gradient...
      content = content.replace(/bg-gradient-to-[a-z]+/g, '');
      
      content = content.replace(/from-accent-[a-z\-\/]+ /g, '');
      content = content.replace(/to-accent-[a-z\-\/]+/g, '');

      // Replace glowing blur texts etc
      content = content.replace(/shadow-\[.*?\]/g, 'shadow-hard');

      fs.writeFileSync(fullPath, content);
    }
  }
}

removeGradients('./src');
