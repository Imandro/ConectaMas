export type BibleOrderChallenge = {
    id: string;
    title: string;
    items: { id: string; label: string }[];
    orderedIds: string[];
};

const challenge = (id: string, title: string, labels: string[]): BibleOrderChallenge => ({
    id,
    title,
    items: labels.map((label, index) => ({ id: `${id}-${index + 1}`, label })),
    orderedIds: labels.map((_, index) => `${id}-${index + 1}`),
});

export const bibleOrderChallenges: BibleOrderChallenge[] = [
    challenge("order-01", "Primeros libros", ["Génesis", "Éxodo", "Levítico", "Números"]),
    challenge("order-02", "Historia de Israel", ["Josué", "Jueces", "Rut", "1 Samuel"]),
    challenge("order-03", "Poesía y sabiduría", ["Job", "Salmos", "Proverbios", "Eclesiastés"]),
    challenge("order-04", "Profetas mayores", ["Isaías", "Jeremías", "Lamentaciones", "Ezequiel"]),
    challenge("order-05", "Profetas menores", ["Oseas", "Joel", "Amós", "Abdías"]),
    challenge("order-06", "Evangelios", ["Mateo", "Marcos", "Lucas", "Juan"]),
    challenge("order-07", "Iglesia naciente", ["Hechos", "Romanos", "1 Corintios", "2 Corintios"]),
    challenge("order-08", "Cartas paulinas", ["Gálatas", "Efesios", "Filipenses", "Colosenses"]),
    challenge("order-09", "Cartas breves", ["1 Tesalonicenses", "2 Tesalonicenses", "1 Timoteo", "2 Timoteo"]),
    challenge("order-10", "Cartas generales", ["Hebreos", "Santiago", "1 Pedro", "2 Pedro"]),
    challenge("order-11", "Últimas cartas", ["1 Juan", "2 Juan", "3 Juan", "Judas"]),
    challenge("order-12", "Cierre bíblico", ["Apocalipsis", "Génesis", "Éxodo", "Mateo"]),
];

