import 'package:flutter_riverpod/flutter_riverpod.dart';

class HelpfulVerse {
  final String text;
  final String reference;
  final List<String> tags;

  HelpfulVerse({
    required this.text,
    required this.reference,
    required this.tags,
  });
}

final helpfulVersesProvider = Provider<List<HelpfulVerse>>((ref) {
  return [
    HelpfulVerse(
      text: "No se inquieten por nada; más bien, en toda ocasión, con oración y ruego, presenten sus peticiones a Dios y denle gracias.",
      reference: "Filipenses 4:6",
      tags: ["Ansiedad", "Paz"],
    ),
    HelpfulVerse(
      text: "Jehová es mi pastor; nada me faltará.",
      reference: "Salmos 23:1",
      tags: ["Provisión", "Confianza"],
    ),
    HelpfulVerse(
      text: "Todo lo puedo en Cristo que me fortalece.",
      reference: "Filipenses 4:13",
      tags: ["Fortaleza", "Poder"],
    ),
    HelpfulVerse(
      text: "Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.",
      reference: "Josué 1:9",
      tags: ["Valentía", "Miedo"],
    ),
    HelpfulVerse(
      text: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.",
      reference: "Mateo 11:28",
      tags: ["Descanso", "Cansancio"],
    ),
  ];
});

final selectedTagProvider = StateProvider<String?>((ref) => null);

final filteredVersesProvider = Provider<List<HelpfulVerse>>((ref) {
  final verses = ref.watch(helpfulVersesProvider);
  final selectedTag = ref.watch(selectedTagProvider);

  if (selectedTag == null) return verses;
  return verses.where((v) => v.tags.contains(selectedTag)).toList();
});
