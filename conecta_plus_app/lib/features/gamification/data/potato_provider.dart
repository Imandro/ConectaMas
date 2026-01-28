import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'potato_repository.dart';
import '../../auth/data/auth_provider.dart';

final potatoRepositoryProvider = Provider((ref) {
  final token = ref.watch(authProvider).token;
  return PotatoRepository(token: token);
});

final potatoGameProvider = StateNotifierProvider.family<PotatoGameNotifier, AsyncValue<GameRoom>, String>((ref, roomId) {
  final repository = ref.watch(potatoRepositoryProvider);
  return PotatoGameNotifier(repository, roomId);
});

class PotatoGameNotifier extends StateNotifier<AsyncValue<GameRoom>> {
  final PotatoRepository _repository;
  final String _roomId;
  Timer? _pollingTimer;

  PotatoGameNotifier(this._repository, this._roomId) : super(const AsyncValue.loading()) {
    fetchStatus();
    _startPolling();
  }

  void _startPolling() {
    _pollingTimer = Timer.periodic(const Duration(seconds: 3), (timer) {
      if (state is AsyncData) {
        final room = (state as AsyncData<GameRoom>).value;
        if (room.status == 'PLAYING' || room.status == 'WAITING') {
          fetchStatus();
        } else {
          timer.cancel();
        }
      } else {
        fetchStatus();
      }
    });
  }

  @override
  void dispose() {
    _pollingTimer?.cancel();
    super.dispose();
  }

  Future<void> fetchStatus() async {
    try {
      final room = await _repository.getRoomStatus(_roomId);
      state = AsyncValue.data(room);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> start() async {
    await _repository.startGame(_roomId);
    await fetchStatus();
  }

  Future<bool> pass(String answer) async {
    final exploded = await _repository.passPotato(_roomId, answer);
    await fetchStatus();
    return exploded;
  }
}
