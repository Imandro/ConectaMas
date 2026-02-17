import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'verse_repository.dart';

class VerseState {
  final String content;
  final String reference;
  final String imageUrl;
  final bool isLoading;

  VerseState({
    required this.content,
    required this.reference,
    required this.imageUrl,
    this.isLoading = false,
  });

  VerseState copyWith({
    String? content,
    String? reference,
    String? imageUrl,
    bool? isLoading,
  }) {
    return VerseState(
      content: content ?? this.content,
      reference: reference ?? this.reference,
      imageUrl: imageUrl ?? this.imageUrl,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class VerseNotifier extends StateNotifier<AsyncValue<VerseState>> {
  final VerseRepository _repository = VerseRepository();

  VerseNotifier() : super(const AsyncValue.loading()) {
    fetchVerse();
  }

  Future<void> fetchVerse() async {
    try {
      final data = await _repository.getDailyVerse();
      if (data != null) {
        state = AsyncValue.data(VerseState(
          content: data['content'],
          reference: data['reference'],
          imageUrl: data['imageUrl'] ??
              "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1600",
        ));
      } else {
        // Fallback
        state = AsyncValue.data(VerseState(
          content: "Entonces no sería yo avergonzado.",
          reference: "Salmos 119:6",
          imageUrl:
              "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1600",
        ));
      }
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final verseProvider =
    StateNotifierProvider<VerseNotifier, AsyncValue<VerseState>>((ref) {
  return VerseNotifier();
});
