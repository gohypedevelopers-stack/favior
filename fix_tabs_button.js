const fs = require('fs');

const tabsFile = 'src/components/ui/tabs.tsx';
if (fs.existsSync(tabsFile)) {
  let content = fs.readFileSync(tabsFile, 'utf-8');
  content = content.replace(
    /className={cn\(\n\s*"inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",\n\s*className\n\s*\)}/g,
    'style={{ display: "inline-flex", height: "2.25rem", alignItems: "center", justifyContent: "center", borderRadius: "0.5rem", backgroundColor: "rgba(0,0,0,0.05)", padding: "0.25rem", color: "rgb(0,0,0,0.5)" }} className={cn("", className)}'
  );
  content = content.replace(
    /className={cn\(\n\s*"inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-\[state=active\]:bg-background data-\[state=active\]:text-foreground data-\[state=active\]:shadow-sm",\n\s*className\n\s*\)}/g,
    'style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap", borderRadius: "0.375rem", padding: "0.25rem 0.75rem", fontSize: "0.875rem", fontWeight: "500", transition: "all 150ms", color: "inherit", backgroundColor: "transparent", ...(props.value === props["data-state"] ? {backgroundColor: "white", color: "black", boxShadow: "0 1px 2px rgba(0,0,0,0.05)"} : {}) }} className={cn("", className)}'
  );
  fs.writeFileSync(tabsFile, content);
  console.log('Fixed tabs.tsx');
}

const buttonFile = 'src/components/ui/button.tsx';
if (fs.existsSync(buttonFile)) {
  let content = fs.readFileSync(buttonFile, 'utf-8');
  content = content.replace(
    /className={cn\(buttonVariants\(\{ variant, size, className \}\)\)}/g,
    'style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "0.375rem", fontWeight: "500", fontSize: "0.875rem", height: "2.5rem", paddingLeft: "1rem", paddingRight: "1rem", backgroundColor: variant === "outline" ? "transparent" : variant === "ghost" ? "transparent" : variant === "destructive" ? "rgb(220,38,38)" : "rgb(26,26,26)", color: variant === "outline" ? "black" : variant === "ghost" ? "black" : "white", borderWidth: variant === "outline" ? "1px" : "0", borderColor: "rgb(0,0,0,0.2)" }} className={cn("", className)}'
  );
  fs.writeFileSync(buttonFile, content);
  console.log('Fixed button.tsx');
}
