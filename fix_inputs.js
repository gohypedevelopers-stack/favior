const fs = require('fs');
const path = require('path');
const file1 = 'E:/favior/src/components/admin/products/add-product-form.tsx';
let c1 = fs.readFileSync(file1, 'utf-8');

const inputStyleStr = `const inputStyle = { height: '2.5rem', width: '100%', borderRadius: '0.5rem', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(0,0,0,0.25)', backgroundColor: 'white', paddingLeft: '0.75rem', paddingRight: '0.75rem', fontSize: '0.875rem', outline: 'none' };`;

c1 = c1.replace(/const inputClass = .*?;/g, inputStyleStr);
c1 = c1.replace(/className=\{inputClass\}/g, 'style={inputStyle}');
c1 = c1.replace(/className=\{\`\$\{inputClass\} pl-7\`\}/g, 'style={{...inputStyle, paddingLeft: \'1.75rem\'}}');

// For the quantity input
c1 = c1.replace(/className=\{\`\$\{inputClass\}.*?\}\}/g, 
  "style={{...inputStyle, ...(Number(quantity) <= 5 ? {borderColor: 'rgb(248,113,113)', backgroundColor: 'rgb(254,242,242)', color: 'rgb(185,28,28)'} : {})}}");

// For the error text
c1 = c1.replace(/className=\{\`mt-2 text-xs.*?\}/g, 
  "style={{marginTop: '0.5rem', fontSize: '0.75rem', ...(Number(quantity) <= 5 ? {color: 'rgb(220,38,38)', fontWeight: '500'} : {color: 'rgba(0,0,0,0.55)'})}}");

fs.writeFileSync(file1, c1, 'utf-8');
console.log('Fixed add-product-form');

const file2 = 'E:/favior/src/components/admin/products/edit-product-form.tsx';
if (fs.existsSync(file2)) {
  let c2 = fs.readFileSync(file2, 'utf-8');
  c2 = c2.replace(/const inputClass = .*?;/g, inputStyleStr);
  c2 = c2.replace(/className=\{inputClass\}/g, 'style={inputStyle}');
  c2 = c2.replace(/className=\{\`\$\{inputClass\} pl-7\`\}/g, 'style={{...inputStyle, paddingLeft: \'1.75rem\'}}');
  c2 = c2.replace(/className=\{\`\$\{inputClass\}.*?\}\}/g, 
    "style={{...inputStyle, ...(Number(quantity) <= 5 ? {borderColor: 'rgb(248,113,113)', backgroundColor: 'rgb(254,242,242)', color: 'rgb(185,28,28)'} : {})}}");
  c2 = c2.replace(/className=\{\`mt-2 text-xs.*?\}/g, 
    "style={{marginTop: '0.5rem', fontSize: '0.75rem', ...(Number(quantity) <= 5 ? {color: 'rgb(220,38,38)', fontWeight: '500'} : {color: 'rgba(0,0,0,0.55)'})}}");
  fs.writeFileSync(file2, c2, 'utf-8');
  console.log('Fixed edit-product-form');
}
