class AnnouncementModel {
  final String id;
  final String title;
  final String? subtitle;
  final String content;
  final bool isCritical;
  final String? actionText;
  final String? actionUrl;
  final List<AnnouncementStat>? stats;
  final DateTime publishedAt;

  AnnouncementModel({
    required this.id,
    required this.title,
    this.subtitle,
    required this.content,
    this.isCritical = false,
    this.actionText,
    this.actionUrl,
    this.stats,
    required this.publishedAt,
  });

  factory AnnouncementModel.fromJson(Map<String, dynamic> json) {
    return AnnouncementModel(
      id: json['id'],
      title: json['title'],
      subtitle: json['subtitle'],
      content: json['content'],
      isCritical: json['isCritical'] ?? false,
      actionText: json['actionText'],
      actionUrl: json['actionUrl'],
      stats: json['stats'] != null 
        ? (json['stats'] as List).map((i) => AnnouncementStat.fromJson(i)).toList()
        : null,
      publishedAt: DateTime.parse(json['publishedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'subtitle': subtitle,
      'content': content,
      'isCritical': isCritical,
      'actionText': actionText,
      'actionUrl': actionUrl,
      'stats': stats?.map((i) => i.toJson()).toList(),
      'publishedAt': publishedAt.toIso8601String(),
    };
  }
}

class AnnouncementStat {
  final String label;
  final String value;

  AnnouncementStat({required this.label, required this.value});

  factory AnnouncementStat.fromJson(Map<String, dynamic> json) {
    return AnnouncementStat(
      label: json['label'],
      value: json['value'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'label': label,
      'value': value,
    };
  }
}
