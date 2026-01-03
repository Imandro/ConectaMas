export interface Challenge {
    id: string;
    type: 'VERSE' | 'TRUTH';
    question: string;
    options: string[];
    answer: string;
}

export const challengeData: Challenge[] = [
    {
        id: 'v1',
        type: 'VERSE',
        question: 'El __ es mi pastor, nada me faltará.',
        options: ['Señor', 'Dios', 'Rey', 'Padre'],
        answer: 'Señor'
    },
    {
        id: 'v2',
        type: 'VERSE',
        question: 'Todo lo puedo en __ que me fortalece.',
        options: ['Jesús', 'Dios', 'Cristo', 'Espíritu'],
        answer: 'Cristo'
    },
    {
        id: 'v3',
        type: 'VERSE',
        question: 'Lámpara es a mis pies tu __.',
        options: ['voz', 'luz', 'palabra', 'verdad'],
        answer: 'palabra'
    },
    {
        id: 'v4',
        type: 'VERSE',
        question: 'Jehová es mi __ y mi salvación.',
        options: ['roca', 'fuerza', 'luz', 'amparo'],
        answer: 'luz'
    },
    {
        id: 'v5',
        type: 'VERSE',
        question: 'Dios es nuestro __ y fortaleza.',
        options: ['amparo', 'refugio', 'castillo', 'guía'],
        answer: 'amparo'
    },
    {
        id: 't1',
        type: 'TRUTH',
        question: '¿Qué dice Dios sobre tu pasado?',
        options: ['Me juzga', 'Me condena', 'Me perdonó', 'Me ignora'],
        answer: 'Me perdonó'
    },
    {
        id: 't2',
        type: 'TRUTH',
        question: '¿Cómo te ve Dios?',
        options: ['Como pecador', 'Como hijo', 'Como siervo', 'Como extraño'],
        answer: 'Como hijo'
    }
];
