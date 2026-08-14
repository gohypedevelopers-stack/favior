const fs = require('fs');

const tableFile = 'src/components/ui/table.tsx';
if (fs.existsSync(tableFile)) {
  let content = fs.readFileSync(tableFile, 'utf-8');
  content = content.replace(
    /className={cn\("w-full caption-bottom text-sm", className\)}/g,
    'style={{ width: "100%", fontSize: "0.875rem", borderCollapse: "collapse" }} className={cn("", className)}'
  );
  content = content.replace(
    /className={cn\("\[&_tr\]:border-b", className\)}/g,
    'style={{ borderBottom: "1px solid rgb(0,0,0,0.1)" }} className={cn("", className)}'
  );
  content = content.replace(
    /className={cn\(\n\s*"h-10 px-2 text-left align-middle font-medium text-muted-foreground \[&:has\(\[role=checkbox\]\)\]:pr-0 \[&>\[role=checkbox\]\]:translate-y-\[2px\]",\n\s*className\n\s*\)}/g,
    'style={{ height: "2.5rem", padding: "0 0.5rem", textAlign: "left", verticalAlign: "middle", fontWeight: "500", color: "rgb(0,0,0,0.5)" }} className={cn("", className)}'
  );
  content = content.replace(
    /className={cn\(\n\s*"p-2 align-middle \[&:has\(\[role=checkbox\]\)\]:pr-0 \[&>\[role=checkbox\]\]:translate-y-\[2px\]",\n\s*className\n\s*\)}/g,
    'style={{ padding: "0.5rem", verticalAlign: "middle" }} className={cn("", className)}'
  );
  content = content.replace(
    /className={cn\(\n\s*"hover:bg-muted\/50 data-\[state=selected\]:bg-muted border-b transition-colors",\n\s*className\n\s*\)}/g,
    'style={{ borderBottom: "1px solid rgb(0,0,0,0.1)" }} className={cn("", className)}'
  );
  fs.writeFileSync(tableFile, content);
  console.log('Fixed table.tsx');
}

const cardFile = 'src/components/ui/card.tsx';
if (fs.existsSync(cardFile)) {
  let content = fs.readFileSync(cardFile, 'utf-8');
  content = content.replace(
    /className={cn\(\n\s*"group\/card flex flex-col gap-\(--card-spacing\) overflow-hidden rounded-xl bg-card py-\(--card-spacing\) text-sm text-card-foreground shadow-xs ring-1 ring-foreground\/10 \[\-\-card-spacing:\-\-spacing\(6\)\] has-\[>img:first-child\]:pt-0 data-\[size=sm\]:\[\-\-card-spacing:\-\-spacing\(4\)\] \*:\[img:first-child\]:rounded-t-xl \*:\[img:last-child\]:rounded-b-xl",\n\s*className\n\s*\)}/g,
    'style={{ display: "flex", flexDirection: "column", gap: "1rem", overflow: "hidden", borderRadius: "0.75rem", backgroundColor: "white", padding: "1.5rem", fontSize: "0.875rem", boxShadow: "0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)", borderWidth: "1px", borderColor: "rgb(0,0,0,0.1)" }} className={cn("", className)}'
  );
  content = content.replace(
    /className={cn\(\n\s*"group\/card-header @container\/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-\(--card-spacing\) has-data-\[slot=card-action\]:grid-cols-\[1fr_auto\] has-data-\[slot=card-description\]:grid-rows-\[auto_auto\] \[\.border-b\]:pb-\(--card-spacing\)",\n\s*className\n\s*\)}/g,
    'style={{ display: "grid", gridAutoRows: "min-content", alignItems: "start", gap: "0.25rem", borderTopLeftRadius: "0.75rem", borderTopRightRadius: "0.75rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }} className={cn("", className)}'
  );
  content = content.replace(
    /className={cn\(\n\s*"font-heading text-base leading-normal font-medium group-data-\[size=sm\]\/card:text-sm",\n\s*className\n\s*\)}/g,
    'style={{ fontSize: "1rem", lineHeight: "1.5", fontWeight: "500" }} className={cn("", className)}'
  );
  content = content.replace(
    /className={cn\("text-sm text-muted-foreground", className\)}/g,
    'style={{ fontSize: "0.875rem", color: "rgb(0,0,0,0.5)" }} className={cn("", className)}'
  );
  content = content.replace(
    /className={cn\("px-\(--card-spacing\)", className\)}/g,
    'style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem" }} className={cn("", className)}'
  );
  content = content.replace(
    /className={cn\(\n\s*"flex items-center rounded-b-xl px-\(--card-spacing\) \[\.border-t\]:pt-\(--card-spacing\)",\n\s*className\n\s*\)}/g,
    'style={{ display: "flex", alignItems: "center", borderBottomLeftRadius: "0.75rem", borderBottomRightRadius: "0.75rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }} className={cn("", className)}'
  );
  fs.writeFileSync(cardFile, content);
  console.log('Fixed card.tsx');
}
