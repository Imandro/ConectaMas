import 'dart:convert';

class VictoryRecord {
  final String id;
  final DateTime date;
  final String battleFront; // e.g., "Ira", "Lujuria", "Orgullo"
  final String reflection;
  final bool usedGrace; // Always true in a Christ-centered context

  VictoryRecord({
    required this.id,
    required this.date,
    required this.battleFront,
    required this.reflection,
    this.usedGrace = true,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'date': date.toIso8601String(),
      'battleFront': battleFront,
      'reflection': reflection,
      'usedGrace': usedGrace,
    };
  }

  factory VictoryRecord.fromMap(Map<String, dynamic> map) {
    return VictoryRecord(
      id: map['id'] ?? '',
      date: DateTime.parse(map['date']),
      battleFront: map['battleFront'] ?? '',
      reflection: map['reflection'] ?? '',
      usedGrace: map['usedGrace'] ?? true,
    );
  }

  String toJson() => json.encode(toMap());

  factory VictoryRecord.fromJson(String source) =>
      VictoryRecord.fromMap(json.decode(source));
}
