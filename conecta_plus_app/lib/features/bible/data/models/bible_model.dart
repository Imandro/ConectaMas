import 'dart:convert';

class BibleBook {
  final String name;
  final String abbrev;
  final List<List<String>> chapters;

  BibleBook({
    required this.name,
    required this.abbrev,
    required this.chapters,
  });

  int get chapterCount => chapters.length;

  factory BibleBook.fromJson(Map<String, dynamic> json, String name) {
    return BibleBook(
      name: name,
      abbrev: json['abbrev'],
      chapters: (json['chapters'] as List)
          .map((c) => (c as List).map((v) => v.toString()).toList())
          .toList(),
    );
  }
}

class BibleVerse {
  final int number;
  final String text;

  BibleVerse({required this.number, required this.text});
}
