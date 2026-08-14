import fs from 'fs';
import path from 'path';
import { tailwindToCSS } from 'tw-to-css';
import parse from 'style-to-object';

const { twi } = tailwindToCSS({
  config: {
    theme: {
      extend: {
        colors: {
          border: "hsl(var(--border))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          primary: {
            DEFAULT: "hsl(var(--primary))",
            foreground: "hsl(var(--primary-foreground))",
          },
          secondary: {
            DEFAULT: "hsl(var(--secondary))",
            foreground: "hsl(var(--secondary-foreground))",
          },
          destructive: {
            DEFAULT: "hsl(var(--destructive))",
            foreground: "hsl(var(--destructive-foreground))",
          },
          muted: {
            DEFAULT: "hsl(var(--muted))",
            foreground: "hsl(var(--muted-foreground))",
          },
          accent: {
            DEFAULT: "hsl(var(--accent))",
            foreground: "hsl(var(--accent-foreground))",
          },
          popover: {
            DEFAULT: "hsl(var(--popover))",
            foreground: "hsl(var(--popover-foreground))",
          },
          card: {
            DEFAULT: "hsl(var(--card))",
            foreground: "hsl(var(--card-foreground))",
          },
        }
      }
    }
  }
});

function camelCase(str) {
  return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

function convertClassesToStyle(classNames) {
  const css = twi(classNames);
  if (!css) return null;
  
  let styleObj = null;
  try {
    const rawObj = parse(css);
    if (!rawObj || Object.keys(rawObj).length === 0) return null;
    
    styleObj = {};
    for (const [key, value] of Object.entries(rawObj)) {
      styleObj[camelCase(key)] = value;
    }
  } catch (err) {
    return null;
  }
  
  return styleObj;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  const regex = /className="([^"]+)"/g;
  content = content.replace(regex, (match, classNames) => {
    const styleObj = convertClassesToStyle(classNames);
    if (styleObj) {
      changed = true;
      return `style={${JSON.stringify(styleObj)}}`;
    }
    return match;
  });

  const regex2 = /className={`([^$]+?)`}/g;
  content = content.replace(regex2, (match, classNames) => {
    const styleObj = convertClassesToStyle(classNames);
    if (styleObj) {
      changed = true;
      return `style={${JSON.stringify(styleObj)}}`;
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Converted: ${filePath}`);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

const targets = [
  'E:/favior/src/app/dashboard',
  'E:/favior/src/components/admin'
];

targets.forEach(walkDir);
console.log('Conversion complete!');
