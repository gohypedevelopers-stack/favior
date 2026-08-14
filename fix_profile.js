const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function main() {
  const prisma = new PrismaClient();
  try {
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });
    
    if (admin && admin.email.includes('xelectron.com')) {
      await prisma.user.update({
        where: { id: admin.id },
        data: { email: 'admin@favior.com' },
      });
      console.log('Updated admin email to admin@favior.com');
    }
  } catch (error) {
    console.error('Database update failed:', error);
  } finally {
    await prisma.$disconnect();
  }

  const profileFile = 'src/components/admin/profile/admin-profile-client.tsx';
  if (fs.existsSync(profileFile)) {
    let content = fs.readFileSync(profileFile, 'utf-8');
    
    // Fix grid layout (Full Name and Email on same row but with proper gap and styling)
    content = content.replace(
      /style={{"display":"grid","gridTemplateColumns":"repeat\(1, minmax\(0, 1fr\)\)","gap":"1.25rem"}}/g,
      'style={{"display":"grid","gridTemplateColumns":"repeat(2, minmax(0, 1fr))","gap":"1.25rem"}}'
    );
    
    content = content.replace(
      /className="md:col-span-2"/g,
      'style={{ gridColumn: "span 2 / span 2" }}'
    );

    // Fix the weird border and padding on the inputs
    const badInputStyleRegex = /style={{"width":"100%","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb\(15,23,42\)","backgroundColor":"rgb\(255,255,255\)","paddingLeft":"0.875rem","paddingRight":"0.875rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb\(15,23,42\)","transitionProperty":"all","transitionTimingFunction":"cubic-bezier\(0.4, 0, 0.2, 1\)","transitionDuration":"150ms","outline":"2px solid transparent","outlineOffset":"2px","boxShadow":"0 0 0 0px #fff,   0 0 0 calc\(1px \+ 0px\) rgb\(59,130,246,0.5\), 0 0 #0000"}}/g;
    
    content = content.replace(
      badInputStyleRegex,
      'style={{"width":"100%","borderRadius":"0.375rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.2)","backgroundColor":"white","padding":"0.5rem 0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem","outline":"none"}}'
    );

    content = content.replace(
      /style={{"display":"grid","gridTemplateColumns":"repeat\(1, minmax\(0, 1fr\)\)","gap":"1rem","marginTop":"1rem"}}/g,
      'style={{"display":"grid","gridTemplateColumns":"repeat(1, minmax(0, 1fr))","gap":"1rem","marginTop":"1rem"}}'
    );

    fs.writeFileSync(profileFile, content);
    console.log('Fixed profile layout CSS');
  }
}

main();
