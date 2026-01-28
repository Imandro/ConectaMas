class Question {
  final String id;
  final String title;
  final String content;
  final String userId;
  final int views;
  final int likes;
  final bool isTrending;
  final String? tags;
  final DateTime createdAt;

  final String? userName;
  final String? userImage;
  final String? categoryId;

  Question({
    required this.id,
    required this.title,
    required this.content,
    required this.userId,
    this.views = 0,
    this.likes = 0,
    this.isTrending = false,
    this.tags,
    required this.createdAt,
    this.userName,
    this.userImage,
    this.categoryId,
  });

  factory Question.fromMap(Map<String, dynamic> map) {
    return Question(
      id: map['id'],
      title: map['title'],
      content: map['content'],
      userId: map['userId'],
      views: map['views'] ?? 0,
      likes: map['likes'] ?? 0,
      isTrending: map['isTrending'] ?? false,
      tags: map['tags'],
      createdAt: map['createdAt'] is DateTime
          ? map['createdAt']
          : DateTime.tryParse(map['createdAt'].toString()) ?? DateTime.now(),
      userName: map['userName'], // alias from join
      userImage: map['userImage'], // alias from join
      categoryId: map['categoryId'],
    );
  }
}

class Answer {
  final String id;
  final String questionId;
  final String userId;
  final String content;
  final int likes;
  final bool isAccepted;
  final DateTime createdAt;

  final String? userName;
  final String? userImage;

  Answer({
    required this.id,
    required this.questionId,
    required this.userId,
    required this.content,
    this.likes = 0,
    this.isAccepted = false,
    required this.createdAt,
    this.userName,
    this.userImage,
  });

  factory Answer.fromMap(Map<String, dynamic> map) {
    return Answer(
      id: map['id'],
      questionId: map['questionId'],
      userId: map['userId'],
      content: map['content'],
      likes: map['likes'] ?? 0,
      isAccepted: map['isAccepted'] ?? false,
      createdAt: map['createdAt'] is DateTime
          ? map['createdAt']
          : DateTime.tryParse(map['createdAt'].toString()) ?? DateTime.now(),
      userName: map['userName'],
      userImage: map['userImage'],
    );
  }
}
