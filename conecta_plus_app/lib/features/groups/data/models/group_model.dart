class Group {
  final String id;
  final String name;
  final String? motto;
  final String? accessCode;
  final String? inviteLink;
  final String leaderId;
  final String? leaderName; // Joined
  final DateTime createdAt;
  final DateTime updatedAt;
  
  // Stats (optional/joined)
  final int memberCount;

  Group({
    required this.id,
    required this.name,
    this.motto,
    this.accessCode,
    this.inviteLink,
    required this.leaderId,
    this.leaderName,
    required this.createdAt,
    required this.updatedAt,
    this.memberCount = 0,
  });

  factory Group.fromMap(Map<String, dynamic> map) {
    return Group(
      id: map['id'],
      name: map['name'],
      motto: map['motto'],
      accessCode: map['accessCode'],
      inviteLink: map['inviteLink'],
      leaderId: map['leaderId'],
      leaderName: map['leaderName'],
      createdAt: map['createdAt'] is DateTime 
          ? map['createdAt'] 
          : DateTime.tryParse(map['createdAt'].toString()) ?? DateTime.now(),
      updatedAt: map['updatedAt'] is DateTime 
          ? map['updatedAt'] 
          : DateTime.tryParse(map['updatedAt'].toString()) ?? DateTime.now(),
      memberCount: map['memberCount'] ?? 0,
    );
  }
}

class GroupMember {
  final String id;
  final String groupId;
  final String userId;
  final String? userName; // Joined
  final String? userImage; // Joined
  final String role; // 'MEMBER', 'ADMIN'
  final int weeklyXP;
  final int totalXP;
  final DateTime joinedAt;

  GroupMember({
    required this.id,
    required this.groupId,
    required this.userId,
    this.userName,
    this.userImage,
    required this.role,
    this.weeklyXP = 0,
    this.totalXP = 0,
    required this.joinedAt,
  });
  
  factory GroupMember.fromMap(Map<String, dynamic> map) {
    return GroupMember(
      id: map['id'],
      groupId: map['groupId'],
      userId: map['userId'],
      userName: map['userName'],
      userImage: map['userImage'],
      role: map['role'] ?? 'MEMBER',
      weeklyXP: map['weeklyXP'] ?? 0,
      totalXP: map['totalXP'] ?? 0,
      joinedAt: map['joinedAt'] is DateTime 
          ? map['joinedAt'] 
          : DateTime.tryParse(map['joinedAt'].toString()) ?? DateTime.now(),
    );
  }
}
