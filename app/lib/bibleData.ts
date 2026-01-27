export interface BibleBook {
    name: string;
    chapters: number;
    name_en?: string;
    name_pt?: string;
}

export const BIBLE_BOOKS: BibleBook[] = [
    // Old Testament
    { name: "Génesis", chapters: 50, name_en: "Genesis", name_pt: "Gênesis" },
    { name: "Éxodo", chapters: 40, name_en: "Exodus", name_pt: "Êxodo" },
    { name: "Levítico", chapters: 27, name_en: "Leviticus", name_pt: "Levítico" },
    { name: "Números", chapters: 36, name_en: "Numbers", name_pt: "Números" },
    { name: "Deuteronomio", chapters: 34, name_en: "Deuteronomy", name_pt: "Deuteronômio" },
    { name: "Josué", chapters: 24, name_en: "Joshua", name_pt: "Josué" },
    { name: "Jueces", chapters: 21, name_en: "Judges", name_pt: "Juízes" },
    { name: "Rut", chapters: 4, name_en: "Ruth", name_pt: "Rute" },
    { name: "1 Samuel", chapters: 31, name_en: "1 Samuel", name_pt: "1 Samuel" },
    { name: "2 Samuel", chapters: 24, name_en: "2 Samuel", name_pt: "2 Samuel" },
    { name: "1 Reyes", chapters: 22, name_en: "1 Kings", name_pt: "1 Reis" },
    { name: "2 Reyes", chapters: 25, name_en: "2 Kings", name_pt: "2 Reis" },
    { name: "1 Crónicas", chapters: 29, name_en: "1 Chronicles", name_pt: "1 Crônicas" },
    { name: "2 Crónicas", chapters: 36, name_en: "2 Chronicles", name_pt: "2 Crônicas" },
    { name: "Esdras", chapters: 10, name_en: "Ezra", name_pt: "Esdras" },
    { name: "Nehemías", chapters: 13, name_en: "Nehemiah", name_pt: "Neemias" },
    { name: "Ester", chapters: 10, name_en: "Esther", name_pt: "Ester" },
    { name: "Job", chapters: 42, name_en: "Job", name_pt: "Jó" },
    { name: "Salmos", chapters: 150, name_en: "Psalms", name_pt: "Salmos" },
    { name: "Proverbios", chapters: 31, name_en: "Proverbs", name_pt: "Provérbios" },
    { name: "Eclesiastés", chapters: 12, name_en: "Ecclesiastes", name_pt: "Eclesiastes" },
    { name: "Cantares", chapters: 8, name_en: "Song of Solomon", name_pt: "Cantares" },
    { name: "Isaías", chapters: 66, name_en: "Isaiah", name_pt: "Isaías" },
    { name: "Jeremías", chapters: 52, name_en: "Jeremiah", name_pt: "Jeremias" },
    { name: "Lamentaciones", chapters: 5, name_en: "Lamentations", name_pt: "Lamentações" },
    { name: "Ezequiel", chapters: 48, name_en: "Ezekiel", name_pt: "Ezequiel" },
    { name: "Daniel", chapters: 12, name_en: "Daniel", name_pt: "Daniel" },
    { name: "Oseas", chapters: 14, name_en: "Hosea", name_pt: "Oseias" },
    { name: "Joel", chapters: 3, name_en: "Joel", name_pt: "Joel" },
    { name: "Amós", chapters: 9, name_en: "Amos", name_pt: "Amós" },
    { name: "Abdías", chapters: 1, name_en: "Obadiah", name_pt: "Obadias" },
    { name: "Jonás", chapters: 4, name_en: "Jonah", name_pt: "Jonas" },
    { name: "Miqueas", chapters: 7, name_en: "Micah", name_pt: "Miqueias" },
    { name: "Nahúm", chapters: 3, name_en: "Nahum", name_pt: "Naum" },
    { name: "Habacuc", chapters: 3, name_en: "Habakkuk", name_pt: "Habacuque" },
    { name: "Sofonías", chapters: 3, name_en: "Zephaniah", name_pt: "Sofonias" },
    { name: "Hageo", chapters: 2, name_en: "Haggai", name_pt: "Ageu" },
    { name: "Zacarías", chapters: 14, name_en: "Zechariah", name_pt: "Zacarias" },
    { name: "Malaquías", chapters: 4, name_en: "Malachi", name_pt: "Malaquias" },
    // New Testament
    { name: "Mateo", chapters: 28, name_en: "Matthew", name_pt: "Mateus" },
    { name: "Marcos", chapters: 16, name_en: "Mark", name_pt: "Marcos" },
    { name: "Lucas", chapters: 24, name_en: "Luke", name_pt: "Lucas" },
    { name: "Juan", chapters: 21, name_en: "John", name_pt: "João" },
    { name: "Hechos", chapters: 28, name_en: "Acts", name_pt: "Atos" },
    { name: "Romanos", chapters: 16, name_en: "Romans", name_pt: "Romanos" },
    { name: "1 Corintios", chapters: 16, name_en: "1 Corinthians", name_pt: "1 Coríntios" },
    { name: "2 Corintios", chapters: 13, name_en: "2 Corinthians", name_pt: "2 Coríntios" },
    { name: "Gálatas", chapters: 6, name_en: "Galatians", name_pt: "Gálatas" },
    { name: "Efesios", chapters: 6, name_en: "Ephesians", name_pt: "Efésios" },
    { name: "Filipenses", chapters: 4, name_en: "Philippians", name_pt: "Filipenses" },
    { name: "Colosenses", chapters: 4, name_en: "Colossians", name_pt: "Colossenses" },
    { name: "1 Tesalonicenses", chapters: 5, name_en: "1 Thessalonians", name_pt: "1 Tessalonicenses" },
    { name: "2 Tesalonicenses", chapters: 3, name_en: "2 Thessalonians", name_pt: "2 Tessalonicenses" },
    { name: "1 Timoteo", chapters: 6, name_en: "1 Timothy", name_pt: "1 Timóteo" },
    { name: "2 Timoteo", chapters: 4, name_en: "2 Timothy", name_pt: "2 Timóteo" },
    { name: "Tito", chapters: 3, name_en: "Titus", name_pt: "Tito" },
    { name: "Filemón", chapters: 1, name_en: "Philemon", name_pt: "Filemom" },
    { name: "Hebreos", chapters: 13, name_en: "Hebrews", name_pt: "Hebreus" },
    { name: "Santiago", chapters: 5, name_en: "James", name_pt: "Tiago" },
    { name: "1 Pedro", chapters: 5, name_en: "1 Peter", name_pt: "1 Pedro" },
    { name: "2 Pedro", chapters: 3, name_en: "2 Peter", name_pt: "2 Pedro" },
    { name: "1 Juan", chapters: 5, name_en: "1 John", name_pt: "1 João" },
    { name: "2 Juan", chapters: 1, name_en: "2 John", name_pt: "2 João" },
    { name: "3 Juan", chapters: 1, name_en: "3 John", name_pt: "3 João" },
    { name: "Judas", chapters: 1, name_en: "Jude", name_pt: "Judas" },
    { name: "Apocalipsis", chapters: 22, name_en: "Revelation", name_pt: "Apocalipse" },
];

export const getBibleBookName = (book: BibleBook, language: string) => {
    if (language === 'en') return book.name_en || book.name;
    if (language === 'pt') return book.name_pt || book.name;
    return book.name;
};
