import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'models/bible_model.dart';

final bibleProvider = StateNotifierProvider<BibleNotifier, BibleState>((ref) {
  return BibleNotifier();
});

class BibleState {
  final List<BibleBook> books;
  final bool isLoading;
  final String? error;
  final int selectedBookIndex;
  final int selectedChapter;

  BibleState({
    this.books = const [],
    this.isLoading = true,
    this.error,
    this.selectedBookIndex = 0,
    this.selectedChapter = 1,
  });

  BibleBook? get currentBook => books.isNotEmpty ? books[selectedBookIndex] : null;
  List<String>? get currentChapterVerses => currentBook != null && selectedChapter <= currentBook!.chapterCount
      ? currentBook!.chapters[selectedChapter - 1]
      : null;

  BibleState copyWith({
    List<BibleBook>? books,
    bool? isLoading,
    String? error,
    int? selectedBookIndex,
    int? selectedChapter,
  }) {
    return BibleState(
      books: books ?? this.books,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      selectedBookIndex: selectedBookIndex ?? this.selectedBookIndex,
      selectedChapter: selectedChapter ?? this.selectedChapter,
    );
  }
}

class BibleNotifier extends StateNotifier<BibleState> {
  BibleNotifier() : super(BibleState()) {
    loadBible();
  }

  static const List<String> _bookNames = [
    "Génesis", "Éxodo", "Levítico", "Números", "Deuteronomio", "Josué", "Jueces", "Rut", "1 Samuel", "2 Samuel",
    "1 Reyes", "2 Reyes", "1 Crónicas", "2 Crónicas", "Esdras", "Nehemías", "Ester", "Job", "Salmos", "Proverbios",
    "Eclesiastés", "Cantares", "Isaías", "Jeremías", "Lamentaciones", "Ezequiel", "Daniel", "Oseas", "Joel", "Amós",
    "Abdías", "Jonás", "Miqueas", "Nahúm", "Habacuc", "Sofonías", "Hageo", "Zacarías", "Malaquías", "Mateo",
    "Marcos", "Lucas", "Juan", "Hechos", "Romanos", "1 Corintios", "2 Corintios", "Gálatas", "Efesios", "Filipenses",
    "Colosenses", "1 Tesalonicenses", "2 Tesalonicenses", "1 Timoteo", "2 Timoteo", "Tito", "Filemón", "Hebreos",
    "Santiago", "1 Pedro", "2 Pedro", "1 Juan", "2 Juan", "3 Juan", "Judas", "Apocalipsis"
  ];

  Future<void> loadBible() async {
    try {
      final String response = await rootBundle.loadString('assets/bible/es_rvr.json');
      final List<dynamic> data = json.decode(response);
      
      final List<BibleBook> books = [];
      for (int i = 0; i < data.length; i++) {
        if (i < _bookNames.length) {
          books.add(BibleBook.fromJson(data[i], _bookNames[i]));
        }
      }

      state = state.copyWith(books: books, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  void selectBook(int index) {
    state = state.copyWith(selectedBookIndex: index, selectedChapter: 1);
  }

  void selectChapter(int chapter) {
    state = state.copyWith(selectedChapter: chapter);
  }

  void nextChapter() {
    final book = state.currentBook;
    if (book == null) return;

    if (state.selectedChapter < book.chapterCount) {
      state = state.copyWith(selectedChapter: state.selectedChapter + 1);
    } else if (state.selectedBookIndex < state.books.length - 1) {
      state = state.copyWith(
        selectedBookIndex: state.selectedBookIndex + 1,
        selectedChapter: 1,
      );
    }
  }

  void prevChapter() {
    if (state.selectedChapter > 1) {
      state = state.copyWith(selectedChapter: state.selectedChapter - 1);
    } else if (state.selectedBookIndex > 0) {
      final prevBook = state.books[state.selectedBookIndex - 1];
      state = state.copyWith(
        selectedBookIndex: state.selectedBookIndex - 1,
        selectedChapter: prevBook.chapterCount,
      );
    }
  }
}
