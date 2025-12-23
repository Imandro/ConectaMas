const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'public', 'bible', 'es_rvr.json');

try {
    const data = fs.readFileSync(filePath, 'utf8');
    const books = JSON.parse(data);

    let printed = 0;

    books.forEach((book, bIdx) => {
        if (printed > 5) return;
        book.chapters.forEach((chapter, cIdx) => {
            if (printed > 5) return;
            chapter.forEach((verse, vIdx) => {
                const idx = verse.indexOf('/n');
                if (idx !== -1 && printed < 5) {
                    const start = Math.max(0, idx - 10);
                    const end = Math.min(verse.length, idx + 12);
                    console.log(`Context: "...${verse.substring(start, end).replace(/\n/g, '\\n')}..."`);
                    printed++;
                }
            });
        });
    });

} catch (err) {
    console.error(err);
}
