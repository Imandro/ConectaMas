const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/lib/versesData.ts');

try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Extract the array content using a regex that captures everything between `export const verses: Verse[] = [` and `];`
    const match = content.match(/export const verses: Verse\[\] = \[([\s\S]*?)\];/);

    if (!match) {
        console.error("Could not find verses array.");
        process.exit(1);
    }

    const arrayContent = match[1];

    // Split by lines that look like `{ text: ... },`
    // This is a bit fragile if formatting changes, but works for the current file structure where each verse is on a line
    const versesLines = arrayContent.trim().split('\n').filter(line => line.trim().startsWith('{ text:'));

    console.log(`Found ${versesLines.length} verses.`);

    // Shuffle using Fisher-Yates
    for (let i = versesLines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [versesLines[i], versesLines[j]] = [versesLines[j], versesLines[i]];
    }

    const newArrayContent = '\n    ' + versesLines.map(line => line.trim()).join('\n    ') + '\n';

    const newFileContent = content.replace(match[1], newArrayContent);

    fs.writeFileSync(filePath, newFileContent, 'utf8');
    console.log('Successfully shuffled verses.');

} catch (err) {
    console.error("Error:", err);
    process.exit(1);
}
