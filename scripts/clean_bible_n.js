const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'public', 'bible', 'es_rvr.json');

try {
    let data = fs.readFileSync(filePath, 'utf8');

    // Check count before
    const countBefore = (data.match(/\/n/g) || []).length;
    console.log(`Found ${countBefore} occurrences of /n before cleanup.`);

    // Replace /n with empty string
    // logic: global replace of literal "/n"
    const cleanedData = data.replace(/\/n/g, '');

    // Check count after
    const countAfter = (cleanedData.match(/\/n/g) || []).length;
    console.log(`Found ${countAfter} occurrences of /n after cleanup.`);

    if (countBefore > 0) {
        fs.writeFileSync(filePath, cleanedData, 'utf8');
        console.log('File updated successfully.');
    } else {
        console.log('No changes needed.');
    }

} catch (err) {
    console.error('Error processing file:', err);
}
