import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'study_repository.dart';
import '../../auth/data/auth_provider.dart';

final studyRepositoryProvider = Provider((ref) {
  final token = ref.watch(authProvider).token;
  return StudyRepository(token: token);
});

final studyRoomsProvider = StateNotifierProvider<StudyRoomsNotifier, AsyncValue<List<StudyRoom>>>((ref) {
  final repository = ref.watch(studyRepositoryProvider);
  return StudyRoomsNotifier(repository);
});

class StudyRoomsNotifier extends StateNotifier<AsyncValue<List<StudyRoom>>> {
  final StudyRepository _repository;

  StudyRoomsNotifier(this._repository) : super(const AsyncValue.loading()) {
    fetchRooms();
  }

  Future<void> fetchRooms() async {
    state = const AsyncValue.loading();
    try {
      final rooms = await _repository.getOpenRooms();
      state = AsyncValue.data(rooms);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> createRoom(String title, String theme, String description) async {
    await _repository.createRoom(title, theme, description);
    await fetchRooms();
  }
}

final studyChatProvider = StateNotifierProvider.family<StudyChatNotifier, AsyncValue<List<StudyMessage>>, String>((ref, roomId) {
  final repository = ref.watch(studyRepositoryProvider);
  return StudyChatNotifier(repository, roomId);
});

class StudyChatNotifier extends StateNotifier<AsyncValue<List<StudyMessage>>> {
  final StudyRepository _repository;
  final String _roomId;

  StudyChatNotifier(this._repository, this._roomId) : super(const AsyncValue.loading()) {
    fetchMessages();
  }

  Future<void> fetchMessages() async {
    try {
      final messages = await _repository.getMessages(_roomId);
      state = AsyncValue.data(messages);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> sendMessage(String content) async {
    await _repository.sendMessage(_roomId, content);
    await fetchMessages();
  }
}
