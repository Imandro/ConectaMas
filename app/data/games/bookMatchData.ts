export interface BookMatchItem {
    id: number;
    book: string;
    category: string;
}

export interface BookMatchQuestion {
    id: number;
    books: BookMatchItem[];
    options: string[];
}

export const bookMatchData: BookMatchQuestion[] = [
    {
        id: 1,
        books: [
            { id: 1, book: "Génesis", category: "Ley" },
            { id: 2, book: "Éxodo", category: "Ley" },
            { id: 3, book: "Josué", category: "Historia" },
            { id: 4, book: "Jueces", category: "Historia" },
        ],
        options: ["Ley", "Historia", "Poesía", "Profecía"],
    },
    {
        id: 2,
        books: [
            { id: 5, book: "Salmos", category: "Poesía" },
            { id: 6, book: "Proverbios", category: "Poesía" },
            { id: 7, book: "Isaías", category: "Profecía" },
            { id: 8, book: "Jeremías", category: "Profecía" },
        ],
        options: ["Ley", "Historia", "Poesía", "Profecía"],
    },
    {
        id: 3,
        books: [
            { id: 9, book: "Mateo", category: "Evangelio" },
            { id: 10, book: "Marcos", category: "Evangelio" },
            { id: 11, book: "Hechos", category: "Historia NT" },
            { id: 12, book: "Romanos", category: "Epístola" },
        ],
        options: ["Evangelio", "Historia NT", "Epístola", "Profecía NT"],
    },
    {
        id: 4,
        books: [
            { id: 13, book: "Levítico", category: "Ley" },
            { id: 14, book: "Rut", category: "Historia" },
            { id: 15, book: "Job", category: "Poesía" },
            { id: 16, book: "Daniel", category: "Profecía" },
        ],
        options: ["Ley", "Historia", "Poesía", "Profecía"],
    },
    {
        id: 5,
        books: [
            { id: 17, book: "Efesios", category: "Epístola" },
            { id: 18, book: "Gálatas", category: "Epístola" },
            { id: 19, book: "Apocalipsis", category: "Profecía NT" },
            { id: 20, book: "Lucas", category: "Evangelio" },
        ],
        options: ["Evangelio", "Epístola", "Profecía NT", "Historia NT"],
    },
    {
        id: 6,
        books: [
            { id: 21, book: "1 Samuel", category: "Historia" },
            { id: 22, book: "2 Samuel", category: "Historia" },
            { id: 23, book: "Eclesiastés", category: "Poesía" },
            { id: 24, book: "Oseas", category: "Profecía" },
        ],
        options: ["Ley", "Historia", "Poesía", "Profecía"],
    },
    {
        id: 7,
        books: [
            { id: 25, book: "1 Corintios", category: "Epístola" },
            { id: 26, book: "2 Corintios", category: "Epístola" },
            { id: 27, book: "1 Pedro", category: "Epístola" },
            { id: 28, book: "Santiago", category: "Epístola" },
        ],
        options: ["Evangelio", "Epístola", "Profecía NT", "Historia NT"],
    },
    {
        id: 8,
        books: [
            { id: 29, book: "Números", category: "Ley" },
            { id: 30, book: "Deuteronomio", category: "Ley" },
            { id: 31, book: "1 Reyes", category: "Historia" },
            { id: 32, book: "2 Reyes", category: "Historia" },
        ],
        options: ["Ley", "Historia", "Poesía", "Profecía"],
    },
    {
        id: 9,
        books: [
            { id: 33, book: "Juan", category: "Evangelio" },
            { id: 34, book: "1 Tesalonicenses", category: "Epístola" },
            { id: 35, book: "2 Tesalonicenses", category: "Epístola" },
            { id: 36, book: "Filipenses", category: "Epístola" },
        ],
        options: ["Evangelio", "Epístola", "Profecía NT", "Historia NT"],
    },
    {
        id: 10,
        books: [
            { id: 37, book: "Esdras", category: "Historia" },
            { id: 38, book: "Nehemías", category: "Historia" },
            { id: 39, book: "Cantares", category: "Poesía" },
            { id: 40, book: "Ezequiel", category: "Profecía" },
        ],
        options: ["Ley", "Historia", "Poesía", "Profecía"],
    },
    {
        id: 11,
        books: [
            { id: 41, book: "Colosenses", category: "Epístola" },
            { id: 42, book: "1 Timoteo", category: "Epístola" },
            { id: 43, book: "2 Timoteo", category: "Epístola" },
            { id: 44, book: "Tito", category: "Epístola" },
        ],
        options: ["Evangelio", "Epístola", "Profecía NT", "Historia NT"],
    },
    {
        id: 12,
        books: [
            { id: 45, book: "Amós", category: "Profecía" },
            { id: 46, book: "Miqueas", category: "Profecía" },
            { id: 47, book: "Habacuc", category: "Profecía" },
            { id: 48, book: "Zacarías", category: "Profecía" },
        ],
        options: ["Ley", "Historia", "Poesía", "Profecía"],
    },
];
