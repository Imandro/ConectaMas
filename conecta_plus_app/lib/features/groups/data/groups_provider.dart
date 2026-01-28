import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'groups_repository.dart';
import 'models/group_model.dart';

class GroupsState {
  final List<Group> myGroups;
  final Group? currentGroup;
  final List<Map<String, dynamic>> currentTasks;
  final List<Map<String, dynamic>> currentNeeds;
  final List<GroupMember> currentMembers;
  final bool isLoading;
  final String? error;

  GroupsState({
    this.myGroups = const [],
    this.currentGroup,
    this.currentMembers = const [],
    this.currentTasks = const [],
    this.currentNeeds = const [],
    this.isLoading = false,
    this.error,
  });

  GroupsState copyWith({
    List<Group>? myGroups,
    Group? currentGroup,
    List<GroupMember>? currentMembers,
    List<Map<String, dynamic>>? currentTasks,
    List<Map<String, dynamic>>? currentNeeds,
    bool? isLoading,
    String? error,
    bool clearCurrent = false,
  }) {
    return GroupsState(
      myGroups: myGroups ?? this.myGroups,
      currentGroup: clearCurrent ? null : (currentGroup ?? this.currentGroup),
      currentMembers:
          clearCurrent ? [] : (currentMembers ?? this.currentMembers),
      currentTasks: clearCurrent ? [] : (currentTasks ?? this.currentTasks),
      currentNeeds: clearCurrent ? [] : (currentNeeds ?? this.currentNeeds),
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class GroupsNotifier extends StateNotifier<GroupsState> {
  final GroupsRepository _repository = GroupsRepository();

  GroupsNotifier() : super(GroupsState());

  Future<void> loadMyGroups(String userId) async {
    state = state.copyWith(isLoading: true);
    try {
      final groups = await _repository.getMyGroups(userId);
      state = state.copyWith(myGroups: groups, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> loadGroupDetails(String groupId, String userId) async {
    state = state.copyWith(isLoading: true, clearCurrent: true);
    try {
      final group = await _repository.getGroupDetails(groupId);
      final members = await _repository.getGroupMembers(groupId);
      final tasks = await _repository.getGroupTasks(groupId, userId);

      List<Map<String, dynamic>> needs = [];
      if (group?.leaderId == userId) {
        needs = await _repository.getGroupNeeds(groupId);
      }

      state = state.copyWith(
        currentGroup: group,
        currentMembers: members,
        currentTasks: tasks,
        currentNeeds: needs,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> completeTask(
      String groupId, String taskId, String userId) async {
    final success = await _repository.completeTask(taskId, userId);
    if (success) {
      await loadGroupDetails(groupId, userId);
    }
  }

  Future<bool> submitNeed(
      String groupId, String userId, String content, bool isAnonymous) async {
    final success =
        await _repository.submitNeed(groupId, userId, content, isAnonymous);
    return success;
  }

  Future<bool> joinGroup(String userId, String accessCode) async {
    state = state.copyWith(isLoading: true);
    final success = await _repository.joinGroup(userId, accessCode);
    if (success) {
      await loadMyGroups(userId);
    } else {
      state = state.copyWith(
          isLoading: false, error: 'Código inválido o error al unir');
    }
    return success;
  }

  Future<bool> createGroup(String userId, String name, String motto) async {
    state = state.copyWith(isLoading: true);
    final success = await _repository.createGroup(userId, name, motto);
    if (success) {
      await loadMyGroups(userId);
    } else {
      state = state.copyWith(isLoading: false, error: 'Error al crear grupo');
    }
    return success;
  }

  Future<bool> submitLeaderApplication(
      String userId, Map<String, dynamic> data) async {
    state = state.copyWith(isLoading: true);
    final success = await _repository.submitLeaderApplication(
      userId: userId,
      fullName: data['fullName'],
      documentId: data['documentId'],
      birthDate: data['birthDate'],
      address: data['address'],
      maritalStatus: data['maritalStatus'],
      testimony: data['testimony'],
      motivation: data['motivation'],
    );
    state = state.copyWith(isLoading: false);
    return success;
  }
}

final groupsProvider =
    StateNotifierProvider<GroupsNotifier, GroupsState>((ref) {
  return GroupsNotifier();
});
