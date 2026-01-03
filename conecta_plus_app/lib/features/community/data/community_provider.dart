import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/material.dart';

class CommunityCategory {
  final String id;
  final String name;
  final String description;
  final String icon;
  final Color color;
  final int postCount;

  CommunityCategory({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
    required this.color,
    this.postCount = 0,
  });
}

class CommunityState {
  final List<CommunityCategory> categories;
  final bool isLoading;

  CommunityState({
    this.categories = const [],
    this.isLoading = false,
  });

  CommunityState copyWith({
    List<CommunityCategory>? categories,
    bool? isLoading,
  }) {
    return CommunityState(
      categories: categories ?? this.categories,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class CommunityNotifier extends StateNotifier<CommunityState> {
  CommunityNotifier() : super(CommunityState()) {
    _init();
  }

  void _init() {
    state = state.copyWith(
      categories: [
        CommunityCategory(
          id: 'peticiones-oracion',
          name: 'Peticiones de Oración',
          description: 'Apoyémonos los unos a los otros en oración.',
          icon: '🙏',
          color: const Color(0xFFDBEAFE),
          postCount: 124,
        ),
        CommunityCategory(
          id: 'estudio-biblico',
          name: 'Estudio Bíblico',
          description: 'Profundicemos juntos en la Palabra de Dios.',
          icon: '📖',
          color: const Color(0xFFDCFCE7),
          postCount: 85,
        ),
        CommunityCategory(
          id: 'testimonios',
          name: 'Testimonios',
          description: 'Cuenta lo que Dios ha hecho en tu vida.',
          icon: '✨',
          color: const Color(0xFFFEF3C7),
          postCount: 56,
        ),
        CommunityCategory(
          id: 'preguntas-dudas',
          name: 'Preguntas y Dudas',
          description: 'Un espacio seguro para resolver inquietudes.',
          icon: '💡',
          color: const Color(0xFFF3E8FF),
          postCount: 42,
        ),
        CommunityCategory(
          id: 'consejos-vida',
          name: 'Consejos de Vida',
          description: 'Sabiduría práctica para el día a día.',
          icon: '🌱',
          color: const Color(0xFFFFEDD5),
          postCount: 28,
        ),
        CommunityCategory(
          id: 'alabanza-adoracion',
          name: 'Alabanza y Adoración',
          description: 'Comparte música y experiencias de adoración.',
          icon: '🎸',
          color: const Color(0xFFE0F2FE),
          postCount: 19,
        ),
      ],
    );
  }
}

final communityProvider = StateNotifierProvider<CommunityNotifier, CommunityState>((ref) {
  return CommunityNotifier();
});
