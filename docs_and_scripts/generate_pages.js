const fs = require('fs');
const path = require('path');

// ==========================================
// CONFIGURATION CONSTANTS
// ==========================================
const START_INDEX = 0;
const END_INDEX = 122;

const CONTENT_DIR = path.join(__dirname, 'content', 'pages');

// Ensure the root pages directory exists
if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

for (let i = START_INDEX; i <= END_INDEX; i++) {
  // Format the number to have leading zeros (e.g., 000, 001, 010)
  const pageNumStr = i.toString().padStart(3, '0');
  const pageId = `page${pageNumStr}`;
  
  const filePath = path.join(CONTENT_DIR, `${pageId}.md`);
  
  // Markdown content with required front matter for the CMS
  // slug is included to ensure Hugo permalinks route it to /page###/
  const content = `---
id: "${pageId}"
page_number: ${i}
status: "empty"
title: "Page ${i}"
slug: "${pageId}"
---
`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Generated template for ${pageId} -> ${filePath}`);
}

console.log('Finished generating page templates.');
