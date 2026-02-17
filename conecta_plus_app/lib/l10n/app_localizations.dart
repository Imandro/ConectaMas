import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';

class AppLocalizations {
  final Locale locale;

  AppLocalizations(this.locale);

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  static final Map<String, Map<String, String>> _localizedValues = {
    'es': {
      'title': 'Conecta+',
      'welcome': 'Bienvenido',
      'challengeTitle': 'Reto Diario',
      'days': 'Días',
      'streak': 'Racha',
      'complete_challenge': 'Completar Reto',
      'settings': 'Configuración',
      'language': 'Idioma',
      'region': 'Región',
      'title_verse': 'Completa el versículo',
      'title_truth': 'Verdad Bíblica',
      'feedback_correct': '¡Excelente!',
      'feedback_incorrect': 'Casi...',
      'feedback_correct_msg': 'Vas por muy buen camino.',
      'feedback_incorrect_msg': 'La respuesta era:',
      'points': 'Puntos',
      'status': 'Estado',
      'completed': 'Completado',
      'return_home': 'Volver al Inicio',
      'mission_accomplished': '¡Misión Cumplida!',
      'mission_message': 'Has alimentado tu espíritu con la Verdad hoy.',
      'community_title': 'Comunidad',
      'community_subtitle': 'Comparte, aprende y crece junto a otros',
      'notifications_title': 'Notificaciones',
      'notifications_empty': 'No hay notificaciones',
      'mark_all_read': 'Marcar todas como leídas',
      'new_post': 'Nueva',
      'anonymous': 'Anónimo',
      'counselor': 'CONSEJERO',
      'replies_count': 'Respuestas ({count})',
      'posts_count': '{count} publicaciones',
      'write_reply': 'Escribe una respuesta...',
      'select_category': 'Selecciona una categoría',
      'which_category': '¿En qué categoría quieres publicar?',
      'title_label': 'Título',
      'content_label': 'Contenido',
      'publish': 'Publicar',
      'publish_anonymous': 'Publicar de forma anónima',
      'identity_hidden': 'Tu nombre no será visible para los demás.',
      'hint_title': 'Ej: Oración por fortaleza',
      'hint_content': 'Cuéntanos lo que tienes en el corazón...',
      'cat_prayer': 'Peticiones de Oración',
      'cat_bible': 'Estudio Bíblico',
      'cat_testimony': 'Testimonios',
      'cat_questions': 'Preguntas y Dudas',
      'cat_advice': 'Consejos de Vida',
      'cat_praise': 'Alabanza y Adoración',
      'desc_prayer': 'Apoyémonos los unos a los otros en oración.',
      'desc_bible': 'Profundicemos juntos en la Palabra de Dios.',
      'desc_testimony': 'Cuenta lo que Dios ha hecho en tu vida.',
      'desc_questions': 'Un espacio seguro para resolver inquietudes.',
      'desc_advice': 'Sabiduría práctica para el día a día.',
      'desc_praise': 'Comparte música y experiencias de adoración.',
      'hello': 'Hola, {name}',
      'days_victory': 'Días en victoria',
      'days_label': 'Días',
      'level_label': 'Nivel {level}',
      'mascot_msg_1': '¡Mira cómo creces!',
      'mascot_msg_2': 'Estoy orgulloso de ti',
      'mascot_msg_3': 'Dios sigue contigo',
      'mascot_msg_4': 'Un día a la vez',
      'mascot_msg_5': 'Sigue firme, tú puedes',
      'sos_label': 'Venciendo Tentación',
      'study_bible': 'Estudio Bíblico',
      'daily_verse': 'Versículo del día',
      'my_progress': 'Mi Seguimiento',
      'social_media': 'Redes Sociales',
      'intercession_prayer': 'Oración e Intercesión',
      'support_conecta': 'Apoyar Conecta+',
      'donate': 'Donar',
      'manage_transformation': 'Gestiona tus planes de transformación',
      'in_progress': 'En progreso',
      'available': 'Disponibles',
      'view_all_plans': 'Ver todos mis planes',
      'leave_request': 'Deja tu petición',
      'support_message': 'Ayúdanos a llegar a más personas',
      'donation_desc':
          'Tu apoyo me ayuda a mantener los servidores y llevar la palabra de Dios a más jóvenes. Al ser Premium, tendrás una experiencia 100% libre de anuncios y me ayudarás a alcanzar la meta de la Google Play Store.',
      'no_ads': 'Sin anuncios de Google en toda la app',
      'premium_button': '¡Ser Premium por \$1 USD!',
      'paypal_note':
          '*Al donar, mándame tu email por PayPal para activar tu insignia.',
      'growth_milestone_title': '¡Vamos Creciendo!',
      'growth_milestone_subtitle': 'Conectados por el mundo',
      'growth_milestone_goal': 'Meta Misional',
      'growth_milestone_completed': '{progress}% completado',
      'growth_milestone_button': '¡Genial!',
      'donation_missions_title': 'Apoya la Misión',
      'donation_missions_subtitle': 'PROYECTO CONECTA+',
      'donation_missions_desc':
          'Tu apoyo nos permite seguir llevando esperanza a miles de jóvenes. Actualmente estamos trabajando en misiones especiales fuera de nuestras fronteras.',
      'donation_mission_brasil': '🇧🇷 Pro-Brasil',
      'donation_mission_nicaragua': '🇳🇮 Pro-Nicaragua',
      'donation_bank_details': 'Depósito Bancario (Nicaragua):',
      'donation_bank_name': 'Banco Lafise',
      'donation_bank_account': 'Cuenta: 132247471',
      'donation_collaborators': 'Colaboradores Destacados:',
      'donation_collaborator_marvin': 'Marvin Cruz Alvarado (¡Donó!)',
      'sos_title': 'Respira.',
      'sos_subtitle':
          'No has fallado todavía. Y aunque lo hicieras, Él te sigue amando. Pero hagamos una pausa de 1 minuto juntos.',
      'sos_disclaimer':
          'AVISO: Conecta+ es una herramienta espiritual. En caso de emergencia grave, llama al 911.',
      'empty_struggles_title': '¡Todo en orden!',
      'empty_struggles_desc': 'No tienes batallas activas. ¡Sigue así!',
      'empty_community_title': '¡Sé el primero!',
      'empty_community_desc':
          'Aún no hay publicaciones en esta categoría. Comparte algo hoy.',

      // Youth Zone
      'youth_zone_title': 'Zona Joven',
      'youth_music': 'Alabanza',
      'youth_movies': 'Cine',
      'youth_humor': 'Humor',
      'youth_no_music': 'No hay canciones aún.',
      'youth_no_movies': 'No hay películas aún.',
      'youth_no_memes': 'No hay memes aún.',
      'watch_trailer': 'Ver Trailer',

      // Social Media
      'join_community': 'Únete a la Comunidad',
      'follow_instagram': 'Síguenos en Instagram',
      'whatsapp_desc':
          'Recibe apoyo diario y conecta con otros en nuestro grupo oficial de WhatsApp.',
      'instagram_desc':
          'Contenido diario de transformación, reflexiones y novedades en @conectamas.',
      'join_group': 'Unirme al Grupo',
      'follow_button': 'Seguir en Instagram',
      'maybe_later': 'Quizás luego',

      // Games Common
      'game_over': 'Juego Terminado',
      'level_completed': '¡Nivel Completado!',
      'final_score': 'Puntaje Final:',
      'exit_game': 'Salir',
      'back_menu': 'Volver al menú',
      'revive_ad': 'Ver video para revivir',
      'correct_exclamation': '¡Correcto!',
      'next_button': 'Siguiente',
      'round_completed': '¡Ronda Completada!',
      'come_back_later': 'Vuelve más tarde para más desafíos.',
      'all_completed_title': '¡Has completado todo!',
      'all_completed_desc': '¡Has completado todas las preguntas disponibles!',

      // Trivia
      'trivia_title': 'Trivia Bíblica',
      'question_label': 'Pregunta',
      'out_of_lives': '¡Te quedaste sin vidas!',
      'round_success': '¡Has respondido todas las preguntas de esta ronda!',

      // Verse Scramble
      'scramble_title': 'Ordena el Versículo',
      'verse_label': 'Versículo',
      'earned_manna': 'Has ganado 10 Maná',
      'session_completed':
          'Has completado todos los versículos de esta sesión. ¡Vuelve más tarde!',

      // Spiritual Combat Enhancements
      'spiritual_combat_title': 'Libertad en Cristo',
      'struggle_summary': 'Resumen de Vida',
      'available_plans': 'Planes Disponibles',
      'victory_hall': 'Salón de Victorias',
      'victory_hall_subtitle': 'Vencido con éxito',
      'plan_pending': 'Plan por iniciar',
      'battle_front': 'Frente de Batalla',
      'reflection': 'Reflexión de Gracia',
      'register_victory': 'Registrar Victoria',
      'spiritual_weapons': 'Armas Espirituales',
      'biblical_advice': 'Consejos Bíblicos',
      'sos_truths_title': '5 Verdades para ti hoy:',
      'sos_prayer_title': 'Oración de Emergencia',
      'sos_call_leader': 'Llamar a un líder',
      'sos_call_desc': 'No pelees solo',
      'sos_no_leader': 'No has configurado el número de tu líder en tu perfil.',
      'sos_pause_title': 'Pausa y Reconecta',
      'sos_pause_desc':
          'La ansiedad y la tentación a menudo nos roban la perspectiva. Antes de actuar, recuerda: Dios sigue en el trono y Su gracia es suficiente para ti hoy.',

      // Bible Chat
      'chat_guide_name': 'Guía Espiritual',
      'chat_welcome':
          'Hola, soy tu guía. ¿En qué duda bíblica o lucha puedo apoyarte hoy?',
      'chat_placeholder': 'Escribe tu duda aquí...',
      'save': 'Guardar',

      // Accountability / Alianza de Victoria
      'alliance_title': 'Alianza de Victoria',
      'alliance_subtitle': 'No pelees solo (Stgo 5:16)',
      'battle_companion': 'Compañero de Batalla',
      'no_companion': 'Sin compañero asignado',
      'assign_companion': 'Asignar Compañero',
      'companion_phone': 'Teléfono del Compañero',
      'companion_name': 'Nombre del Compañero',
      'reinforcement_btn': 'BOTÓN DE REFUERZO',
      'reinforcement_desc': 'Alerta inmediata a tu compañero',
      'reinforcement_sent': '¡Refuerzo enviado! Tu compañero ha sido alertado.',
      'honesty_checkin': 'Check-in de Honestidad',
      'honesty_desc': 'Las 5 preguntas que liberan el alma',
      'q1_spirit': '¿Has pasado tiempo a solas con Dios hoy?',
      'q2_temptation': '¿Has sido tentado en tu área de lucha hoy?',
      'q3_failed': '¿Has cedido a la tentación (pensamiento o acto)?',
      'q4_honesty': '¿Has sido 100% honesto en este check-in?',
      'q5_action': '¿Qué paso darás ahora para fortalecerte?',
      'q_yes': 'Sí',
      'q_no': 'No',
      'q_process': 'Procesando honestidad...',
      'alliance_alert_msg':
          'Alerta de Conecta+: Mi nombre es %s y necesito refuerzo espiritual AHORA. Por favor, llámame o levanta una oración por mí.',

      // Common UI
      'cancel': 'Cancelar',
      'error_label': 'Error',
      'host_label': 'Anfitrión',
      'confirm': 'Confirmar',
      'create': 'Crear',
      'loading': 'Cargando...',
      'congrats': '¡Excelente!',
      'oops': '¡Oops!',
      'bronze': 'Bronce',
      'silver': 'Plata',
      'gold': 'Oro',
      'diamond': 'Diamante',
      'spiritual_status_label': 'Estado Espiritual',
      'bio_label': 'Biografía',
      'country_label': 'País',
      'age_label': 'Edad',
      'gender_label': 'Género',
      'profile_type_label': 'Tipo de Perfil',
      'leader_phone_label': 'Teléfono de Líder',

      // Study
      'study_title': 'Estudio Bíblico',
      'join_label': 'Unirme',
      'new_study_room': 'Nueva Sala de Estudio',
      'description_label': 'Descripción',
      'theme_placeholder': 'Tema (ej: Romanos 8)',
      'send_button': 'Enviar',
      'study_room': 'Aula de Estudio',
      'chat_hint': 'Escribe un mensaje...',

      // Potato Game
      'potato_game_title': 'Papa Caliente',
      'waiting_turn': 'Esperando tu turno...',
      'room_code_label': 'Código de Sala:',
      'players_joined': '{count} Jugadores Unidos',
      'start_game': 'INICIAR JUEGO',
      'waiting_host': 'Esperando al anfitrión...',
      'pass_potato': '¡Pasa la papa!',
      'winner_label': 'Ganador: {name}',
      'back_lobby': 'Volver al Lobby',

      // Leagues
      'leagues_title': 'Ligas',
      'league_label_text': 'Liga {name}',
      'ends_in_days': 'Termina en {count} días',
      'promotion_label': '↑ Ascenso',
      'demotion_label': '↓ Descenso',

      // Login
      'welcome_back': 'Bienvenido de nuevo',
      'login_subtitle': 'Ingresa para continuar tu camino.',
      'email_or_username': 'Email o Usuario',
      'email_or_username_hint': 'usuario o nombre@ejemplo.com',
      'password_label': 'Contraseña',
      'password_hint': 'Ingrese su contraseña',
      'forgot_password': '¿Olvidaste tu contraseña?',
      'login_button': 'Iniciar Sesión',
      'no_account': '¿No tienes cuenta? ',
      'register_here': 'Regístrate aquí',
      'footer_text': '© 2025 Conecta+\nTu espacio seguro.',
      'enter_credentials_msg': 'Por favor ingresa tus credenciales',
      'login_error_msg': 'Error al iniciar sesión',
      'critical_ui_error': 'Error crítico en UI: {error}',

      // Register
      'join_conecta': 'Únete a Conecta+',
      'register_subtitle': 'Tu viaje hacia la libertad comienza hoy.',
      'full_name_label': 'Nombre Completo',
      'full_name_hint': 'Tu nombre real',
      'username_label': 'Nombre de Usuario',
      'username_hint': '@usuario',
      'email_label': 'Email',
      'email_hint': 'nombre@ejemplo.com',
      'password_register_hint': 'Mínimo 6 caracteres',
      'security_question_label': 'Pregunta de Seguridad',
      'security_question': '¿Cómo se llamaba tu primera mascota?',
      'security_answer_label': 'Respuesta de Seguridad',
      'security_answer_hint': 'Escribe la respuesta aquí',
      'security_note': '*Usarás esta respuesta para recuperar tu contraseña.',
      'accept_terms_text': 'He leído y acepto los Términos y Condiciones.',
      'register_button': 'Crear mi cuenta',
      'respect_space_msg':
          'Al registrarte, aceptas que este es un espacio de respeto.',
      'already_have_account': '¿Ya tienes cuenta? ',
      'login_link': 'Inicia sesión',
      'accept_terms_msg': 'Debes aceptar los términos y condiciones',
      'complete_fields_msg': 'Por favor completa todos los campos',
      'register_error_msg': 'Error al crear la cuenta',

      // Onboarding
      'welcome_title': 'Bienvenido a Conecta+',
      'spiritual_status_quest': '¿Dónde estás espiritualmente?',
      'accept_jesus': 'Aceptar a Jesús por Primera Vez',
      'renew_faith': 'Reconciliar y Renovar mi Fe',
      'deepen_connection': 'Conectar Más Profundamente',
      'sins_title': 'Pecados que Quiero Dejar',
      'sins_subtitle': 'Selecciona lo que resuene contigo. Esto es privado.',
      'problems_title': 'Problemas que Enfrento',
      'problems_subtitle': '¿Con qué luchas actualmente?',
      'how_to_connect_title': '¿Cómo Quiero Conectar?',
      'how_to_connect_subtitle': '¿De qué formas quieres crecer con Dios?',
      'about_you_title': 'Sobre ti',
      'gender_subtitle': 'Para personalizar tu experiencia, dinos tu género.',
      'male': 'Hombre',
      'female': 'Mujer',
      'your_age_title': 'Tu Edad',
      'age_subtitle': 'Ayúdanos a personalizar tu experiencia.',
      'mascot_name_title': 'Dale nombre a tu compañera',
      'mascot_subtitle': 'Tu mascota te acompañará en cada paso.',
      'mascot_will_be_called': 'Tu mascota se llamará: {name}',
      'emergency_contact_title': 'Contacto de Emergencia',
      'leader_phone_subtitle':
          'Ingresa el WhatsApp de tu líder para tenerlo a mano en caso de SOS.',
      'contact_saved': 'Contacto guardado: {phone}',
      'skip': 'Prefiero omitir',
      'community_intro_title': 'Comunidad de Apoyo',
      'community_intro_subtitle':
          'En Conecta+ no estás solo. Puedes agregar amigos para orar.',
      'anonymous_support_title': 'Apoyo Anónimo y Seguro',
      'community_intro_desc':
          'Tus amigos podrán enviarte mensajes de ánimo sin necesidad de ver tus detalles privados.',
      'love_it_button': '¡Me encanta! Continuar',
      'help_us_grow_title': '¡Ayúdanos a Crecer!',
      'help_us_grow_subtitle':
          'Conecta+ es un proyecto gratuito hecho con amor.',
      'support_goal': 'Meta: Licencia Play Store (\$25 USD)',
      'support_desc':
          'Cada aporte nos acerca a la meta. Si este proyecto bendice tu vida, considera sembrar una semilla.',
      'want_to_support_button': 'Quiero Apoyar',
      'continue_now_button': 'Continuar por ahora',
      'all_set_title': '¡Todo Listo!',
      'all_set_subtitle':
          'Has dado el primer paso hacia una vida de mayor conexión con Dios.',
      'start_journey_button': '¡Empezar mi Camino!',
      'continue_button': 'Continuar',

      // Sins
      'sin_porn': 'Pornografía',
      'sin_lying': 'Mentira',
      'sin_anger': 'Enojo / Ira',
      'sin_pride': 'Orgullo',
      'sin_envy': 'Envidia',
      'sin_addictions': 'Adicciones',
      'sin_toxic_rel': 'Relaciones Tóxicas',

      // Problems
      'prob_anxiety': 'Ansiedad / Estrés',
      'prob_depression': 'Depresión / Tristeza',
      'prob_loneliness': 'Soledad',
      'prob_self_esteem': 'Baja autoestima',
      'prob_family': 'Problemas familiares',
      'prob_purpose': 'Falta de propósito',

      // Connection Methods
      'conn_pray': 'Orar más',
      'conn_bible': 'Leer la Biblia',
      'conn_fast': 'Ayunar',
      'conn_group': 'Unirme a un grupo',
      'conn_worship': 'Adorar (música)',
      'conn_study': 'Estudiar la Palabra',

      // Challenges
      'goal_achieved': '¡META LOGRADA!',
      'goal_subtitle':
          'Has completado tus 5 desafíos de hoy. ¡Tu fe se fortalece cada día!',
      'excellent_job': '¡Excelente trabajo!',
      'oops_keep_trying': '¡Oops! Sigue intentándolo.',
      'which_word_correct': '¿Cuál es la palabra correcta?',
      'complete_verse_label': 'Completa el versículo:',
      'is_biblical_truth': '¿Es esto una verdad bíblica?',
      'excellent_feedback': '¡Excelente!',
      'can_improve_feedback': '¡Puedes mejorar!',
      'check_button': 'COMPROBAR',
      'true_label': 'Verdadero',
      'false_label': 'Falso',

      // Profile
      'profile_title': 'Mi Perfil',
      'no_bio': 'Sin biografía',
      'unspecified': 'No especificado',
      'not_assigned': 'No asignado',
      'years_old': 'años',
      'change_language': 'Cambiar Idioma',
      'logout': 'Cerrar Sesión',
      'select_language': 'Seleccionar Idioma',
      'user_label': 'Usuario',

      // Avatar
      'customize_avatar': 'Personaliza tu Avatar',
      'done': 'Listo',
      'tab_skin': 'Piel',
      'tab_hair': 'Pelo',
      'tab_color': 'Color',
      'tab_face': 'Cara',
      'tab_clothes': 'Ropa',
      'tab_bg': 'Fondo',
      'hair_short': 'Corto',
      'hair_spiky': 'Spiky',
      'hair_long': 'Largo',
      'mouth_smile': 'Sonrisa',
      'mouth_serious': 'Serio',
      'mouth_surprise': 'Sorpresa',
    },
    'en': {
      'title': 'Conecta+',
      'welcome': 'Welcome',
      'challengeTitle': 'Daily Challenge',
      'days': 'Days',
      'streak': 'Streak',
      'complete_challenge': 'Complete Challenge',
      'settings': 'Settings',
      'language': 'Language',
      'region': 'Region',
      'title_verse': 'Complete the Verse',
      'title_truth': 'Biblical Truth',
      'feedback_correct': 'Excellent!',
      'feedback_incorrect': 'Almost...',
      'feedback_correct_msg': 'You are on the right path.',
      'feedback_incorrect_msg': 'The answer was:',
      'points': 'Points',
      'status': 'Status',
      'completed': 'Completed',
      'return_home': 'Return Home',
      'mission_accomplished': 'Mission Accomplished!',
      'mission_message': 'You have fed your spirit with Truth today.',
      'community_title': 'Community',
      'community_subtitle': 'Share, learn and grow with others',
      'notifications_title': 'Notifications',
      'notifications_empty': 'No notifications',
      'mark_all_read': 'Mark all as read',
      'new_post': 'New',
      'anonymous': 'Anonymous',
      'counselor': 'COUNSELOR',
      'replies_count': 'Replies ({count})',
      'posts_count': '{count} posts',
      'write_reply': 'Write a reply...',
      'select_category': 'Select a category',
      'which_category': 'In which category do you want to publish?',
      'title_label': 'Title',
      'content_label': 'Content',
      'publish': 'Publish',
      'publish_anonymous': 'Publish anonymously',
      'identity_hidden': 'Your name will not be visible to others.',
      'hint_title': 'Ex: Prayer for strength',
      'hint_content': 'Tell us what is in your heart...',
      'cat_prayer': 'Prayer Requests',
      'cat_bible': 'Bible Study',
      'cat_testimony': 'Testimonies',
      'cat_questions': 'Questions and Doubts',
      'cat_advice': 'Life Advice',
      'cat_praise': 'Praise and Worship',
      'desc_prayer': 'Let\'s support each other in prayer.',
      'desc_bible': 'Let\'s deepen together in the Word of God.',
      'desc_testimony': 'Tell what God has done in your life.',
      'desc_questions': 'A safe space to resolve concerns.',
      'desc_advice': 'Practical wisdom for day to day.',
      'desc_praise': 'Share music and worship experiences.',
      'hello': 'Hello, {name}',
      'days_victory': 'Days in victory',
      'days_label': 'Days',
      'level_label': 'Level {level}',
      'mascot_msg_1': 'Watch how you grow!',
      'mascot_msg_2': 'I am proud of you',
      'mascot_msg_3': 'God is still with you',
      'mascot_msg_4': 'One day at a time',
      'mascot_msg_5': 'Stay firm, you can do it',
      'sos_label': 'Overcoming Temptation',
      'study_bible': 'Bible Study',
      'daily_verse': 'Daily Verse',
      'my_progress': 'My Progress',
      'social_media': 'Social Media',
      'intercession_prayer': 'Prayer & Intercession',
      'support_conecta': 'Support Conecta+',
      'donate': 'Donate',
      'manage_transformation': 'Manage your transformation plans',
      'in_progress': 'In progress',
      'available': 'Available',
      'view_all_plans': 'View all my plans',
      'leave_request': 'Leave your request',
      'support_message': 'Help us reach more people',
      'donation_desc':
          'Your support helps me maintain the servers and bring God\'s word to more young people. By being Premium, you will have a 100% ad-free experience and help me reach the goal of the Google Play Store.',
      'no_ads': 'No Google ads in the whole app',
      'premium_button': 'Be Premium for \$1 USD!',
      'paypal_note':
          '*When donating, send me your email via PayPal to activate your badge.',
      'growth_milestone_title': "We're Growing!",
      'growth_milestone_subtitle': 'Connected around the world',
      'growth_milestone_goal': 'Missional Goal',
      'growth_milestone_completed': '{progress}% completed',
      'growth_milestone_button': 'Great!',
      'donation_missions_title': 'Support the Mission',
      'donation_missions_subtitle': 'CONECTA+ PROJECT',
      'donation_missions_desc':
          'Your support allows us to continue bringing hope to thousands of young people. We are currently working on special missions outside our borders.',
      'donation_mission_brasil': '🇧🇷 Pro-Brazil',
      'donation_mission_nicaragua': '🇳🇮 Pro-Nicaragua',
      'donation_bank_details': 'Bank Deposit (Nicaragua):',
      'donation_bank_name': 'Lafise Bank',
      'donation_bank_account': 'Account: 132247471',
      'donation_collaborators': 'Featured Collaborators:',
      'donation_collaborator_marvin': 'Marvin Cruz Alvarado (Donated!)',
      'sos_title': 'Breathe.',
      'sos_subtitle':
          'You haven\'t failed yet. And even if you did, He still loves you. But let\'s take a 1-minute pause together.',
      'sos_disclaimer':
          'NOTICE: Conecta+ is a spiritual tool. In case of serious emergency, call 911.',
      'empty_struggles_title': 'All in order!',
      'empty_struggles_desc': 'You have no active struggles. Keep it up!',
      'empty_community_title': 'Be the first!',
      'empty_community_desc':
          'There are no posts in this category yet. Share something today.',

      // Youth Zone
      'youth_zone_title': 'Youth Zone',
      'youth_music': 'Worship',
      'youth_movies': 'Movies',
      'youth_humor': 'Humor',
      'youth_no_music': 'No songs yet.',
      'youth_no_movies': 'No movies yet.',
      'youth_no_memes': 'No memes yet.',
      'watch_trailer': 'Watch Trailer',

      // Social Media
      'join_community': 'Join the Community',
      'follow_instagram': 'Follow us on Instagram',
      'whatsapp_desc':
          'Receive daily support and connect with others in our official WhatsApp group.',
      'instagram_desc':
          'Daily transformation content, reflections and news at @conectamas.',
      'join_group': 'Join Group',
      'follow_button': 'Follow on Instagram',
      'maybe_later': 'Maybe later',

      // Games Common
      'game_over': 'Game Over',
      'level_completed': 'Level Completed!',
      'final_score': 'Final Score:',
      'exit_game': 'Exit',
      'back_menu': 'Back to Menu',
      'revive_ad': 'Watch video to revive',
      'correct_exclamation': 'Correct!',
      'next_button': 'Next',
      'round_completed': 'Round Completed!',
      'come_back_later': 'Come back later for more challenges.',
      'all_completed_title': 'All Completed!',
      'all_completed_desc': 'You have completed all available questions!',

      // Trivia
      'trivia_title': 'Bible Trivia',
      'question_label': 'Question',
      'out_of_lives': 'You ran out of lives!',
      'round_success': 'You answered all questions in this round!',

      // Verse Scramble
      'scramble_title': 'Verse Scramble',
      'verse_label': 'Verse',
      'earned_manna': 'You earned 10 Manna',
      'session_completed':
          'You completed all verses in this session. Come back later!',

      // Spiritual Combat Enhancements
      'spiritual_combat_title': 'Freedom in Christ',
      'struggle_summary': 'Life Summary',
      'available_plans': 'Available Plans',
      'victory_hall': 'Victory Hall',
      'victory_hall_subtitle': 'Successfully overcome',
      'plan_pending': 'Plan to start',
      'battle_front': 'Battle Front',
      'reflection': 'Grace Reflection',
      'register_victory': 'Register Victory',
      'spiritual_weapons': 'Spiritual Weapons',
      'biblical_advice': 'Biblical Advice',
      'sos_truths_title': '5 Truths for you today:',
      'sos_prayer_title': 'Emergency Prayer',
      'sos_call_leader': 'Call a leader',
      'sos_call_desc': "Don't fight alone",
      'sos_no_leader':
          'You have not configured your leader\'s number in your profile.',
      'sos_pause_title': 'Pause and Reconnect',
      'sos_pause_desc':
          'Anxiety and temptation often rob us of perspective. Before acting, remember: God is still on the throne and His grace is sufficient for you today.',

      // Bible Chat
      'chat_guide_name': 'Spiritual Guide',
      'chat_welcome':
          'Hello, I am your guide. How can I support you in your biblical doubts or struggles today?',
      'chat_placeholder': 'Write your doubt here...',
      'save': 'Save',

      // Accountability
      'alliance_title': 'Victory Alliance',
      'alliance_subtitle': 'Do not fight alone (James 5:16)',
      'battle_companion': 'Battle Companion',
      'no_companion': 'No companion assigned',
      'assign_companion': 'Assign Companion',
      'companion_phone': 'Companion Phone',
      'companion_name': 'Companion Name',
      'reinforcement_btn': 'REINFORCEMENT BUTTON',
      'reinforcement_desc': 'Immediate alert to your companion',
      'reinforcement_sent':
          'Reinforcement sent! Your companion has been alerted.',
      'honesty_checkin': 'Honesty Check-in',
      'honesty_desc': 'The 5 questions that set the soul free',
      'q1_spirit': 'Have you spent time alone with God today?',
      'q2_temptation': 'Have you been tempted in your struggle area today?',
      'q3_failed': 'Have you yielded to temptation (thought or act)?',
      'q4_honesty': 'Have you been 100% honest in this check-in?',
      'q5_action': 'What step will you take now to strengthen yourself?',
      'q_yes': 'Yes',
      'q_no': 'No',
      'q_process': 'Processing honesty...',
      'alliance_alert_msg':
          'Conecta+ Alert: My name is %s and I need spiritual reinforcement NOW. Please call me or lift up a prayer for me.',

      // Common UI
      'cancel': 'Cancel',
      'error_label': 'Error',
      'host_label': 'Host',
      'confirm': 'Confirm',
      'create': 'Create',
      'loading': 'Loading...',
      'congrats': 'Excellent!',
      'oops': 'Oops!',
      'bronze': 'Bronze',
      'silver': 'Silver',
      'gold': 'Gold',
      'diamond': 'Diamond',
      'spiritual_status_label': 'Spiritual Status',
      'bio_label': 'Bio',
      'country_label': 'Country',
      'age_label': 'Age',
      'gender_label': 'Gender',
      'profile_type_label': 'Profile Type',
      'leader_phone_label': 'Leader Phone',

      // Study
      'study_title': 'Bible Study',
      'join_label': 'Join',
      'new_study_room': 'New Study Room',
      'description_label': 'Description',
      'theme_placeholder': 'Theme (ex: Romans 8)',
      'send_button': 'Send',
      'study_room': 'Study Room',
      'chat_hint': 'Type a message...',

      // Potato Game
      'potato_game_title': 'Hot Potato',
      'waiting_turn': 'Waiting for your turn...',
      'room_code_label': 'Room Code:',
      'players_joined': '{count} Players Joined',
      'start_game': 'START GAME',
      'waiting_host': 'Waiting for host...',
      'pass_potato': 'Pass the potato!',
      'winner_label': 'Winner: {name}',
      'back_lobby': 'Back to Lobby',

      // Leagues
      'leagues_title': 'Leagues',
      'league_label_text': 'League {name}',
      'ends_in_days': 'Ends in {count} days',
      'promotion_label': '↑ Promotion',
      'demotion_label': '↓ Demotion',

      // Login
      'welcome_back': 'Welcome Back',
      'login_subtitle': 'Login to continue your journey.',
      'email_or_username': 'Email or Username',
      'email_or_username_hint': 'username or name@example.com',
      'password_label': 'Password',
      'password_hint': 'Enter your password',
      'forgot_password': 'Forgot your password?',
      'login_button': 'Login',
      'no_account': "Don't have an account? ",
      'register_here': 'Register here',
      'footer_text': '© 2025 Conecta+\nYour safe space.',
      'enter_credentials_msg': 'Please enter your credentials',
      'login_error_msg': 'Error logging in',
      'critical_ui_error': 'Critical UI error: {error}',

      // Register
      'join_conecta': 'Join Conecta+',
      'register_subtitle': 'Your journey to freedom starts today.',
      'full_name_label': 'Full Name',
      'full_name_hint': 'Your real name',
      'username_label': 'Username',
      'username_hint': '@username',
      'email_label': 'Email',
      'email_hint': 'name@example.com',
      'password_register_hint': 'Minimum 6 characters',
      'security_question_label': 'Security Question',
      'security_question': 'What was your first pet\'s name?',
      'security_answer_label': 'Security Answer',
      'security_answer_hint': 'Type the answer here',
      'security_note': '*You will use this answer to recover your password.',
      'accept_terms_text': 'I have read and accept the Terms and Conditions.',
      'register_button': 'Create my account',
      'respect_space_msg':
          'By registering, you agree that this is a respectful space.',
      'already_have_account': 'Already have an account? ',
      'login_link': 'Login',
      'accept_terms_msg': 'You must accept the terms and conditions',
      'complete_fields_msg': 'Please complete all fields',
      'register_error_msg': 'Error creating account',

      // Onboarding
      'welcome_title': 'Welcome to Conecta+',
      'spiritual_status_quest': 'Where are you spiritually?',
      'accept_jesus': 'Accept Jesus for the First Time',
      'renew_faith': 'Reconcile and Renew my Faith',
      'deepen_connection': 'Connect More Deeply',
      'sins_title': 'Sins I Want to Leave',
      'sins_subtitle': 'Select what resonates with you. This is private.',
      'problems_title': 'Problems I Face',
      'problems_subtitle': 'What are you currently struggling with?',
      'how_to_connect_title': 'How Do I Want to Connect?',
      'how_to_connect_subtitle': 'In what ways do you want to grow with God?',
      'about_you_title': 'About You',
      'gender_subtitle': 'To personalize your experience, tell us your gender.',
      'male': 'Male',
      'female': 'Female',
      'your_age_title': 'Your Age',
      'age_subtitle': 'Help us personalize your experience.',
      'mascot_name_title': 'Name your companion',
      'mascot_subtitle':
          'Your mascot will accompany you every step of the way.',
      'mascot_will_be_called': 'Your mascot will be called: {name}',
      'emergency_contact_title': 'Emergency Contact',
      'leader_phone_subtitle':
          'Enter your leader\'s WhatsApp to have it at hand in case of SOS.',
      'contact_saved': 'Contact saved: {phone}',
      'skip': 'I prefer to skip',
      'community_intro_title': 'Support Community',
      'community_intro_subtitle':
          'In Conecta+ you are not alone. You can add friends to pray.',
      'anonymous_support_title': 'Anonymous and Safe Support',
      'community_intro_desc':
          'Your friends will be able to send you messages of encouragement without seeing your private details.',
      'love_it_button': 'Love it! Continue',
      'help_us_grow_title': 'Help Us Grow!',
      'help_us_grow_subtitle': 'Conecta+ is a free project made with love.',
      'support_goal': 'Goal: Play Store License (\$25 USD)',
      'support_desc':
          'Every contribution brings us closer to the goal. If this project blesses your life, consider sowing a seed.',
      'want_to_support_button': 'I Want to Support',
      'continue_now_button': 'Continue for now',
      'all_set_title': 'All Set!',
      'all_set_subtitle':
          'You have taken the first step towards a life of greater connection with God.',
      'start_journey_button': 'Start my Journey!',
      'continue_button': 'Continue',

      // Sins
      'sin_porn': 'Pornography',
      'sin_lying': 'Lying',
      'sin_anger': 'Anger / Rage',
      'sin_pride': 'Pride',
      'sin_envy': 'Envy',
      'sin_addictions': 'Addictions',
      'sin_toxic_rel': 'Toxic Relationships',

      // Problems
      'prob_anxiety': 'Anxiety / Stress',
      'prob_depression': 'Depression / Sadness',
      'prob_loneliness': 'Loneliness',
      'prob_self_esteem': 'Low self-esteem',
      'prob_family': 'Family problems',
      'prob_purpose': 'Lack of purpose',

      // Connection Methods
      'conn_pray': 'Pray more',
      'conn_bible': 'Read the Bible',
      'conn_fast': 'Fast',
      'conn_group': 'Join a group',
      'conn_worship': 'Worship (music)',
      'conn_study': 'Study the Word',

      // Challenges
      'goal_achieved': 'GOAL ACHIEVED!',
      'goal_subtitle':
          'You have completed your 5 challenges today. Your faith grows stronger every day!',
      'excellent_job': 'Excellent job!',
      'oops_keep_trying': 'Oops! Keep trying.',
      'which_word_correct': 'Which word is correct?',
      'complete_verse_label': 'Complete the verse:',
      'is_biblical_truth': 'Is this a biblical truth?',
      'excellent_feedback': 'Excellent!',
      'can_improve_feedback': 'You can improve!',
      'check_button': 'CHECK',
      'true_label': 'True',
      'false_label': 'False',

      // Profile
      'profile_title': 'My Profile',
      'no_bio': 'No bio',
      'unspecified': 'Unspecified',
      'not_assigned': 'Not assigned',
      'years_old': 'years old',
      'change_language': 'Change Language',
      'logout': 'Logout',
      'select_language': 'Select Language',
      'user_label': 'User',

      // Avatar
      'customize_avatar': 'Customize your Avatar',
      'done': 'Done',
      'tab_skin': 'Skin',
      'tab_hair': 'Hair',
      'tab_color': 'Color',
      'tab_face': 'Face',
      'tab_clothes': 'Clothes',
      'tab_bg': 'Background',
      'hair_short': 'Short',
      'hair_spiky': 'Spiky',
      'hair_long': 'Long',
      'mouth_smile': 'Smile',
      'mouth_serious': 'Serious',
      'mouth_surprise': 'Surprise',
    },
    'pt': {
      'title': 'Conecta+',
      'welcome': 'Bem-vindo',
      'challengeTitle': 'Desafio Diário',
      'days': 'Dias',
      'streak': 'Sequência',
      'complete_challenge': 'Completar Desafio',
      'settings': 'Configurações',
      'language': 'Idioma',
      'region': 'Região',
      'title_verse': 'Complete o Versículo',
      'title_truth': 'Verdade Bíblica',
      'feedback_correct': 'Excelente!',
      'feedback_incorrect': 'Quase...',
      'feedback_correct_msg': 'Você está no caminho certo.',
      'feedback_incorrect_msg': 'A resposta era:',
      'points': 'Pontos',
      'status': 'Status',
      'completed': 'Completado',
      'return_home': 'Voltar ao Início',
      'mission_accomplished': 'Missão Cumprida!',
      'mission_message': 'Você alimentou seu espírito com a Verdade hoje.',
      'community_title': 'Comunidade',
      'community_subtitle': 'Compartilhe, aprenda e cresça junto com outros',
      'notifications_title': 'Notificações',
      'notifications_empty': 'Não há notificações',
      'mark_all_read': 'Marcar todas como lidas',
      'new_post': 'Nova',
      'anonymous': 'Anônimo',
      'counselor': 'CONSELHEIRO',
      'replies_count': 'Respostas ({count})',
      'posts_count': '{count} publicações',
      'write_reply': 'Escreva uma resposta...',
      'select_category': 'Selecione uma categoria',
      'which_category': 'Em qual categoria você deseja publicar?',
      'title_label': 'Título',
      'content_label': 'Conteúdo',
      'publish': 'Publicar',
      'publish_anonymous': 'Publicar anonimamente',
      'identity_hidden': 'Seu nome não será visível para os outros.',
      'hint_title': 'Ex: Oração por força',
      'hint_content': 'Conte-nos o que está em seu coração...',
      'cat_prayer': 'Pedidos de Oração',
      'cat_bible': 'Estudo Bíblico',
      'cat_testimony': 'Testemunhos',
      'cat_questions': 'Perguntas e Dúvidas',
      'cat_advice': 'Conselhos de Vida',
      'cat_praise': 'Louvor e Adoração',
      'desc_prayer': 'Apoiemo-nos uns aos outros em oração.',
      'desc_bible': 'Vamos aprofundar juntos na Palavra de Deus.',
      'desc_testimony': 'Conte o que Deus fez em sua vida.',
      'desc_questions': 'Um espaço seguro para resolver preocupações.',
      'desc_advice': 'Sabedoria prática para o dia a dia.',
      'desc_praise': 'Compartilhe música e experiências de adoração.',
      'hello': 'Olá, {name}',
      'days_victory': 'Dias em vitória',
      'days_label': 'Dias',
      'level_label': 'Nível {level}',
      'mascot_msg_1': 'Veja como você cresce!',
      'mascot_msg_2': 'Estou orgulhoso de você',
      'mascot_msg_3': 'Deus continua com você',
      'mascot_msg_4': 'Um dia de cada vez',
      'mascot_msg_5': 'Siga firme, você consegue',
      'sos_label': 'Vencendo a Tentação',
      'study_bible': 'Estudo Bíblico',
      'daily_verse': 'Versículo do dia',
      'my_progress': 'Meu Progresso',
      'social_media': 'Redes Sociais',
      'intercession_prayer': 'Oração e Intercessão',
      'support_conecta': 'Apoiar Conecta+',
      'donate': 'Doar',
      'manage_transformation': 'Gerencie seus planos de transformação',
      'in_progress': 'Em progresso',
      'available': 'Disponíveis',
      'view_all_plans': 'Ver todos os meus planos',
      'leave_request': 'Deixe seu pedido',
      'support_message': 'Ajude-nos a chegar a mais pessoas',
      'donation_desc':
          'Seu apoio me ajuda a manter os servidores e levar a palavra de Deus a mais jovens. Ao ser Premium, você terá uma experiência 100% livre de anúncios e me ajudará a alcançar a meta da Google Play Store.',
      'no_ads': 'Sem anúncios do Google em todo o app',
      'premium_button': 'Ser Premium por \$1 USD!',
      'paypal_note':
          '*Ao doar, envie-me seu e-mail pelo PayPal para ativar seu selo.',
      'growth_milestone_title': 'Estamos Crescendo!',
      'growth_milestone_subtitle': 'Conectados pelo mundo',
      'growth_milestone_goal': 'Meta Missional',
      'growth_milestone_completed': '{progress}% concluído',
      'growth_milestone_button': 'Legal!',
      'donation_missions_title': 'Apoie a Missão',
      'donation_missions_subtitle': 'PROJETO CONECTA+',
      'donation_missions_desc':
          'Seu apoio nos permite continuar levando esperança a milhares de jovens. Atualmente estamos trabalhando em missões especiais fora de nossas fronteiras.',
      'donation_mission_brasil': '🇧🇷 Pro-Brasil',
      'donation_mission_nicaragua': '🇳🇮 Pro-Nicaragua',
      'donation_bank_details': 'Depósito Bancário (Nicarágua):',
      'donation_bank_name': 'Banco Lafise',
      'donation_bank_account': 'Conta: 132247471',
      'donation_collaborators': 'Colaboradores de Destaque:',
      'donation_collaborator_marvin': 'Marvin Cruz Alvarado (Doou!)',
      'sos_title': 'Respire.',
      'sos_subtitle':
          'Você ainda não falhou. E mesmo que falhasse, Ele ainda te ama. Mas vamos fazer uma pausa de 1 minuto juntos.',
      'sos_disclaimer':
          'AVISO: Conecta+ é uma ferramenta espiritual. Em caso de emergência grave, ligue para 911.',
      'empty_struggles_title': 'Tudo em ordem!',
      'empty_struggles_desc': 'Você não tem batalhas ativas. Continue assim!',
      'empty_community_title': 'Seja o primeiro!',
      'empty_community_desc':
          'Ainda não há publicações nesta categoria. Compartilhe algo hoje.',

      // Youth Zone
      'youth_zone_title': 'Zona Jovem',
      'youth_music': 'Louvor',
      'youth_movies': 'Filmes',
      'youth_humor': 'Humor',
      'youth_no_music': 'Sem músicas ainda.',
      'youth_no_movies': 'Sem filmes ainda.',
      'youth_no_memes': 'Sem memes ainda.',
      'watch_trailer': 'Ver Trailer',

      // Social Media
      'join_community': 'Junte-se à Comunidade',
      'follow_instagram': 'Siga-nos no Instagram',
      'whatsapp_desc':
          'Receba apoio diário e conecte-se com outros em nosso grupo oficial do WhatsApp.',
      'instagram_desc':
          'Conteúdo diário de transformação, reflexões e novidades em @conectamas.',
      'join_group': 'Entrar no Grupo',
      'follow_button': 'Seguir no Instagram',
      'maybe_later': 'Talvez depois',

      // Games Common
      'game_over': 'Fim de Jogo',
      'level_completed': 'Nível Completado!',
      'final_score': 'Pontuação Final:',
      'exit_game': 'Sair',
      'back_menu': 'Voltar ao Menu',
      'revive_ad': 'Ver vídeo para reviver',
      'correct_exclamation': 'Correto!',
      'next_button': 'Próximo',
      'round_completed': 'Rodada Completada!',
      'come_back_later': 'Volte mais tarde para mais desafios.',
      'all_completed_title': 'Tudo Completado!',
      'all_completed_desc': 'Você completou todas as perguntas disponíveis!',

      // Trivia
      'trivia_title': 'Trivia Bíblica',
      'question_label': 'Pergunta',
      'out_of_lives': 'Você ficou sem vidas!',
      'round_success': 'Você respondeu todas as perguntas desta rodada!',

      // Verse Scramble
      'scramble_title': 'Ordene o Versículo',
      'verse_label': 'Versículo',
      'earned_manna': 'Você ganhou 10 Maná',
      'session_completed':
          'Você completou todos os versículos desta sessão. Volte mais tarde!',

      // Spiritual Combat Enhancements
      'spiritual_combat_title': 'Liberdade em Cristo',
      'struggle_summary': 'Resumo de Vida',
      'available_plans': 'Planos Disponíveis',
      'victory_hall': 'Salão de Vitórias',
      'victory_hall_subtitle': 'Vencido com sucesso',
      'plan_pending': 'Plano para iniciar',
      'battle_front': 'Frente de Batalha',
      'reflection': 'Reflexão de Graça',
      'register_victory': 'Registrar Vitória',
      'spiritual_weapons': 'Armas Espirituais',
      'biblical_advice': 'Conselhos Bíblicos',
      'sos_truths_title': '5 Verdades para você hoje:',
      'sos_prayer_title': 'Oração de Emergência',
      'sos_call_leader': 'Ligar para um líder',
      'sos_call_desc': 'Não lute sozinho',
      'sos_no_leader':
          'Você não configurou o número do seu líder em seu perfil.',
      'sos_pause_title': 'Pausa e Reconecta',
      'sos_pause_desc':
          'A ansiedade e a tentação muitas vezes nos roubam a perspectiva. Antes de agir, lembre-se: Deus continua no trono e Sua graça é suficiente para você hoje.',

      // Bible Chat
      'chat_guide_name': 'Guia Espiritual',
      'chat_welcome':
          'Olá, eu sou o seu guia. Como posso apoiá-lo em suas dúvidas bíblicas ou lutas hoje?',
      'chat_placeholder': 'Escreva sua dúvida aqui...',
      'save': 'Salvar',

      // Accountability
      'alliance_title': 'Aliança de Vitória',
      'alliance_subtitle': 'Não lute sozinho (Tiago 5:16)',
      'battle_companion': 'Companheiro de Batalha',
      'no_companion': 'Nenhum companheiro atribuído',
      'assign_companion': 'Atribuir Companheiro',
      'companion_phone': 'Telefone do Companheiro',
      'companion_name': 'Nome do Companheiro',
      'reinforcement_btn': 'BOTÃO DE REFORÇO',
      'reinforcement_desc': 'Alerta imediata ao seu companheiro',
      'reinforcement_sent': 'Reforço enviado! Seu companheiro foi alertado.',
      'honesty_checkin': 'Check-in de Honestidade',
      'honesty_desc': 'As 5 perguntas que libertam a alma',
      'q1_spirit': 'Você passou tempo sozinho com Deus hoje?',
      'q2_temptation': 'Você foi tentado na sua área de luta hoje?',
      'q3_failed': 'Você cedeu à tentação (pensamento ou ato)?',
      'q4_honesty': 'Você foi 100% honesto neste check-in?',
      'q5_action': 'Que passo você dará agora para se fortalecer?',
      'q_yes': 'Sim',
      'q_no': 'Não',
      'q_process': 'Processando honestidade...',
      'alliance_alert_msg':
          'Alerta Conecta+: Meu nome é %s e preciso de reforço espiritual AGORA. Por favor, me ligue ou faça uma oração por mim.',

      // Common UI
      'cancel': 'Cancelar',
      'error_label': 'Erro',
      'host_label': 'Anfitrião',
      'confirm': 'Confirmar',
      'create': 'Criar',
      'loading': 'Carregando...',
      'congrats': 'Excelente!',
      'oops': 'Oops!',
      'bronze': 'Bronze',
      'silver': 'Prata',
      'gold': 'Ouro',
      'diamond': 'Diamante',
      'spiritual_status_label': 'Estado Espiritual',
      'bio_label': 'Biografia',
      'country_label': 'País',
      'age_label': 'Idade',
      'gender_label': 'Gênero',
      'profile_type_label': 'Tipo de Perfil',
      'leader_phone_label': 'Telefone do Líder',

      // Study
      'study_title': 'Estudo Bíblico',
      'join_label': 'Unir-se',
      'new_study_room': 'Nova Sala de Estudo',
      'description_label': 'Descrição',
      'theme_placeholder': 'Tema (ex: Romanos 8)',
      'send_button': 'Enviar',
      'study_room': 'Sala de Estudo',
      'chat_hint': 'Escreva uma mensagem...',

      // Potato Game
      'potato_game_title': 'Batata Quente',
      'waiting_turn': 'Esperando seu turno...',
      'room_code_label': 'Código da Sala:',
      'players_joined': '{count} Jogadores Unidos',
      'start_game': 'INICIAR JOGO',
      'waiting_host': 'Esperando o anfitrião...',
      'pass_potato': 'Passe a batata!',
      'winner_label': 'Ganhador: {name}',
      'back_lobby': 'Voltar ao Lobby',

      // Leagues
      'leagues_title': 'Ligas',
      'league_label_text': 'Liga {name}',
      'ends_in_days': 'Termina em {count} dias',
      'promotion_label': '↑ Promoção',
      'demotion_label': '↓ Rebaixamento',

      // Login
      'welcome_back': 'Bem-vindo de volta',
      'login_subtitle': 'Entre para continuar seu caminho.',
      'email_or_username': 'E-mail ou Usuário',
      'email_or_username_hint': 'usuário ou nome@exemplo.com',
      'password_label': 'Senha',
      'password_hint': 'Insira sua senha',
      'forgot_password': 'Esqueceu sua senha?',
      'login_button': 'Iniciar Sessão',
      'no_account': 'Não tem uma conta? ',
      'register_here': 'Registre-se aqui',
      'footer_text': '© 2025 Conecta+\nSeu espaço seguro.',
      'enter_credentials_msg': 'Por favor, insira suas credenciais',
      'login_error_msg': 'Erro ao iniciar sessão',
      'critical_ui_error': 'Erro crítico na UI: {error}',

      // Register
      'join_conecta': 'Junte-se ao Conecta+',
      'register_subtitle': 'Sua jornada rumo à liberdade começa hoje.',
      'full_name_label': 'Nome Completo',
      'full_name_hint': 'Seu nome real',
      'username_label': 'Nome de Usuário',
      'username_hint': '@usuario',
      'email_label': 'E-mail',
      'email_hint': 'nome@exemplo.com',
      'password_register_hint': 'Mínimo 6 caracteres',
      'security_question_label': 'Pergunta de Segurança',
      'security_question':
          'Qual era o nome do seu primeiro animal de estimação?',
      'security_answer_label': 'Resposta de Segurança',
      'security_answer_hint': 'Escreva a resposta aqui',
      'security_note': '*Você usará esta resposta para recuperar sua senha.',
      'accept_terms_text': 'Li e aceito os Termos e Condições.',
      'register_button': 'Criar minha conta',
      'respect_space_msg':
          'Ao se registrar, você aceita que este é um espaço de respeito.',
      'already_have_account': 'Já tem uma conta? ',
      'login_link': 'Inicie sessão',
      'accept_terms_msg': 'Você deve aceitar os termos e condições',
      'complete_fields_msg': 'Por favor, complete todos os campos',
      'register_error_msg': 'Erro ao criar a conta',

      // Onboarding
      'welcome_title': 'Bem-vindo ao Conecta+',
      'spiritual_status_quest': 'Onde você está espiritualmente?',
      'accept_jesus': 'Aceitar Jesus pela Primeira Vez',
      'renew_faith': 'Reconciliar e Renovar minha Fé',
      'deepen_connection': 'Conectar mais Profundamente',
      'sins_title': 'Pecados que Quero Deixar',
      'sins_subtitle': 'Selecione o que ressoa com você. Isso é privado.',
      'problems_title': 'Problemas que Enfrento',
      'problems_subtitle': 'Com o que você luta atualmente?',
      'how_to_connect_title': 'Como Quero Conectar?',
      'how_to_connect_subtitle': 'De que formas você quer crescer com Deus?',
      'about_you_title': 'Sobre você',
      'gender_subtitle':
          'Para personalizar sua experiência, diga-nos seu gênero.',
      'male': 'Homem',
      'female': 'Mulher',
      'your_age_title': 'Sua Idade',
      'age_subtitle': 'Ajude-nos a personalizar sua experiência.',
      'mascot_name_title': 'Dê um nome para sua companheira',
      'mascot_subtitle': 'Sua mascote acompanhará você em cada passo.',
      'mascot_will_be_called': 'Sua mascote se chamará: {name}',
      'emergency_contact_title': 'Contato de Emergência',
      'leader_phone_subtitle':
          'Insira o WhatsApp do seu líder para tê-lo em mãos em caso de SOS.',
      'contact_saved': 'Contato salvo: {phone}',
      'skip': 'Prefiro ignorar',
      'community_intro_title': 'Comunidade de Apoio',
      'community_intro_subtitle':
          'No Conecta+ você não está sozinho. Você pode adicionar amigos para orar.',
      'anonymous_support_title': 'Apoio Anônimo e Seguro',
      'community_intro_desc':
          'Seus amigos poderão enviar mensagens de incentivo sem precisar ver seus detalhes privados.',
      'love_it_button': 'Adorei! Continuar',
      'help_us_grow_title': 'Ajude-nos a Crescer!',
      'help_us_grow_subtitle':
          'O Conecta+ é um projeto gratuito feito com amor.',
      'support_goal': 'Meta: Licença Play Store (\$25 USD)',
      'support_desc':
          'Cada contribuição nos aproxima da meta. Se este projeto abençoa sua vida, considere semear uma semente.',
      'want_to_support_button': 'Quero Apoiar',
      'continue_now_button': 'Continuar por agora',
      'all_set_title': 'Tudo Pronto!',
      'all_set_subtitle':
          'Você deu o primeiro passo para uma vida de maior conexão com Deus.',
      'start_journey_button': 'Começar minha Jornada!',
      'continue_button': 'Continuar',

      // Sins
      'sin_porn': 'Pornografia',
      'sin_lying': 'Mentira',
      'sin_anger': 'Raiva / Ira',
      'sin_pride': 'Orgulho',
      'sin_envy': 'Inveja',
      'sin_addictions': 'Vícios',
      'sin_toxic_rel': 'Relacionamentos Tóxicos',

      // Problems
      'prob_anxiety': 'Ansiedade / Estresse',
      'prob_depression': 'Depressão / Tristeza',
      'prob_loneliness': 'Solidão',
      'prob_self_esteem': 'Baixa autoestima',
      'prob_family': 'Problemas familiares',
      'prob_purpose': 'Falta de propósito',

      // Connection Methods
      'conn_pray': 'Orar mais',
      'conn_bible': 'Ler a Bíblia',
      'conn_fast': 'Jejuar',
      'conn_group': 'Unir-se a um grupo',
      'conn_worship': 'Adorar (música)',
      'conn_study': 'Estudar a Palavra',

      // Challenges
      'goal_achieved': 'META ALCANÇADA!',
      'goal_subtitle':
          'Você completou seus 5 desafios hoje. Sua fé se fortalece a cada dia!',
      'excellent_job': 'Excelente trabalho!',
      'oops_keep_trying': 'Oops! Continue tentando.',
      'which_word_correct': 'Qual palavra está correta?',
      'complete_verse_label': 'Complete o versículo:',
      'is_biblical_truth': 'Isso é uma verdade bíblica?',
      'excellent_feedback': 'Excelente!',
      'can_improve_feedback': 'Você pode melhorar!',
      'check_button': 'VERIFICAR',
      'true_label': 'Verdadeiro',
      'false_label': 'Falso',

      // Profile
      'profile_title': 'Meu Perfil',
      'no_bio': 'Sem biografia',
      'unspecified': 'Não especificado',
      'not_assigned': 'Não atribuído',
      'years_old': 'anos',
      'change_language': 'Alterar Idioma',
      'logout': 'Sair',
      'select_language': 'Selecionar Idioma',
      'user_label': 'Usuário',

      // Avatar
      'customize_avatar': 'Personalize seu Avatar',
      'done': 'Pronto',
      'tab_skin': 'Pele',
      'tab_hair': 'Cabelo',
      'tab_color': 'Cor',
      'tab_face': 'Rosto',
      'tab_clothes': 'Roupas',
      'tab_bg': 'Fundo',
      'hair_short': 'Curto',
      'hair_spiky': 'Espetado',
      'hair_long': 'Longo',
      'mouth_smile': 'Sorriso',
      'mouth_serious': 'Sério',
      'mouth_surprise': 'Surpresa',
    },
  };

  String _get(String key) => _localizedValues[locale.languageCode]![key]!;

  String get title => _get('title');
  String get welcome => _get('welcome');
  String get challengeTitle => _get('challengeTitle');
  String get days => _get('days');
  String get streak => _get('streak');
  String get completeChallenge => _get('complete_challenge');
  String get settings => _get('settings');
  String get language => _get('language');
  String get region => _get('region');

  // Challenge Page
  String get titleVerse => _get('title_verse');
  String get titleTruth => _get('title_truth');
  String get feedbackCorrect => _get('feedback_correct');
  String get feedbackIncorrect => _get('feedback_incorrect');
  String get feedbackCorrectMsg => _get('feedback_correct_msg');
  String get feedbackIncorrectMsg => _get('feedback_incorrect_msg');
  String get points => _get('points');
  String get status => _get('status');
  String get completed => _get('completed');
  String get returnHome => _get('return_home');
  String get missionAccomplished => _get('mission_accomplished');
  String get missionMessage => _get('mission_message');

  // Community
  String get communityTitle => _get('community_title');
  String get communitySubtitle => _get('community_subtitle');
  String get notificationsTitle => _get('notifications_title');
  String get notificationsEmpty => _get('notifications_empty');
  String get markAllRead => _get('mark_all_read');
  String get newPost => _get('new_post');
  String get anonymous => _get('anonymous');
  String get counselor => _get('counselor');
  String get writeReply => _get('write_reply');
  String get selectCategory => _get('select_category');
  String get whichCategory => _get('which_category');
  String get titleLabel => _get('title_label');
  String get contentLabel => _get('content_label');
  String get publish => _get('publish');
  String get publishAnonymous => _get('publish_anonymous');
  String get identityHidden => _get('identity_hidden');
  String get hintTitle => _get('hint_title');
  String get hintContent => _get('hint_content');

  // Categories
  String get catPrayer => _get('cat_prayer');
  String get catBible => _get('cat_bible');
  String get catTestimony => _get('cat_testimony');
  String get catQuestions => _get('cat_questions');
  String get catAdvice => _get('cat_advice');
  String get catPraise => _get('cat_praise');
  String get descPrayer => _get('desc_prayer');
  String get descBible => _get('desc_bible');
  String get descTestimony => _get('desc_testimony');
  String get descQuestions => _get('desc_questions');
  String get descAdvice => _get('desc_advice');
  String get descPraise => _get('desc_praise');

  // Dashboard
  String get daysVictory => _get('days_victory');
  String get daysLabel => _get('days_label');
  String levelLabel(int level) =>
      _get('level_label').replaceAll('{level}', level.toString());
  String get mascotMsg1 => _get('mascot_msg_1');
  String get mascotMsg2 => _get('mascot_msg_2');
  String get mascotMsg3 => _get('mascot_msg_3');
  String get mascotMsg4 => _get('mascot_msg_4');
  String get mascotMsg5 => _get('mascot_msg_5');
  String get sosLabel => _get('sos_label');
  String get studyBible => _get('study_bible');
  String get dailyVerse => _get('daily_verse');
  String get myProgress => _get('my_progress');
  String get socialMedia => _get('social_media');
  String get intercessionPrayer => _get('intercession_prayer');
  String get supportConecta => _get('support_conecta');
  String get donate => _get('donate');
  String get manageTransformation => _get('manage_transformation');
  String get inProgress => _get('in_progress');
  String get available => _get('available');
  String get viewAllPlans => _get('view_all_plans');
  String get leaveRequest => _get('leave_request');
  String get supportMessage => _get('support_message');
  String get donationDesc => _get('donation_desc');
  String get noAds => _get('no_ads');
  String get premiumButton => _get('premium_button');
  String get paypalNote => _get('paypal_note');
  String get growthMilestoneTitle => _get('growth_milestone_title');
  String get growthMilestoneSubtitle => _get('growth_milestone_subtitle');
  String get growthMilestoneGoal => _get('growth_milestone_goal');
  String growthMilestoneCompleted(String progress) =>
      _get('growth_milestone_completed').replaceAll('{progress}', progress);
  String get growthMilestoneButton => _get('growth_milestone_button');

  String get donationMissionsTitle => _get('donation_missions_title');
  String get donationMissionsSubtitle => _get('donation_missions_subtitle');
  String get donationMissionsDesc => _get('donation_missions_desc');
  String get donationMissionBrasil => _get('donation_mission_brasil');
  String get donationMissionNicaragua => _get('donation_mission_nicaragua');
  String get donationBankDetails => _get('donation_bank_details');
  String get donationBankName => _get('donation_bank_name');
  String get donationBankAccount => _get('donation_bank_account');
  String get donationCollaborators => _get('donation_collaborators');
  String get donationCollaboratorMarvin => _get('donation_collaborator_marvin');

  String get sosTitle => _get('sos_title');
  String get sosSubtitle => _get('sos_subtitle');
  String get sosDisclaimer => _get('sos_disclaimer');

  String get emptyStrugglesTitle => _get('empty_struggles_title');
  String get emptyStrugglesDesc => _get('empty_struggles_desc');
  String get emptyCommunityTitle => _get('empty_community_title');
  String get emptyCommunityDesc => _get('empty_community_desc');

  // Youth Zone
  String get youthZoneTitle => _get('youth_zone_title');
  String get youthMusic => _get('youth_music');
  String get youthMovies => _get('youth_movies');
  String get youthHumor => _get('youth_humor');
  String get youthNoMusic => _get('youth_no_music');
  String get youthNoMovies => _get('youth_no_movies');
  String get youthNoMemes => _get('youth_no_memes');
  String get watchTrailer => _get('watch_trailer');

  // Social Media
  String get joinCommunity => _get('join_community');
  String get followInstagram => _get('follow_instagram');
  String get whatsappDesc => _get('whatsapp_desc');
  String get instagramDesc => _get('instagram_desc');
  String get joinGroup => _get('join_group');
  String get followButton => _get('follow_button');
  String get maybeLater => _get('maybe_later');

  // Games Common
  String get gameOver => _get('game_over');
  String get levelCompleted => _get('level_completed');
  String get finalScore => _get('final_score');
  String get exitGame => _get('exit_game');
  String get backMenu => _get('back_menu');
  String get reviveAd => _get('revive_ad');
  String get correctExclamation => _get('correct_exclamation');
  String get nextButton => _get('next_button');
  String get roundCompleted => _get('round_completed');
  String get comeBackLater => _get('come_back_later');
  String get allCompletedTitle => _get('all_completed_title');
  String get allCompletedDesc => _get('all_completed_desc');

  // Trivia
  String get triviaTitle => _get('trivia_title');
  String get questionLabel => _get('question_label');
  String get outOfLives => _get('out_of_lives');
  String get roundSuccess => _get('round_success');

  // Verse Scramble
  String get scrambleTitle => _get('scramble_title');
  String get verseLabel => _get('verse_label');
  String get earnedManna => _get('earned_manna');
  String get sessionCompleted => _get('session_completed');

  // Spiritual Combat
  String get spiritualCombatTitle => _get('spiritual_combat_title');
  String get struggleSummary => _get('struggle_summary');
  String get availablePlans => _get('available_plans');
  String get victoryHall => _get('victory_hall');
  String get victoryHallSubtitle => _get('victory_hall_subtitle');
  String get planPending => _get('plan_pending');
  String get battleFront => _get('battle_front');
  String get reflection => _get('reflection');
  String get registerVictory => _get('register_victory');
  String get spiritualWeapons => _get('spiritual_weapons');
  String get biblicalAdvice => _get('biblical_advice');
  String get sosTruthsTitle => _get('sos_truths_title');
  String get sosPrayerTitle => _get('sos_prayer_title');
  String get sosCallLeader => _get('sos_call_leader');
  String get sosCallDesc => _get('sos_call_desc');
  String get sosNoLeader => _get('sos_no_leader');
  String get sosPauseTitle => _get('sos_pause_title');
  String get sosPauseDesc => _get('sos_pause_desc');

  // Bible Chat
  String get chatGuideName => _get('chat_guide_name');
  String get chatWelcome => _get('chat_welcome');
  String get chatPlaceholder => _get('chat_placeholder');
  String get save => _get('save');

  // Accountability
  String get allianceTitle => _get('alliance_title');
  String get allianceSubtitle => _get('alliance_subtitle');
  String get battleCompanion => _get('battle_companion');
  String get noCompanion => _get('no_companion');
  String get assignCompanion => _get('assign_companion');
  String get companionPhone => _get('companion_phone');
  String get companionName => _get('companion_name');
  String get reinforcementBtn => _get('reinforcement_btn');
  String get reinforcementDesc => _get('reinforcement_desc');
  String get reinforcementSent => _get('reinforcement_sent');
  String get honestyCheckin => _get('honesty_checkin');
  String get honestyDesc => _get('honesty_desc');
  String get q1Spirit => _get('q1_spirit');
  String get q2Temptation => _get('q2_temptation');
  String get q3Failed => _get('q3_failed');
  String get q4Honesty => _get('q4_honesty');
  String get q5Action => _get('q5_action');
  String get qYes => _get('q_yes');
  String get qNo => _get('q_no');
  String get qProcess => _get('q_process');
  String get allianceAlertMsg => _get('alliance_alert_msg');

  // Common UI
  String get cancel => _get('cancel');
  String get errorLabel => _get('error_label');
  String get hostLabel => _get('host_label');
  String get confirm => _get('confirm');
  String get create => _get('create');
  String get loading => _get('loading');
  String get congrats => _get('congrats');
  String get oops => _get('oops');
  String get bronze => _get('bronze');
  String get silver => _get('silver');
  String get gold => _get('gold');
  String get diamond => _get('diamond');
  String get spiritualStatusLabel => _get('spiritual_status_label');
  String get bioLabel => _get('bio_label');
  String get countryLabel => _get('country_label');
  String get ageLabel => _get('age_label');
  String get genderLabel => _get('gender_label');
  String get profileTypeLabel => _get('profile_type_label');
  String get leaderPhoneLabel => _get('leader_phone_label');

  // Study
  String get studyTitle => _get('study_title');
  String get joinLabel => _get('join_label');
  String get newStudyRoom => _get('new_study_room');
  String get descriptionLabel => _get('description_label');
  String get themePlaceholder => _get('theme_placeholder');
  String get sendButton => _get('send_button');
  String get studyRoom => _get('study_room');
  String get chatHint => _get('chat_hint');

  // Potato Game
  String get potatoGameTitle => _get('potato_game_title');
  String get waitingTurn => _get('waiting_turn');
  String get roomCodeLabel => _get('room_code_label');
  String get startGame => _get('start_game');
  String get waitingHost => _get('waiting_host');
  String get passPotato => _get('pass_potato');
  String get backLobby => _get('back_lobby');

  // Leagues
  String get leaguesTitle => _get('leagues_title');
  String get promotionLabel => _get('promotion_label');
  String get demotionLabel => _get('demotion_label');

  // Challenges
  String get goalAchieved => _get('goal_achieved');
  String get goalSubtitle => _get('goal_subtitle');
  String get excellentJob => _get('excellent_job');
  String get oopsKeepTrying => _get('oops_keep_trying');
  String get whichWordCorrect => _get('which_word_correct');
  String get completeVerseLabel => _get('complete_verse_label');
  String get isBiblicalTruth => _get('is_biblical_truth');
  String get excellentFeedback => _get('excellent_feedback');
  String get canImproveFeedback => _get('can_improve_feedback');
  String get checkButton => _get('check_button');
  String get trueLabel => _get('true_label');
  String get falseLabel => _get('false_label');
  String get welcomeBack => _get('welcome_back');
  String get loginSubtitle => _get('login_subtitle');
  String get emailOrUsername => _get('email_or_username');
  String get emailOrUsernameHint => _get('email_or_username_hint');
  String get passwordLabel => _get('password_label');
  String get passwordHint => _get('password_hint');
  String get forgotPassword => _get('forgot_password');
  String get loginButton => _get('login_button');
  String get noAccount => _get('no_account');
  String get registerHere => _get('register_here');
  String get footerText => _get('footer_text');
  String get enterCredentials => _get('enter_credentials_msg');
  String get loginError => _get('login_error_msg');

  // Register
  String get joinConecta => _get('join_conecta');
  String get registerSubtitle => _get('register_subtitle');
  String get fullNameLabel => _get('full_name_label');
  String get fullNameHint => _get('full_name_hint');
  String get usernameLabel => _get('username_label');
  String get usernameHint => _get('username_hint');
  String get emailLabel => _get('email_label');
  String get emailHint => _get('email_hint');
  String get passwordRegisterHint => _get('password_register_hint');
  String get securityQuestionLabel => _get('security_question_label');
  String get securityQuestion => _get('security_question');
  String get securityAnswerLabel => _get('security_answer_label');
  String get securityAnswerHint => _get('security_answer_hint');
  String get securityNote => _get('security_note');
  String get acceptTermsText => _get('accept_terms_text');
  String get registerButton => _get('register_button');
  String get respectSpaceMsg => _get('respect_space_msg');
  String get alreadyHaveAccount => _get('already_have_account');
  String get loginLink => _get('login_link');
  String get acceptTermsMsg => _get('accept_terms_msg');
  String get completeFieldsMsg => _get('complete_fields_msg');
  String get registerErrorMsg => _get('register_error_msg');

  // Onboarding
  String get welcomeTitle => _get('welcome_title');
  String get spiritualStatusQuest => _get('spiritual_status_quest');
  String get acceptJesus => _get('accept_jesus');
  String get renewFaith => _get('renew_faith');
  String get deepenConnection => _get('deepen_connection');
  String get sinsTitle => _get('sins_title');
  String get sinsSubtitle => _get('sins_subtitle');
  String get problemsTitle => _get('problems_title');
  String get problemsSubtitle => _get('problems_subtitle');
  String get howToConnectTitle => _get('how_to_connect_title');
  String get howToConnectSubtitle => _get('how_to_connect_subtitle');
  String get aboutYouTitle => _get('about_you_title');
  String get genderSubtitle => _get('gender_subtitle');
  String get male => _get('male');
  String get female => _get('female');
  String get yourAgeTitle => _get('your_age_title');
  String get ageSubtitle => _get('age_subtitle');
  String get mascotNameTitle => _get('mascot_name_title');
  String get mascotSubtitle => _get('mascot_subtitle');
  String get emergencyContactTitle => _get('emergency_contact_title');
  String get leaderPhoneSubtitle => _get('leader_phone_subtitle');
  String get skip => _get('skip');
  String get communityIntroTitle => _get('community_intro_title');
  String get communityIntroSubtitle => _get('community_intro_subtitle');
  String get anonymousSupportTitle => _get('anonymous_support_title');
  String get communityIntroDesc => _get('community_intro_desc');
  String get loveItButton => _get('love_it_button');
  String get helpUsGrowTitle => _get('help_us_grow_title');
  String get helpUsGrowSubtitle => _get('help_us_grow_subtitle');
  String get supportGoal => _get('support_goal');
  String get supportDesc => _get('support_desc');
  String get wantToSupportButton => _get('want_to_support_button');
  String get continueNowButton => _get('continue_now_button');
  String get allSetTitle => _get('all_set_title');
  String get allSetSubtitle => _get('all_set_subtitle');
  String get startJourneyButton => _get('start_journey_button');
  String get continueButton => _get('continue_button');

  // Localized Lists
  List<String> get sinsList => [
        _get('sin_porn'),
        _get('sin_lying'),
        _get('sin_anger'),
        _get('sin_pride'),
        _get('sin_envy'),
        _get('sin_addictions'),
        _get('sin_toxic_rel'),
      ];

  List<String> get problemsList => [
        _get('prob_anxiety'),
        _get('prob_depression'),
        _get('prob_loneliness'),
        _get('prob_self_esteem'),
        _get('prob_family'),
        _get('prob_purpose'),
      ];

  List<String> get connectionMethodsList => [
        _get('conn_pray'),
        _get('conn_bible'),
        _get('conn_fast'),
        _get('conn_group'),
        _get('conn_worship'),
        _get('conn_study'),
      ];

  String mascotWillBeCalled(String name) =>
      _get('mascot_will_be_called').replaceAll('{name}', name);

  String contactSaved(String phone) =>
      _get('contact_saved').replaceAll('{phone}', phone);

  String criticalError(String error) =>
      _get('critical_ui_error').replaceAll('{error}', error);

  String leagueLabelText(String name) =>
      _get('league_label_text').replaceAll('{name}', name);

  // Profile
  String get profileTitle => _get('profile_title');
  String get noBio => _get('no_bio');
  String get unspecified => _get('unspecified');
  String get notAssigned => _get('not_assigned');
  String get yearsOld => _get('years_old');
  String get changeLanguage => _get('change_language');
  String get logout => _get('logout');
  String get selectLanguage => _get('select_language');
  String get userLabel => _get('user_label');

  // Avatar
  String get customizeAvatar => _get('customize_avatar');
  String get done => _get('done');
  String get tabSkin => _get('tab_skin');
  String get tabHair => _get('tab_hair');
  String get tabColor => _get('tab_color');
  String get tabFace => _get('tab_face');
  String get tabClothes => _get('tab_clothes');
  String get tabBg => _get('tab_bg');
  String get hairShort => _get('hair_short');
  String get hairSpiky => _get('hair_spiky');
  String get hairLong => _get('hair_long');
  String get mouthSmile => _get('mouth_smile');
  String get mouthSerious => _get('mouth_serious');
  String get mouthSurprise => _get('mouth_surprise');

  String endsInDays(int count) =>
      _get('ends_in_days').replaceAll('{count}', count.toString());

  String getLeagueName(String leagueCode) {
    switch (leagueCode.toUpperCase()) {
      case 'BRONZE':
        return bronze;
      case 'SILVER':
        return silver;
      case 'GOLD':
        return gold;
      case 'DIAMOND':
        return diamond;
      default:
        return leagueCode;
    }
  }

  // Parameterized strings
  String playersJoined(int count) =>
      _get('players_joined').replaceAll('{count}', count.toString());

  String winnerLabel(String name) =>
      _get('winner_label').replaceAll('{name}', name);

  // Parameterized strings
  String repliesCount(int count) =>
      _get('replies_count').replaceAll('{count}', count.toString());

  String postsCount(int count) =>
      _get('posts_count').replaceAll('{count}', count.toString());

  String hello(String name) => _get('hello').replaceAll('{name}', name);
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) =>
      ['es', 'en', 'pt'].contains(locale.languageCode);

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(AppLocalizations(locale));
  }

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}
