class TutorialModel {
  final String id;
  final String title;
  final String description;
  final String category;
  final String iconName;
  final String colorHex;
  final String href;
  final int order;

  TutorialModel({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.iconName,
    required this.colorHex,
    required this.href,
    this.order = 0,
  });

  factory TutorialModel.fromJson(Map<String, dynamic> json) {
    return TutorialModel(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      category: json['category'],
      iconName: json['icon'],
      colorHex: json['color'],
      href: json['href'],
      order: json['order'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'category': category,
      'icon': iconName,
      'color': colorHex,
      'href': href,
      'order': order,
    };
  }
}
