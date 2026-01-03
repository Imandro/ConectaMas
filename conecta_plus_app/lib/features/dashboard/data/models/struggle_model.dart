enum StruggleStatus {
  active,
  vencido,
}

class StruggleDay {
  final int dayNumber;
  final String title;
  final String bibleStudy;
  final String practicalExercise;
  final String youthAdvice;
  final String reflectionQuestions;
  final String scripture;

  StruggleDay({
    required this.dayNumber,
    required this.title,
    required this.bibleStudy,
    required this.practicalExercise,
    required this.youthAdvice,
    required this.reflectionQuestions,
    required this.scripture,
  });

  factory StruggleDay.fromJson(Map<String, dynamic> json) {
    return StruggleDay(
      dayNumber: json['dayNumber'],
      title: json['title'],
      bibleStudy: json['bibleStudy'],
      practicalExercise: json['practicalExercise'],
      youthAdvice: json['youthAdvice'],
      reflectionQuestions: json['reflectionQuestions'],
      scripture: json['scripture'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'dayNumber': dayNumber,
      'title': title,
      'bibleStudy': bibleStudy,
      'practicalExercise': practicalExercise,
      'youthAdvice': youthAdvice,
      'reflectionQuestions': reflectionQuestions,
      'scripture': scripture,
    };
  }
}

class Struggle {
  final String id;
  final String title;
  final String description;
  final StruggleStatus status;
  final int currentDay;
  final List<int> completedDays;
  final bool isStarted;
  final DateTime? startDate;
  final List<StruggleDay> days;

  Struggle({
    required this.id,
    required this.title,
    required this.description,
    this.status = StruggleStatus.active,
    this.currentDay = 1,
    this.completedDays = const [],
    this.isStarted = false,
    this.startDate,
    this.days = const [],
  });

  double get progress => (completedDays.length / 7.0);

  Struggle copyWith({
    String? id,
    String? title,
    String? description,
    StruggleStatus? status,
    int? currentDay,
    List<int>? completedDays,
    bool? isStarted,
    DateTime? startDate,
    List<StruggleDay>? days,
  }) {
    return Struggle(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      status: status ?? this.status,
      currentDay: currentDay ?? this.currentDay,
      completedDays: completedDays ?? this.completedDays,
      isStarted: isStarted ?? this.isStarted,
      startDate: startDate ?? this.startDate,
      days: days ?? this.days,
    );
  }

  factory Struggle.fromJson(Map<String, dynamic> json) {
    return Struggle(
      id: json['id'],
      title: json['title'],
      description: json['description'] ?? '',
      status: json['status'] == 'vencido'
          ? StruggleStatus.vencido
          : StruggleStatus.active,
      currentDay: json['currentDay'] ?? 1,
      completedDays: json['completedDays'] != null
          ? (json['completedDays'] as String)
              .split(',')
              .where((s) => s.isNotEmpty)
              .map(int.parse)
              .toList()
          : [],
      isStarted: json['isStarted'] ?? false,
      startDate:
          json['startDate'] != null ? DateTime.parse(json['startDate']) : null,
      days: json['days'] != null
          ? (json['days'] as List).map((d) => StruggleDay.fromJson(d)).toList()
          : [],
    );
  }
}
