import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/potato_provider.dart';
import '../../auth/data/auth_provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import '../../../l10n/app_localizations.dart';

class PotatoGameScreen extends ConsumerStatefulWidget {
  final String roomId;
  const PotatoGameScreen({super.key, required this.roomId});

  @override
  ConsumerState<PotatoGameScreen> createState() => _PotatoGameScreenState();
}

class _PotatoGameScreenState extends ConsumerState<PotatoGameScreen> {
  final _answerController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final gameAsync = ref.watch(potatoGameProvider(widget.roomId));
    final currentUser = ref.watch(authProvider).user;
    final l10n = AppLocalizations.of(context);

    return Scaffold(
      backgroundColor: Colors.grey[900],
      appBar: AppBar(
        title: Text(l10n.potatoGameTitle,
            style: const TextStyle(color: Colors.white)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(LucideIcons.chevronLeft, color: Colors.white),
          onPressed: () => context.pop(),
        ),
      ),
      body: gameAsync.when(
        data: (room) => _buildGameContent(room, currentUser?.id),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(
            child: Text('${l10n.errorLabel}: $err',
                style: const TextStyle(color: Colors.white))),
      ),
    );
  }

  Widget _buildGameContent(dynamic room, String? currentUserId) {
    final l10n = AppLocalizations.of(context);
    if (room.status == 'WAITING') {
      return _buildLobby(room, currentUserId);
    }

    final isMyTurn = room.currentTurnUserId == currentUserId;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          _buildPlayerGrid(room.players, room.currentTurnUserId),
          const Spacer(),
          _buildPotatoIcon(isMyTurn),
          const Spacer(),
          if (room.status == 'PLAYING') ...[
            if (isMyTurn)
              _buildTurnInput(l10n)
            else
              Text(
                l10n.waitingTurn,
                style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold),
              ),
          ] else if (room.status == 'FINISHED')
            _buildGameOver(room),
        ],
      ),
    );
  }

  Widget _buildLobby(dynamic room, String? currentUserId) {
    final isHost =
        room.players.isNotEmpty && room.players[0].userId == currentUserId;
    final l10n = AppLocalizations.of(context);

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(l10n.roomCodeLabel,
              style: const TextStyle(color: Colors.white, fontSize: 18)),
          Text(room.code,
              style: const TextStyle(
                  color: Colors.orange,
                  fontSize: 48,
                  fontWeight: FontWeight.bold)),
          const SizedBox(height: 32),
          Text(l10n.playersJoined(room.players.length),
              style: const TextStyle(color: Colors.white70)),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8,
            children: room.players
                .map<Widget>((p) => CircleAvatar(
                      backgroundImage: (p as dynamic).image != null
                          ? NetworkImage((p as dynamic).image!)
                          : null,
                      child: (p as dynamic).image == null
                          ? Text((p as dynamic).name[0])
                          : null,
                    ))
                .toList(),
          ),
          const SizedBox(height: 48),
          if (isHost)
            ElevatedButton(
              onPressed: room.players.length >= 2
                  ? () => ref
                      .read(potatoGameProvider(widget.roomId).notifier)
                      .start()
                  : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.orange,
                padding:
                    const EdgeInsets.symmetric(horizontal: 48, vertical: 16),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(32)),
              ),
              child: Text(l10n.startGame,
                  style: const TextStyle(fontWeight: FontWeight.bold)),
            )
          else
            Text(l10n.waitingHost, style: const TextStyle(color: Colors.grey)),
        ],
      ),
    );
  }

  Widget _buildPlayerGrid(List<dynamic> players, String? currentTurnId) {
    return Wrap(
      spacing: 16,
      runSpacing: 16,
      children: players.map<Widget>((p) {
        final isTurn = p.userId == currentTurnId;
        final isDead = p.status == 'ELIMINATED';
        return Column(
          children: [
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isTurn ? Colors.orange : Colors.transparent,
                  width: 3,
                ),
              ),
              child: Opacity(
                opacity: isDead ? 0.3 : 1.0,
                child: CircleAvatar(
                  radius: 24,
                  backgroundImage: (p as dynamic).image != null
                      ? NetworkImage((p as dynamic).image!)
                      : null,
                  child: (p as dynamic).image == null
                      ? Text((p as dynamic).name[0])
                      : null,
                ),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              (p as dynamic).name,
              style: TextStyle(
                color: isTurn ? Colors.orange : Colors.white,
                fontSize: 10,
                fontWeight: isTurn ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ],
        );
      }).toList(),
    );
  }

  Widget _buildPotatoIcon(bool isMyTurn) {
    return Icon(
      LucideIcons.bomb,
      size: 120,
      color: isMyTurn ? Colors.red : Colors.grey[700],
    );
  }

  Widget _buildTurnInput(AppLocalizations l10n) {
    return Row(
      children: [
        Expanded(
          child: TextField(
            controller: _answerController,
            style: const TextStyle(color: Colors.white),
            decoration: InputDecoration(
              hintText: l10n.passPotato,
              hintStyle: const TextStyle(color: Colors.grey),
              filled: true,
              fillColor: Colors.white.withOpacity(0.1),
              border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(32),
                  borderSide: BorderSide.none),
            ),
          ),
        ),
        const SizedBox(width: 12),
        IconButton(
          onPressed: () {
            ref
                .read(potatoGameProvider(widget.roomId).notifier)
                .pass(_answerController.text);
            _answerController.clear();
          },
          icon: const Icon(LucideIcons.send, color: Colors.orange, size: 32),
        ),
      ],
    );
  }

  Widget _buildGameOver(dynamic room) {
    final l10n = AppLocalizations.of(context);
    final winner = room.players.firstWhere(
        (p) => (p as dynamic).status == 'WINNER',
        orElse: () => room.players[0]);
    return Column(
      children: [
        Text(l10n.gameOver,
            style: const TextStyle(
                color: Colors.orange,
                fontSize: 32,
                fontWeight: FontWeight.bold)),
        const SizedBox(height: 16),
        Text(l10n.winnerLabel((winner as dynamic).name),
            style: const TextStyle(color: Colors.white, fontSize: 24)),
        const SizedBox(height: 32),
        ElevatedButton(
          onPressed: () => context.pop(),
          child: Text(l10n.backLobby),
        ),
      ],
    );
  }
}
