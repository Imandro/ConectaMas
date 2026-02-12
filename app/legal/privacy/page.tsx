"use client";

import Link from "next/link";
import { ChevronLeft, ShieldCheck, Lock, Eye, Cookie, Scale, AlertTriangle } from "lucide-react";

export default function PrivacyPolicy() {
    return (
        <div className="min-vh-100 bg-light py-5">
            <div className="container" style={{ maxWidth: '900px' }}>
                <Link href="/" className="btn btn-link text-decoration-none text-muted mb-4 d-flex align-items-center gap-2">
                    <ChevronLeft size={20} />
                    Volver
                </Link>

                <div className="card border-0 shadow-sm p-4 p-md-5" style={{ borderRadius: '24px' }}>
                    <div className="text-center mb-5">
                        <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                            <ShieldCheck size={48} className="text-primary" />
                        </div>
                        <h1 className="fw-bold text-secondary">Política de Privacidad</h1>
                        <p className="text-muted">Tu privacidad es nuestra prioridad en <strong>Conecta+</strong>.</p>
                        <p className="text-muted">Última actualización: 11 de febrero de 2026</p>
                    </div>

                    <div className="content text-secondary lh-lg">
                        <section className="mb-5">
                            <h4 className="fw-bold d-flex align-items-center gap-2 mb-3">
                                <Lock size={24} className="text-primary" />
                                1. Introducción
                            </h4>
                            <p>
                                En <strong>Conecta+</strong> (ConectaMas), nos tomamos muy en serio la privacidad de nuestros usuarios. Esta política describe cómo recolectamos, usamos, compartimos y protegemos tu información personal cuando utilizas nuestra aplicación espiritual.
                            </p>
                            <p>
                                Al usar ConectaMas, aceptas las prácticas descritas en esta política. Si no estás de acuerdo, por favor no uses nuestra aplicación.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h4 className="fw-bold d-flex align-items-center gap-2 mb-3">
                                <Eye size={24} className="text-primary" />
                                2. Información que Recolectamos
                            </h4>

                            <h5 className="fw-bold mb-2">2.1 Información que Proporcionas Directamente</h5>
                            <ul>
                                <li><strong>Información de Registro:</strong> Nombre, correo electrónico, contraseña (encriptada), nombre de usuario, edad, género, país.</li>
                                <li><strong>Datos Espirituales:</strong> Estado espiritual, luchas personales, preferencias de conexión con Dios, check-ins de salud espiritual y metas de crecimiento.</li>
                                <li><strong>Contenido Generado:</strong> Publicaciones en foros, preguntas y respuestas, oraciones, notas de diario privadas, comentarios.</li>
                                <li><strong>Información de Contacto:</strong> Número de teléfono del líder (opcional, solo para función SOS).</li>
                            </ul>

                            <h5 className="fw-bold mb-2 mt-4">2.2 Información Recopilada Automáticamente</h5>
                            <ul>
                                <li><strong>Datos de Navegación:</strong> Dirección IP, tipo de dispositivo, navegador, sistema operativo, páginas visitadas, tiempo en la aplicación.</li>
                                <li><strong>Datos de Uso:</strong> Funciones utilizadas, artículos leídos, recursos descargados, interacciones con contenido.</li>
                                <li><strong>Cookies:</strong> Usamos cookies técnicas para mantener tu sesión activa y mejorar la experiencia.</li>
                                <li><strong>Notificaciones Push:</strong> Si autorizas, almacenamos tokens de suscripción para enviarte notificaciones.</li>
                            </ul>

                            <h5 className="fw-bold mb-2 mt-4">2.3 Información de Terceros</h5>
                            <ul>
                                <li><strong>Google AdMob/AdSense:</strong> Recopilamos datos necesarios para mostrar anuncios (ver sección 3).</li>
                                <li><strong>Proveedores de Análisis:</strong> Usamos Vercel Analytics para entender el uso de la aplicación.</li>
                            </ul>
                        </section>

                        <section className="mb-5">
                            <h4 className="fw-bold d-flex align-items-center gap-2 mb-3">
                                <Cookie size={24} className="text-primary" />
                                3. Cookies y Publicidad (Google AdMob/AdSense)
                            </h4>
                            <p>
                                Utilizamos cookies técnicas para mantener tu sesión activa (NextAuth) y cookies de terceros de <strong>Google AdMob/AdSense</strong> para mostrar anuncios en la aplicación.
                            </p>
                            <p>
                                Los proveedores de terceros, incluido Google, utilizan cookies para servir anuncios basados en las visitas previas de un usuario a este sitio web o a otros sitios web. El uso de cookies de publicidad por parte de Google permite a Google y a sus socios servir anuncios a los usuarios basados en su visita a sus sitios y/u otros sitios en Internet.
                            </p>

                            <h5 className="fw-bold mb-2 mt-3">Datos que Google puede recopilar:</h5>
                            <ul>
                                <li>Identificadores de publicidad (ID de publicidad de Google)</li>
                                <li>Dirección IP y ubicación aproximada</li>
                                <li>Interacciones con anuncios</li>
                                <li>Datos del dispositivo y navegador</li>
                            </ul>

                            <p>
                                Puedes inhabilitar la publicidad personalizada visitando <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary">Configuración de anuncios de Google</a>.
                            </p>
                            <p>
                                Para más información, consulta la <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary">Política de Privacidad de Google</a> y las <a href="https://support.google.com/admob/answer/6128543" target="_blank" rel="noopener noreferrer" className="text-primary">Políticas de AdMob</a>.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h4 className="fw-bold d-flex align-items-center gap-2 mb-3">
                                <ShieldCheck size={24} className="text-primary" />
                                4. Cómo Usamos Tu Información
                            </h4>
                            <p>Utilizamos la información recopilada para:</p>
                            <ul>
                                <li><strong>Proporcionar el Servicio:</strong> Personalizar tu experiencia, mantener tu racha, mostrar contenido relevante.</li>
                                <li><strong>Mejorar la Aplicación:</strong> Analizar el uso para agregar nuevas funcionalidades y mejorar las existentes.</li>
                                <li><strong>Comunicación:</strong> Enviar notificaciones sobre tu actividad, respuestas a tus publicaciones, recordatorios.</li>
                                <li><strong>Seguridad:</strong> Proteger contra fraude, abuso y actividades no autorizadas.</li>
                                <li><strong>Cumplimiento Legal:</strong> Cumplir con obligaciones legales y responder a solicitudes gubernamentales.</li>
                                <li><strong>Monetización:</strong> Mostrar anuncios relevantes a través de Google AdMob/AdSense.</li>
                            </ul>
                        </section>

                        <section className="mb-5">
                            <h4 className="fw-bold d-flex align-items-center gap-2 mb-3">
                                <Eye size={24} className="text-primary" />
                                5. Compartir Tu Información
                            </h4>
                            <p><strong>No vendemos tu información personal.</strong> Compartimos datos solo en estas circunstancias:</p>
                            <ul>
                                <li><strong>Con Otros Usuarios:</strong> Cuando publicas en foros o Q&A (puedes elegir publicar de forma anónima).</li>
                                <li><strong>Proveedores de Servicios:</strong> Compartimos datos con proveedores que nos ayudan a operar la aplicación (hosting, base de datos).</li>
                                <li><strong>Socios Publicitarios:</strong> Google AdMob puede recopilar datos para personalizar anuncios.</li>
                                <li><strong>Cumplimiento Legal:</strong> Si la ley lo requiere o para proteger nuestros derechos.</li>
                            </ul>
                        </section>

                        <section className="mb-5">
                            <h4 className="fw-bold d-flex align-items-center gap-2 mb-3">
                                <AlertTriangle size={24} className="text-warning" />
                                6. Protección de Menores (COPPA)
                            </h4>
                            <p>
                                ConectaMas está diseñada para adolescentes y jóvenes. Cumplimos con la Ley de Protección de la Privacidad Infantil en Línea (COPPA) de EE.UU.
                            </p>
                            <ul>
                                <li>Solicitamos la edad del usuario durante el registro.</li>
                                <li>Para usuarios menores de 13 años, requerimos consentimiento parental verificable.</li>
                                <li>No recopilamos más información de la necesaria de menores.</li>
                                <li>Los padres pueden solicitar acceso, corrección o eliminación de los datos de sus hijos.</li>
                            </ul>
                            <p>
                                Si eres padre/madre y crees que tu hijo menor de 13 años nos ha proporcionado información sin tu consentimiento, contáctanos en <strong>contacto@conectamas.com</strong>
                            </p>
                        </section>

                        <section className="mb-5">
                            <h4 className="fw-bold d-flex align-items-center gap-2 mb-3">
                                <ShieldCheck size={24} className="text-primary" />
                                7. Seguridad y Retención de Datos
                            </h4>
                            <p>
                                Implementamos medidas de seguridad técnicas para proteger tu información:
                            </p>
                            <ul>
                                <li>Encriptación SSL/TLS para todas las conexiones</li>
                                <li>Hash de contraseñas con bcrypt</li>
                                <li>Autenticación basada en tokens JWT</li>
                                <li>Acceso restringido a datos personales</li>
                                <li>Monitoreo regular de vulnerabilidades</li>
                            </ul>
                            <p>
                                Tus datos personales y espirituales se conservan mientras tu cuenta esté activa. Puedes solicitar la eliminación total de tus datos en cualquier momento desde la configuración de tu perfil.
                            </p>
                            <p>
                                <strong>Derecho de Supresión:</strong> Una vez eliminada la cuenta, todos tus registros (check-ins, notas privadas y progreso) desaparecerán permanentemente de nuestros servidores.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h4 className="fw-bold d-flex align-items-center gap-2 mb-3">
                                <Scale size={24} className="text-primary" />
                                8. Tus Derechos (GDPR / CCPA / Privacidad Local)
                            </h4>
                            <p>Dependiendo de tu ubicación, tienes los siguientes derechos:</p>
                            <ul>
                                <li><strong>Acceso:</strong> Solicitar una copia de tus datos personales.</li>
                                <li><strong>Corrección:</strong> Corregir datos inexactos o incompletos.</li>
                                <li><strong>Eliminación:</strong> Solicitar la eliminación de tus datos ("derecho al olvido").</li>
                                <li><strong>Portabilidad:</strong> Recibir tus datos en un formato estructurado.</li>
                                <li><strong>Oposición:</strong> Oponerte al procesamiento de tus datos para ciertos fines.</li>
                                <li><strong>Retirar Consentimiento:</strong> Retirar tu consentimiento en cualquier momento.</li>
                            </ul>
                            <p>
                                Para ejercer estos derechos, contáctanos en <strong>contacto@conectamas.com</strong>. Responderemos dentro de 30 días.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h4 className="fw-bold d-flex align-items-center gap-2 mb-3">
                                <AlertTriangle size={24} className="text-danger" />
                                9. Transferencias Internacionales
                            </h4>
                            <p>
                                Tus datos pueden ser transferidos y almacenados en servidores ubicados fuera de tu país de residencia. Tomamos medidas para asegurar que tus datos reciban un nivel adecuado de protección.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h4 className="fw-bold mb-3">10. Cambios a Esta Política</h4>
                            <p>
                                Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos de cambios significativos publicando la nueva política en la aplicación y actualizando la fecha de "Última actualización".
                            </p>
                        </section>

                        <section className="mb-5">
                            <h5 className="fw-bold text-danger">Aviso Importante (Descargo de Responsabilidad)</h5>
                            <p className="small bg-danger bg-opacity-10 p-3 rounded-3 border-start border-4 border-danger">
                                <strong>Conecta+</strong> es una herramienta de acompañamiento espiritual. El contenido y las funciones (incluida la sección SOS) no sustituyen el consejo médico, psicológico o profesional. Si te encuentras en una situación de peligro inminente, por favor contacta a las autoridades de emergencia locales de inmediato.
                            </p>
                        </section>

                        <div className="text-center mt-5 pt-4 border-top">
                            <h5 className="fw-bold mb-3">Contacto</h5>
                            <p className="mb-1"><strong>Email:</strong> contacto@conectamas.com</p>
                            <p className="mb-1"><strong>Desarrollador:</strong> Mario Alvarez</p>
                            <p className="small text-muted mb-0 mt-3">
                                Para cualquier consulta legal o técnica, puedes escribir a nuestro equipo de soporte ministerial dentro de la plataforma.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
