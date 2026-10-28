const templates = [
    ['Fe', 'Padre celestial, aumenta mi fe hoy. Ayúdame a confiar en ti incluso cuando no veo el camino. Que mi fe no se base en circunstancias, sino en tu fidelidad eterna. En el nombre de Jesús, Amén.'],
    ['Esperanza', 'Señor de esperanza, llena mi corazón de tu paz. Cuando todo parezca oscuro, recuérdame que tú eres mi luz. Que mi esperanza esté anclada en tus promesas que nunca fallan. Amén.'],
    ['Amor', 'Dios de amor, enséñame a amar como tú amas. Que tu amor fluya a través de mí hacia otros. Ayúdame a perdonar, a ser paciente y a mostrar compasión. En tu nombre, Amén.'],
    ['Perdón', 'Padre misericordioso, gracias por tu perdón inmerecido. Ayúdame a perdonar a quienes me han herido, así como tú me has perdonado. Libera mi corazón de resentimiento. Amén.'],
    ['Fuerza', 'Señor todopoderoso, dame fuerzas para enfrentar este día. Cuando me sienta débil, recuérdame que tu poder se perfecciona en mi debilidad. Sé mi fortaleza y mi refugio. Amén.'],
    ['Paz', 'Príncipe de paz, calma las tormentas de mi corazón. Que tu paz que sobrepasa todo entendimiento guarde mi mente y mis pensamientos. En medio del caos, tú eres mi paz. Amén.'],
    ['Sabiduría', 'Dios de sabiduría, guíame en todas mis decisiones. Dame discernimiento para conocer tu voluntad. Que tu Palabra ilumine mi camino y dirija mis pasos. En Cristo, Amén.'],
    ['Gratitud', 'Padre bueno, gracias por tus bendiciones diarias. Ayúdame a tener un corazón agradecido en toda circunstancia. Que nunca olvide tu fidelidad y tu amor constante. Amén.'],
    ['Protección', 'Señor mi protector, cúbreme bajo tus alas. Guárdame del mal y de toda tentación. Que tus ángeles acampen alrededor de mí y de mis seres queridos. Amén.'],
    ['Sanidad', 'Dios sanador, toca mi cuerpo, mente y espíritu. Restaura lo que está quebrantado y sana mis heridas. Confío en tu poder sanador y en tu amor restaurador. Amén.'],
    ['Provisión', 'Jehová Jireh, mi proveedor, confío en que suplirás todas mis necesidades. Ayúdame a no afanarme, sino a buscar primero tu reino. Gracias por tu fidelidad. Amén.'],
    ['Paciencia', 'Señor paciente, enséñame a esperar en tu tiempo perfecto. Dame paciencia en las pruebas y en las relaciones. Que aprenda a descansar en tu soberanía. Amén.'],
] as const;

const templatesRo = [
    ['Credință', 'Tată ceresc, mărește-mi credința astăzi. Ajută-mă să mă încred în Tine chiar și atunci când nu văd drumul. Fie ca credința mea să se sprijine pe credincioșia Ta veșnică. În numele lui Isus, amin.'],
    ['Speranță', 'Doamne al speranței, umple-mi inima cu pacea Ta. Când totul pare întunecat, amintește-mi că Tu ești lumina mea. Fie ca speranța mea să fie ancorată în promisiunile Tale. Amin.'],
    ['Dragoste', 'Dumnezeule al dragostei, învață-mă să iubesc așa cum iubești Tu. Ajută-mă să iert, să am răbdare și să arăt compasiune. În numele Tău, amin.'],
    ['Iertare', 'Tată milostiv, îți mulțumesc pentru iertarea Ta nemeritată. Ajută-mă să îi iert pe cei care m-au rănit și eliberează-mi inima de resentimente. Amin.'],
    ['Putere', 'Doamne atotputernic, dă-mi putere pentru această zi. Când mă simt slab, amintește-mi că puterea Ta se desăvârșește în slăbiciunea mea. Fii tăria și adăpostul meu. Amin.'],
    ['Pace', 'Prinț al păcii, liniștește furtunile inimii mele. Păzește-mi mintea cu pacea Ta care întrece orice înțelegere. În mijlocul haosului, Tu ești pacea mea. Amin.'],
    ['Înțelepciune', 'Dumnezeule al înțelepciunii, călăuzește-mă în toate deciziile. Dă-mi discernământ pentru a cunoaște voia Ta. În Hristos, amin.'],
    ['Recunoștință', 'Tată bun, îți mulțumesc pentru binecuvântările zilnice. Ajută-mă să am o inimă recunoscătoare în orice împrejurare. Amin.'],
    ['Protecție', 'Doamne, protectorul meu, acoperă-mă sub aripile Tale. Păzește-mă de rău și de ispită și pe cei dragi ai mei. Amin.'],
    ['Vindecare', 'Dumnezeule vindecător, atinge-mi trupul, mintea și spiritul. Restaurează ce este frânt și vindecă-mi rănile. Mă încred în puterea și dragostea Ta. Amin.'],
    ['Purtare de grijă', 'Iehova-Iire, furnizorul meu, mă încred că îmi vei împlini nevoile. Ajută-mă să caut mai întâi Împărăția Ta. Îți mulțumesc pentru credincioșie. Amin.'],
    ['Răbdare', 'Doamne răbdător, învață-mă să aștept timpul Tău perfect. Dă-mi răbdare în încercări și relații și ajută-mă să mă odihnesc în suveranitatea Ta. Amin.'],
] as const;

export function getDailyPrayerForDate(date = new Date(), language: 'es' | 'en' | 'pt' | 'ro' = 'es') {
    const start = new Date(date.getFullYear(), 0, 0).getTime();
    const dayOfYear = Math.min(365, Math.max(1, Math.floor((date.getTime() - start) / 86400000)));
    const selectedTemplates = language === 'ro' ? templatesRo : templates;
    const [theme, content] = selectedTemplates[(dayOfYear - 1) % selectedTemplates.length];
    const title = language === 'ro' ? `Rugăciunea zilei ${dayOfYear}` : `Oración del día ${dayOfYear}`;
    return { id: `local-${dayOfYear}`, dayOfYear, title, theme, content };
}
