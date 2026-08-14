const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'prisma', 'dev.db');
try {
  const db = new Database(dbPath);
  const info = db.prepare(`UPDATE User SET email = 'admin@favior.com' WHERE email LIKE '%xelectron.com%'`).run();
  console.log('Updated rows:', info.changes);
  db.close();
} catch (e) {
  console.error(e);
}
