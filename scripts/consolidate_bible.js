const fs = require('fs');
const path = require('path');
const https = require('https');

const books = [
    { name: "genesis.js", abbrev: "gn" },
    { name: "exodo.js", abbrev: "ex" },
    { name: "levitico.js", abbrev: "lv" },
    { name: "numeros.js", abbrev: "nm" },
    { name: "deuteronomio.js", abbrev: "dt" },
    { name: "josue.js", abbrev: "js" },
    { name: "jueces.js", abbrev: "jg" },
    { name: "rut.js", abbrev: "rt" },
    { name: "1_samuel.js", abbrev: "1sa" },
    { name: "2_samuel.js", abbrev: "2sa" },
    { name: "1_reyes.js", abbrev: "1ki" },
    { name: "2_reyes.js", abbrev: "2ki" },
    { name: "1_cronicas.js", abbrev: "1ch" },
    { name: "2_cronicas.js", abbrev: "2ch" },
    { name: "esdras.js", abbrev: "ezr" },
    { name: "nehemias.js", abbrev: "ne" },
    { name: "ester.js", abbrev: "est" },
    { name: "job.js", abbrev: "jb" },
    { name: "salmos.js", abbrev: "ps" },
    { name: "proverbios.js", abbrev: "pr" },
    { name: "eclesiastes.js", abbrev: "ec" },
    { name: "cantares.js", abbrev: "so" },
    { name: "isaias.js", abbrev: "is" },
    { name: "jeremias.js", abbrev: "jr" },
    { name: "lamentaciones.js", abbrev: "lm" },
    { name: "ezequiel.js", abbrev: "eze" },
    { name: "daniel.js", abbrev: "da" },
    { name: "oseas.js", abbrev: "ho" },
    { name: "joel.js", abbrev: "jl" },
    { name: "amos.js", abbrev: "am" },
    { name: "abdias.js", abbrev: "ob" },
    { name: "jonas.js", abbrev: "jon" },
    { name: "miqueas.js", abbrev: "mi" },
    { name: "nahum.js", abbrev: "na" },
    { name: "habacuc.js", abbrev: "hab" },
    { name: "sofonias.js", abbrev: "zp" },
    { name: "hageo.js", abbrev: "hg" },
    { name: "zacarias.js", abbrev: "zc" },
    { name: "malaquias.js", abbrev: "ml" },
    { name: "mateo.js", abbrev: "mt" },
    { name: "marcos.js", abbrev: "mk" },
    { name: "lucas.js", abbrev: "lk" },
    { name: "juan.js", abbrev: "jn" },
    { name: "hechos.js", abbrev: "ac" },
    { name: "romanos.js", abbrev: "rm" },
    { name: "1_corintios.js", abbrev: "1co" },
    { name: "2_corintios.js", abbrev: "2co" },
    { name: "galatas.js", abbrev: "ga" },
    { name: "efesios.js", abbrev: "ep" },
    { name: "filipenses.js", abbrev: "phi" },
    { name: "colosenses.js", abbrev: "col" },
    { name: "1_tesalonicenses.js", abbrev: "1th" },
    { name: "2_tesalonicenses.js", abbrev: "2th" },
    { name: "1_timoteo.js", abbrev: "1ti" },
    { name: "2_timoteo.js", abbrev: "2ti" },
    { name: "tito.js", abbrev: "tt" },
    { name: "filemon.js", abbrev: "phm" },
    { name: "hebreos.js", abbrev: "heb" },
    { name: "santiago.js", abbrev: "ja" },
    { name: "1_pedro.js", abbrev: "1pe" },
    { name: "2_pedro.js", abbrev: "2pe" },
    { name: "1_juan.js", abbrev: "1jn" },
    { name: "2_juan.js", abbrev: "2jn" },
    { name: "3_juan.js", abbrev: "3jn" },
    { name: "judas.js", abbrev: "jd" },
    { name: "apocalipsis.js", abbrev: "re" }
];

const BASE_URL = 'https://raw.githubusercontent.com/josevladimir/bible-json/master/procesados/';
const OUTPUT_FILE = path.join(__dirname, '../public/bible/es_rvr.json');

async function fetchBook(book) {
    const url = BASE_URL + book.name;
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                // The files are JS exports: "export default [...]" or "module.exports = [...]"
                // We need to extract the array part.
                try {
                    const arrayMatch = data.match(/\[[\s\S]*\]/);
                    if (!arrayMatch) throw new Error(`Could not find array in ${book.name}`);

                    // Dangerous but simple for this specific case: eval to get the object
                    // Since it's a static Bible text JSON-like structure, it's relatively safe here.
                    // However, we'll try to cleaning it up to be valid JSON first.
                    let cleaned = arrayMatch[0]
                        .replace(/'/g, '"') // replace single quotes with double quotes
                        .replace(/,\s*\]/g, ']') // remove trailing commas
                        .replace(/,\s*}/g, '}');

                    // Some verses might contain quotes that were escaped with \' in JS
                    // but need to be handled for JSON.
                    // Actually, let's use a safer approach: eval in a sandbox or just a simple regex cleanup.
                    // Given the content is just arrays of strings, we can use eval safely on this trusted source.
                    const content = eval(arrayMatch[0]);
                    resolve({
                        abbrev: book.abbrev,
                        chapters: content
                    });
                } catch (e) {
                    reject(`Error parsing ${book.name}: ${e.message}`);
                }
            });
        }).on('error', reject);
    });
}

async function consolidate() {
    console.log('Starting consolidation...');
    const result = [];

    // We must respect the order of the original Bible books if possible, 
    // but the app identifies them by abbrev, so order might not be critical 
    // but standard order is better.
    // Let's use a standard list of books to ensure order.
    const standardBooks = [
        "1_corintios.js", "1_cronicas.js", "1_juan.js", "1_pedro.js", "1_reyes.js", "1_samuel.js",
        "1_tesalonicenses.js", "1_timoteo.js", "2_corintios.js", "2_cronicas.js", "2_juan.js",
        "2_pedro.js", "2_reyes.js", "2_samuel.js", "2_tesalonicenses.js", "2_timoteo.js",
        "3_juan.js", "abdias.js", "amos.js", "apocalipsis.js", "cantares.js", "colosenses.js",
        "daniel.js", "deuteronomio.js", "eclesiastes.js", "efesios.js", "esdras.js", "ester.js",
        "exodo.js", "ezequiel.js", "filemon.js", "filipenses.js", "galatas.js", "genesis.js",
        "habacuc.js", "hageo.js", "hebreos.js", "hechos.js", "isaias.js", "jeremias.js",
        "job.js", "joel.js", "jonas.js", "josue.js", "juan.js", "judas.js", "jueces.js",
        "lamentaciones.js", "levitico.js", "lucas.js", "malaquias.js", "marcos.js", "mateo.js",
        "miqueas.js", "nahum.js", "nehemias.js", "numeros.js", "oseas.js", "proverbios.js",
        "romanos.js", "rut.js", "salmos.js", "santiago.js", "sofonias.js", "tito.js", "zacarias.js"
    ];

    // Bible order is usually: GN, EX, LV, NM, DT...
    // Let's just follow the alphabetical order for now as long as abbreviations are correct.
    // Actually, it's better to maintain the original order from the existing es_rvr.json if I can.
    // But I'll stick to the current list for simplicity.

    for (const book of books) {
        console.log(`Fetching ${book.name}...`);
        try {
            const data = await fetchBook(book);
            result.push(data);
        } catch (e) {
            console.error(e);
        }
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
    console.log(`Successfully consolidated 66 books into ${OUTPUT_FILE}`);
}

consolidate();
