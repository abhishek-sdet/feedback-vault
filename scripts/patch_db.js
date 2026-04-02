/**
 * One-time DB patch: Re-classify all existing records
 * using the smart keyword classifier.
 * Run: node scripts/patch_db.js
 */

const Database = require('better-sqlite3');
const path = require('path');

const GRIEVANCE_KEYWORDS = [
  'broken', 'issue', 'problem', 'bad', 'hate', 'fail',
  'error', 'slow', 'angry', 'worst', 'stuck', 'help',
  'not working', 'stress', 'pressure', 'burnout', 'anxiety',
  'frustrated', 'can\'t', 'cannot', 'doesn\'t', 'wrong'
];

function classifyFeedback(content) {
  const lower = content.toLowerCase();
  const isGrievance = GRIEVANCE_KEYWORDS.some(kw => lower.includes(kw));
  return isGrievance ? 'GRIEVANCE' : 'FEEDBACK';
}

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
const db = new Database(dbPath);

const rows = db.prepare('SELECT id, content, type FROM Submission').all();

console.log(`\n📂 Found ${rows.length} records. Starting re-classification...\n`);

let updatedToFeedback = 0;
let updatedToGrievance = 0;
let unchanged = 0;

for (const row of rows) {
  const newType = classifyFeedback(row.content);
  if (newType !== row.type) {
    db.prepare('UPDATE Submission SET type = ? WHERE id = ?').run(newType, row.id);
    console.log(`  ✅ "${row.content.substring(0, 40)}" → ${row.type} changed to ${newType}`);
    if (newType === 'FEEDBACK') updatedToFeedback++;
    else updatedToGrievance++;
  } else {
    console.log(`  ⏭️  "${row.content.substring(0, 40)}" → Already ${newType}, no change`);
    unchanged++;
  }
}

console.log(`\n✨ Done!`);
console.log(`  → Changed to FEEDBACK: ${updatedToFeedback}`);
console.log(`  → Changed to GRIEVANCE: ${updatedToGrievance}`);
console.log(`  → Unchanged: ${unchanged}\n`);

db.close();
