import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'models/tutorial_model.dart';

final tutorialsProvider = Provider<List<TutorialModel>>((ref) {
  return [
    TutorialModel(
      id: 'install',
      title: 'Instalación PWA',
      description: 'Cómo instalar Conecta+ BETA en tu pantalla de inicio como una App real.',
      category: 'Esencial',
      iconName: 'download',
      colorHex: '0B1B32',
      href: '/install',
      order: 1,
    ),
    TutorialModel(
      id: 'llami',
      title: 'Llami: Espíritu de Fuego',
      description: 'Aprende a cuidar tu llama interior y subir de nivel.',
      category: 'Crecimiento',
      iconName: 'local_fire_department',
      colorHex: 'FBBF24',
      href: '/llami',
      order: 2,
    ),
    TutorialModel(
      id: 'spiritual',
      title: 'Lectura Diaria',
      description: 'Saca el máximo provecho a tus devocionales y lectura bíblica.',
      category: 'Espiritual',
      iconName: 'menu_book',
      colorHex: '22C55E',
      href: '/spiritual',
      order: 3,
    ),
    TutorialModel(
      id: 'sos',
      title: 'Zona de Auxilio (SOS)',
      description: 'Qué hacer en momentos de crisis y cómo contactar ayuda.',
      category: 'Soporte',
      iconName: 'warning_amber',
      colorHex: 'EF4444',
      href: '/sos',
      order: 4,
    ),
    TutorialModel(
      id: 'community',
      title: 'Comunidad y Foro',
      description: 'Cómo interactuar, pedir oración y apoyar a otros.',
      category: 'Comunidad',
      iconName: 'people',
      colorHex: '3B82F6',
      href: '/community',
      order: 5,
    ),
  ];
});
