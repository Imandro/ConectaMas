class LeaderApplication {
  final String id;
  final String userId;
  final String status; // 'PENDING', 'APPROVED', 'REJECTED'
  final DateTime createdAt;
  
  // Form Data
  final String fullName;
  final String documentId;
  final DateTime birthDate;
  final String address;
  final String maritalStatus;
  final String testimony;
  final String motivation;

  LeaderApplication({
    required this.id,
    required this.userId,
    this.status = 'PENDING',
    required this.createdAt,
    required this.fullName,
    required this.documentId,
    required this.birthDate,
    required this.address,
    required this.maritalStatus,
    required this.testimony,
    required this.motivation,
  });

  factory LeaderApplication.fromMap(Map<String, dynamic> map) {
    return LeaderApplication(
      id: map['id'],
      userId: map['userId'],
      status: map['status'] ?? 'PENDING',
      createdAt: map['createdAt'] is DateTime 
          ? map['createdAt'] 
          : DateTime.tryParse(map['createdAt'].toString()) ?? DateTime.now(),
      fullName: map['fullName'] ?? '',
      documentId: map['documentId'] ?? '',
      birthDate: map['birthDate'] is DateTime 
          ? map['birthDate'] 
          : DateTime.tryParse(map['birthDate'].toString()) ?? DateTime.now(),
      address: map['address'] ?? '',
      maritalStatus: map['maritalStatus'] ?? '',
      testimony: map['testimony'] ?? '',
      motivation: map['motivation'] ?? '',
    );
  }
}
