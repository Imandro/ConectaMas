export type CharacterEvent = {
    id: string;
    character: string;
    event: string;
    hint: string;
};

export const characterEvents: CharacterEvent[] = [
    { id: "character-01", character: "Noé", event: "Construyó el arca", hint: "Dios le pidió preparar un refugio para el diluvio." },
    { id: "character-02", character: "Moisés", event: "Abrió el mar Rojo", hint: "Guio al pueblo fuera de Egipto." },
    { id: "character-03", character: "David", event: "Venció a Goliat", hint: "Usó una honda y cinco piedras." },
    { id: "character-04", character: "Ester", event: "Intercedió por su pueblo", hint: "Fue reina y actuó con valentía." },
    { id: "character-05", character: "Daniel", event: "Sobrevivió al foso de los leones", hint: "Siguió orando aun bajo una prohibición." },
    { id: "character-06", character: "Rut", event: "Acompañó a Noemí", hint: "Su lealtad la llevó a Belén." },
    { id: "character-07", character: "Pedro", event: "Caminó sobre el agua", hint: "Salió de la barca al encuentro de Jesús." },
    { id: "character-08", character: "María", event: "Recibió el anuncio del nacimiento de Jesús", hint: "Respondió con humildad al ángel." },
    { id: "character-09", character: "Pablo", event: "Predicó a las naciones", hint: "Antes perseguía a la iglesia." },
    { id: "character-10", character: "Josué", event: "Guió al pueblo a la tierra prometida", hint: "Sucedió a Moisés como líder." },
    { id: "character-11", character: "José", event: "Interpretó sueños en Egipto", hint: "Sus hermanos lo vendieron, pero Dios lo levantó." },
    { id: "character-12", character: "Jonás", event: "Predicó en Nínive", hint: "Aprendió a obedecer después de huir." },
];

