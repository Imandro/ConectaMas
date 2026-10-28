import { LEGAL_CONTACT_EMAIL, LEGAL_EFFECTIVE_DATE, LEGAL_OPERATOR, type LegalDocument, type LegalLocale } from '@/app/lib/legal/policy';

export type LegalSection = { title: string; body?: string; bullets?: string[] };
export type LegalDocumentContent = { title: string; intro: string; sections: LegalSection[] };
export type RenderLocale = LegalLocale | 'ro';

const contact = `Operador: ${LEGAL_OPERATOR}. Contacto: ${LEGAL_CONTACT_EMAIL}. Versión: ${LEGAL_EFFECTIVE_DATE}.`;
const contactRo = `Operator: ${LEGAL_OPERATOR}. Contact: ${LEGAL_CONTACT_EMAIL}. Versiune: ${LEGAL_EFFECTIVE_DATE}.`;

const docs = (language: RenderLocale): Record<LegalDocument, LegalDocumentContent> => {
  if (language === 'en') return {
    TERMS: { title: 'Terms and conditions', intro: 'Conecta+ provides spiritual support, community and growth tools. This is a technical draft requiring local legal review.', sections: [
      { title: 'Service and age', body: 'You must be at least 13 and live in an enabled country. Countries with higher local requirements remain blocked pending review.' },
      { title: 'Community', body: 'You keep rights to your content and grant a limited license to host and display it in the service.', bullets: ['No hate, harassment, threats or discrimination.', 'No explicit sexual content or child exploitation.', 'No self-harm instructions, spam, fraud or impersonation.'] },
      { title: 'SOS and limits', body: 'The app is not medical, psychological, legal or emergency care. Contact local emergency services for immediate danger.' },
      { title: 'Payments', body: 'Premium is separate from voluntary support. PayPal, Pagadito and Google Play process payments under confirmed provider status. Review the refund policy.' },
      { title: 'Contact', body: contact },
    ] },
    PRIVACY: { title: 'Privacy policy', intro: 'This policy explains data use, providers and rights.', sections: [
      { title: 'Data', bullets: ['Account: name, username, email, encrypted password, age and country.', 'Spiritual and wellbeing data: status, goals, check-ins, journal, prayer and SOS.', 'Community content: posts, replies, questions and prayer requests.', 'Operations: push notifications, device, sessions, security and technical logs.', 'Payments: provider, product, amount, status and minimum references; never cards, CVV or secrets.'] },
      { title: 'Use and providers', body: 'We use data to provide the service, secure accounts, support users, meet obligations and process payments. Providers apply their own policies.' },
      { title: 'Local storage', body: 'Preferences, static content and offline data may use localStorage, IndexedDB and a service worker. Private offline data is removed when the account is deleted on this device.' },
      { title: 'Rights and retention', body: `Request access, correction, export or deletion at ${LEGAL_CONTACT_EMAIL}. Data is retained while the account exists, subject to minimum legal retention.` },
      { title: 'Transfers and minors', body: 'Data may be processed outside your country with reasonable safeguards. Spiritual data is not used for advertising. Registration below 13 is not allowed.' },
    ] },
    COOKIES: { title: 'Cookies and storage policy', intro: 'We use necessary technologies and choices selected by the user.', sections: [
      { title: 'Necessary', body: 'Session and security cookies enable authentication. Language and consent preferences are stored to honor your choices.' },
      { title: 'Analytics', body: 'Vercel Analytics loads only after analytics consent. The app works if you decline.' },
      { title: 'No third-party ads', body: 'We do not claim or load AdMob or AdSense. Any future change requires an updated policy and required consent.' },
      { title: 'Offline data', body: 'localStorage, IndexedDB and a service worker may keep preferences and offline content.' },
    ] },
    REFUNDS: { title: 'Payments and refunds', intro: 'Premium and voluntary support are separate flows.', sections: [
      { title: 'Provider', body: 'PayPal, Pagadito or Google Play display charges and apply their payment, cancellation and refund rules. Conecta+ does not store card data.' },
      { title: 'Premium', body: 'Cancel renewal with the provider. Cancellation prevents the next charge and may preserve access through the paid period.' },
      { title: 'Support', body: 'Voluntary support does not buy Premium or unlock features. Request refunds from the provider based on confirmed status.' },
      { title: 'Support contact', body: `Write to ${LEGAL_CONTACT_EMAIL} with provider, product, date and amount. Never send card numbers, CVV or passwords.` },
    ] },
    COMMUNITY: { title: 'Community rules', intro: 'The community must be safe, respectful and useful.', sections: [
      { title: 'Not allowed', bullets: ['Hate, harassment, threats, doxxing or discrimination.', 'Explicit sexual content, exploitation or sexual contact with minors.', 'Self-harm instructions, violence threats or fraud.', 'Spam, unauthorized advertising, malware or impersonation.'] },
      { title: 'Posting', body: 'Post only content you may share. Anonymous mode hides your name from users but does not remove accountability or security records.' },
      { title: 'Reports', body: `Report through the visible community link or write to ${LEGAL_CONTACT_EMAIL}. Include URL, reason and context.` },
    ] },
    AGE_GATE: { title: 'Age and regional access notice', intro: 'Conecta+ applies a base minimum age of 13.', sections: [
      { title: 'Access rule', body: 'Registration requires age and country. Unknown countries and OTHER are blocked. Countries with higher local requirements remain blocked pending review.' },
      { title: 'Minors', body: 'Verified parental consent is not built in this phase. A parent or guardian should handle purchases when required.' },
      { title: 'Contact', body: `Current version: ${LEGAL_EFFECTIVE_DATE}. Questions: ${LEGAL_CONTACT_EMAIL}.` },
    ] },
  };
  if (language === 'ro') return {
    TERMS: { title: 'Termeni și condiții', intro: 'Conecta+ oferă sprijin spiritual, comunitate și instrumente de creștere. Acest text este un proiect tehnic și necesită revizuire juridică locală.', sections: [
      { title: 'Serviciu și vârstă', body: 'Trebuie să ai cel puțin 13 ani și să locuiești într-o țară activată. Țările cu cerințe locale mai stricte rămân blocate până la revizuire.' },
      { title: 'Comunitate', body: 'Păstrezi drepturile asupra conținutului tău și acorzi o licență limitată pentru găzduirea și afișarea lui în serviciu.', bullets: ['Fără ură, hărțuire, amenințări sau discriminare.', 'Fără conținut sexual explicit sau exploatarea copiilor.', 'Fără instrucțiuni de autovătămare, spam, fraudă sau uzurparea identității.'] },
      { title: 'SOS și limite', body: 'Aplicația nu înlocuiește îngrijirea medicală, psihologică, juridică sau serviciile de urgență. În pericol imediat, contactează serviciile locale.' },
      { title: 'Plăți', body: 'Premium este separat de sprijinul voluntar. PayPal, Pagadito și Google Play procesează plățile conform statutului confirmat al furnizorului.' },
      { title: 'Contact', body: contactRo },
    ] },
    PRIVACY: { title: 'Politica de confidențialitate', intro: 'Această politică explică utilizarea datelor, furnizorii și drepturile tale.', sections: [
      { title: 'Date', bullets: ['Cont: nume, utilizator, email, parolă criptată, vârstă și țară.', 'Date spirituale și de stare: statut, obiective, check-in-uri, jurnal, rugăciune și SOS.', 'Conținut comunitar: postări, răspunsuri, întrebări și cereri de rugăciune.', 'Operațiuni: notificări push, dispozitiv, sesiuni, securitate și jurnale tehnice.', 'Plăți: furnizor, produs, sumă, statut și referințe minime; niciodată carduri, CVV sau secrete.'] },
      { title: 'Utilizare și furnizori', body: 'Folosim datele pentru a furniza serviciul, a securiza conturile, a sprijini utilizatorii, a respecta obligațiile și a procesa plățile. Furnizorii aplică propriile politici.' },
      { title: 'Stocare locală', body: 'Preferințele, conținutul static și datele offline pot folosi localStorage, IndexedDB și un service worker. Datele private offline sunt eliminate când contul este șters de pe acest dispozitiv.' },
      { title: 'Drepturi și păstrare', body: `Solicită acces, corectare, export sau ștergere la ${LEGAL_CONTACT_EMAIL}. Datele sunt păstrate cât timp există contul, sub rezerva păstrării legale minime.` },
      { title: 'Transferuri și minori', body: 'Datele pot fi procesate în afara țării tale cu măsuri de protecție rezonabile. Datele spirituale nu sunt folosite pentru publicitate. Înregistrarea sub 16 ani nu este permisă în România.' },
    ] },
    COOKIES: { title: 'Politica privind cookie-urile și stocarea', intro: 'Folosim tehnologii necesare și opțiunile alese de utilizator.', sections: [
      { title: 'Necesare', body: 'Cookie-urile de sesiune și securitate permit autentificarea. Preferințele de limbă și consimțământ sunt stocate pentru a respecta alegerile tale.' },
      { title: 'Analiză', body: 'Vercel Analytics se încarcă doar după consimțământul pentru analiză. Aplicația funcționează și dacă refuzi.' },
      { title: 'Fără reclame terțe', body: 'Nu declarăm și nu încărcăm AdMob sau AdSense. Orice schimbare necesită o politică actualizată și consimțământul cerut.' },
      { title: 'Date offline', body: 'localStorage, IndexedDB și un service worker pot păstra preferințe și conținut offline.' },
    ] },
    REFUNDS: { title: 'Plăți și rambursări', intro: 'Premium și sprijinul voluntar sunt fluxuri separate.', sections: [
      { title: 'Furnizor', body: 'PayPal, Pagadito sau Google Play afișează taxele și aplică regulile proprii. Conecta+ nu stochează datele cardului.' },
      { title: 'Premium', body: 'Anulează reînnoirea la furnizor. Anularea previne următoarea plată și poate păstra accesul până la sfârșitul perioadei plătite.' },
      { title: 'Sprijin', body: 'Sprijinul voluntar nu cumpără Premium și nu deblochează funcții. Cere rambursarea de la furnizor pe baza statutului confirmat.' },
      { title: 'Contact suport', body: `Scrie la ${LEGAL_CONTACT_EMAIL} cu furnizorul, produsul, data și suma. Nu trimite niciodată numere de card, CVV sau parole.` },
    ] },
    COMMUNITY: { title: 'Regulile comunității', intro: 'Comunitatea trebuie să fie sigură, respectuoasă și utilă.', sections: [
      { title: 'Interzis', bullets: ['Ură, hărțuire, amenințări, doxxing sau discriminare.', 'Conținut sexual explicit, exploatare sau contact sexual cu minori.', 'Instrucțiuni de autovătămare, amenințări cu violența sau fraudă.', 'Spam, publicitate neautorizată, malware sau uzurparea identității.'] },
      { title: 'Postare', body: 'Publică doar conținut pe care ai dreptul să îl distribui. Modul anonim ascunde numele pentru utilizatori, dar nu elimină responsabilitatea sau înregistrările de securitate.' },
      { title: 'Raportări', body: `Raportează prin linkul vizibil din comunitate sau scrie la ${LEGAL_CONTACT_EMAIL}. Include URL-ul, motivul și contextul.` },
    ] },
    AGE_GATE: { title: 'Notificare privind vârsta și accesul regional', intro: 'Conecta+ aplică în România o vârstă minimă de 16 ani.', sections: [
      { title: 'Regula accesului', body: 'Înregistrarea necesită vârsta și țara. Țările necunoscute și OTHER sunt blocate. Țările cu cerințe locale mai stricte rămân blocate până la revizuire.' },
      { title: 'Minori', body: 'Consimțământul parental verificat nu este inclus în această etapă. Un părinte sau tutore trebuie să gestioneze achizițiile când este necesar.' },
      { title: 'Contact', body: `Versiunea actuală: ${LEGAL_EFFECTIVE_DATE}. Întrebări: ${LEGAL_CONTACT_EMAIL}.` },
    ] },
  };
  if (language === 'pt') return {
    TERMS: { title: 'Termos e condições', intro: 'Conecta+ oferece apoio espiritual, comunidade e ferramentas de crescimento. Este texto é um rascunho técnico e precisa de revisão jurídica local.', sections: [
      { title: 'Serviço e idade', body: 'Você deve ter pelo menos 13 anos e morar em país habilitado. Países com exigência maior ficam bloqueados até revisão.' },
      { title: 'Comunidade', body: 'Você mantém os direitos do conteúdo e concede licença limitada para hospedagem e exibição no serviço.', bullets: ['Não são permitidos ódio, assédio, ameaças ou discriminação.', 'Não publique conteúdo sexual explícito ou exploração infantil.', 'Não publique instruções de automutilação, spam, fraude ou identidade falsa.'] },
      { title: 'SOS e limites', body: 'O app não substitui atendimento médico, psicológico, jurídico ou emergencial. Em perigo imediato, procure os serviços locais.' },
      { title: 'Pagamentos', body: 'Premium é separado de apoios voluntários. PayPal, Pagadito e Google Play processam pagamentos conforme o status confirmado.' },
      { title: 'Contato', body: contact },
    ] },
    PRIVACY: { title: 'Política de privacidade', intro: 'Explica os dados usados, provedores e direitos.', sections: [
      { title: 'Dados', bullets: ['Conta: nome, usuário, email, senha criptografada, idade e país.', 'Dados espirituais: estado, metas, check-ins, diário, oração e SOS.', 'Comunidade: publicações, respostas, perguntas e pedidos de oração.', 'Operação: notificações push, dispositivo, sessões, segurança e registros técnicos.', 'Pagamentos: provedor, produto, valor, status e referências mínimas; nunca cartões, CVV ou segredos.'] },
      { title: 'Uso e provedores', body: 'Usamos dados para prestar o serviço, proteger contas, atender suporte, cumprir obrigações e processar pagamentos. Provedores aplicam suas próprias políticas.' },
      { title: 'Armazenamento local', body: 'Preferências e dados offline podem usar localStorage, IndexedDB e service worker. Dados privados offline são removidos ao excluir a conta neste dispositivo.' },
      { title: 'Direitos', body: `Solicite acesso, correção, exportação ou exclusão em ${LEGAL_CONTACT_EMAIL}. Retemos dados enquanto a conta existir, salvo retenção legal mínima.` },
      { title: 'Transferências e menores', body: 'Os dados podem ser processados fora do seu país com salvaguardas razoáveis. Dados espirituais não são usados para publicidade. Registro abaixo de 13 anos não é permitido.' },
    ] },
    COOKIES: { title: 'Política de cookies e armazenamento', intro: 'Usamos tecnologias necessárias e preferências escolhidas pela pessoa usuária.', sections: [
      { title: 'Necessários', body: 'Cookies de sessão e segurança permitem autenticação. Preferências de idioma e consentimento são armazenadas para respeitar suas escolhas.' },
      { title: 'Análise', body: 'Vercel Analytics carrega somente após consentimento de análise. O app funciona se você recusar.' },
      { title: 'Sem anúncios de terceiros', body: 'Não declaramos nem carregamos AdMob ou AdSense. Qualquer mudança exigirá política atualizada e consentimento.' },
      { title: 'Dados offline', body: 'localStorage, IndexedDB e service worker podem manter preferências e conteúdo offline.' },
    ] },
    REFUNDS: { title: 'Pagamentos e reembolsos', intro: 'Premium e apoios voluntários são fluxos separados.', sections: [
      { title: 'Provedor', body: 'PayPal, Pagadito ou Google Play exibem a cobrança e aplicam suas regras. Conecta+ não armazena dados de cartão.' },
      { title: 'Premium', body: 'Cancele a renovação no provedor. O cancelamento evita a próxima cobrança e pode manter o acesso até o fim do período pago.' },
      { title: 'Apoios', body: 'Apoios voluntários não compram Premium nem liberam funções. Solicite reembolso ao provedor conforme o status confirmado.' },
      { title: 'Contato', body: `Escreva para ${LEGAL_CONTACT_EMAIL} com provedor, produto, data e valor. Nunca envie número de cartão, CVV ou senha.` },
    ] },
    COMMUNITY: { title: 'Regras da comunidade', intro: 'A comunidade deve ser segura, respeitosa e útil.', sections: [
      { title: 'Não permitido', bullets: ['Ódio, assédio, ameaças, doxxing ou discriminação.', 'Conteúdo sexual explícito, exploração ou contato sexual com menores.', 'Instruções de automutilação, ameaças de violência ou fraude.', 'Spam, publicidade não autorizada, malware ou identidade falsa.'] },
      { title: 'Publicação', body: 'Publique apenas conteúdo que possa compartilhar. O modo anônimo oculta seu nome, mas não elimina responsabilidade nem registros de segurança.' },
      { title: 'Denúncias', body: `Denuncie pelo link visível na comunidade ou escreva para ${LEGAL_CONTACT_EMAIL}. Inclua URL, motivo e contexto.` },
    ] },
    AGE_GATE: { title: 'Aviso de idade e acesso regional', intro: 'Conecta+ aplica idade mínima base de 13 anos.', sections: [
      { title: 'Regra de acesso', body: 'O registro exige idade e país. Países desconhecidos e OTHER são bloqueados. Países com exigência maior ficam bloqueados até revisão.' },
      { title: 'Menores', body: 'Consentimento parental verificável não está disponível nesta fase. Um responsável deve realizar compras quando necessário.' },
      { title: 'Contato', body: `Versão atual: ${LEGAL_EFFECTIVE_DATE}. Dúvidas: ${LEGAL_CONTACT_EMAIL}.` },
    ] },
  };
  return {
    TERMS: { title: 'Términos y condiciones', intro: 'Conecta+ ofrece acompañamiento espiritual, comunidad y herramientas de crecimiento. Este texto es un borrador técnico y requiere revisión legal local.', sections: [
      { title: 'Servicio y edad', body: 'Debes tener al menos 13 años y residir en un país habilitado. Países con requisito superior quedan bloqueados hasta revisión.' },
      { title: 'Comunidad y contenido', body: 'Conservas tus derechos y otorgas una licencia limitada para alojar y mostrar tu contenido en el servicio.', bullets: ['No odio, acoso, amenazas ni discriminación.', 'No contenido sexual explícito ni explotación de menores.', 'No autolesiones, spam, fraude ni suplantación.'] },
      { title: 'SOS y limitaciones', body: 'La app no sustituye atención médica, psicológica, legal ni servicios de emergencia. Ante peligro inmediato, contacta emergencias locales.' },
      { title: 'Pagos', body: 'Premium es independiente de apoyos voluntarios. PayPal, Pagadito y Google Play procesan pagos según el estado confirmado del proveedor.' },
      { title: 'Contacto', body: contact },
    ] },
    PRIVACY: { title: 'Política de privacidad', intro: 'Explica qué datos usa Conecta+, para qué, con quién y cómo ejercer derechos.', sections: [
      { title: 'Datos tratados', bullets: ['Cuenta: nombre, usuario, email, contraseña cifrada, edad y país.', 'Datos espirituales: estado, metas, check-ins, diario, oración y SOS.', 'Comunidad: publicaciones, respuestas, preguntas y solicitudes de oración.', 'Chat IA: mensajes privados, modo elegido y contexto espiritual solo si lo activas.', 'Operación: push, dispositivo, sesión, seguridad y registros técnicos.', 'Pagos: proveedor, producto, importe, estado y referencias mínimas; nunca tarjetas, CVV ni secretos.'] },
      { title: 'Uso y proveedores', body: 'Usamos datos para prestar el servicio, proteger cuentas, soporte, obligaciones y pagos. Si activas el chat IA, enviamos tu mensaje y el contexto autorizado a NVIDIA para generar una respuesta. Los proveedores aplican sus propias políticas.' },
      { title: 'Almacenamiento local', body: 'Preferencias, contenido estático y datos offline pueden usar localStorage, IndexedDB y service worker. El contenido privado offline se elimina al borrar la cuenta en este dispositivo.' },
      { title: 'Derechos y retención', body: `Solicita acceso, corrección, exportación o borrado en ${LEGAL_CONTACT_EMAIL}. Conservamos datos mientras exista la cuenta y solo retenemos mínimos legales.` },
      { title: 'Transferencias y menores', body: 'Los datos pueden procesarse fuera de tu país con medidas razonables. No usamos datos espirituales para publicidad. No se permite registro menor de 13 años.' },
    ] },
    COOKIES: { title: 'Política de cookies y almacenamiento', intro: 'Usamos solo tecnologías necesarias y preferencias elegidas.', sections: [
      { title: 'Necesarias', body: 'Cookies de sesión y seguridad permiten autenticación. Las preferencias de idioma y consentimiento respetan tus elecciones.' },
      { title: 'Analítica', body: 'Vercel Analytics se carga solo después de aceptar analítica. La app funciona si rechazas.' },
      { title: 'Sin publicidad de terceros', body: 'No declaramos ni cargamos AdMob o AdSense. Cualquier cambio requiere política actualizada y consentimiento.' },
      { title: 'Datos offline', body: 'localStorage, IndexedDB y service worker pueden conservar preferencias y contenido offline.' },
    ] },
    REFUNDS: { title: 'Política de pagos y reembolsos', intro: 'Premium y apoyos voluntarios son flujos separados.', sections: [
      { title: 'Proveedor', body: 'PayPal, Pagadito o Google Play muestran cobros y aplican sus reglas. Conecta+ no guarda datos de tarjeta.' },
      { title: 'Premium', body: 'Cancela la renovación con el proveedor. La cancelación evita el siguiente cobro y puede mantener acceso durante el periodo pagado.' },
      { title: 'Apoyos', body: 'Los apoyos voluntarios no compran Premium ni desbloquean funciones. Solicita reembolsos al proveedor según el estado confirmado.' },
      { title: 'Soporte', body: `Escribe a ${LEGAL_CONTACT_EMAIL} con proveedor, producto, fecha e importe. No envíes tarjetas, CVV ni contraseñas.` },
    ] },
    COMMUNITY: { title: 'Reglas de comunidad', intro: 'La comunidad debe ser segura, respetuosa y útil.', sections: [
      { title: 'No permitido', bullets: ['Odio, acoso, amenazas, doxxing o discriminación.', 'Contenido sexual explícito, explotación o contacto sexual con menores.', 'Instrucciones de autolesión, violencia o fraude.', 'Spam, publicidad no autorizada, malware o suplantación.'] },
      { title: 'Publicación', body: 'Publica solo contenido que puedas compartir. El modo anónimo oculta tu nombre, pero no elimina responsabilidad ni registros de seguridad.' },
      { title: 'Reportes', body: `Reporta con el enlace visible en Comunidad o escribe a ${LEGAL_CONTACT_EMAIL}. Incluye URL, motivo y contexto.` },
    ] },
    AGE_GATE: { title: 'Aviso de edad y acceso regional', intro: 'Conecta+ aplica una edad mínima base de 13 años.', sections: [
      { title: 'Regla de acceso', body: 'El registro exige edad y país. Países desconocidos y OTHER quedan bloqueados. Países con requisito superior quedan bloqueados hasta revisión.' },
      { title: 'Menores', body: 'No se construye consentimiento parental verificable en esta fase. Las compras deben realizarse con padre, madre o tutor cuando corresponda.' },
      { title: 'Contacto', body: `Versión vigente: ${LEGAL_EFFECTIVE_DATE}. Dudas: ${LEGAL_CONTACT_EMAIL}.` },
    ] },
  };
};

export const LEGAL_CONTENT: Record<RenderLocale, Record<LegalDocument, LegalDocumentContent>> = {
  es: docs('es'),
  en: docs('en'),
  pt: docs('pt'),
  ro: docs('ro'),
};
