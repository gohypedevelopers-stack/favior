const fs = require('fs');
const path = require('path');

const analyticsFile = 'src/app/dashboard/analytics/page.tsx';
if (fs.existsSync(analyticsFile)) {
  let content = fs.readFileSync(analyticsFile, 'utf-8');

  // Fix grids in Analytics
  content = content.replace(
    /style={{"marginTop":"1rem","display":"grid","gap":"1rem"}}/g,
    'style={{"marginTop":"1rem","display":"grid","gridTemplateColumns":"repeat(auto-fit, minmax(250px, 1fr))","gap":"1rem"}}'
  );

  // Fix tabs
  content = content.replace(
    /className={\`.*?inline-flex.*?\$\{/g,
    'style={{"display":"inline-flex","alignItems":"center","borderRadius":"0.375rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","padding":"0.25rem","fontSize":"0.875rem","lineHeight":"1.25rem"}} className={` ${'
  );
  content = content.replace(
    /className={\`.*?inline-flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors.*?\$\{/g,
    'style={{"display":"inline-flex","alignItems":"center","gap":"0.5rem","borderRadius":"0.375rem","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.375rem","paddingBottom":"0.375rem","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms"}} className={` ${'
  );

  fs.writeFileSync(analyticsFile, content);
  console.log('Fixed Analytics grid');
}

const discountsFile = 'src/app/dashboard/discounts/page.tsx';
if (fs.existsSync(discountsFile)) {
  let content = fs.readFileSync(discountsFile, 'utf-8');
  content = content.replace(
    /className="flex min-h-\[400px\] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50"/g,
    'style={{"display":"flex","minHeight":"400px","flexDirection":"column","alignItems":"center","justifyContent":"center","borderRadius":"0.5rem","borderWidth":"1px","borderStyle":"dashed","borderColor":"rgb(0,0,0,0.1)","padding":"2rem","textAlign":"center"}}'
  );
  fs.writeFileSync(discountsFile, content);
  console.log('Fixed Discounts Empty State');
}

const ordersFile = 'src/app/dashboard/orders/page.tsx';
if (fs.existsSync(ordersFile)) {
  let content = fs.readFileSync(ordersFile, 'utf-8');
  // Summary Grid
  content = content.replace(
    /style={{"display":"grid","gap":"1rem"}}/g,
    'style={{"display":"grid","gridTemplateColumns":"repeat(2, minmax(0, 1fr))","gap":"1rem"}}'
  );
  fs.writeFileSync(ordersFile, content);
  console.log('Fixed Orders Grid');
}

const creatorVideosFile = 'src/app/dashboard/creator-videos/page.tsx';
if (fs.existsSync(creatorVideosFile)) {
  let content = fs.readFileSync(creatorVideosFile, 'utf-8');
  content = content.replace(
    /className="flex flex-col items-center justify-center min-h-\[400px\] p-8 text-center border rounded-lg bg-slate-50\/50"/g,
    'style={{"display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center","minHeight":"400px","padding":"2rem","textAlign":"center","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","borderRadius":"0.5rem","backgroundColor":"rgba(248,250,252,0.5)"}}'
  );
  fs.writeFileSync(creatorVideosFile, content);
  console.log('Fixed Creator Videos Empty State');
}
