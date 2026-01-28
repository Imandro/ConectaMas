import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/league_provider.dart';
import '../../auth/data/auth_provider.dart';
import 'package:lucide_icons/lucide_icons.dart';

class LeagueRankingScreen extends ConsumerWidget {
  const LeagueRankingScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final rankingAsync = ref.watch(leagueRankingProvider);
    final currentUser = ref.watch(authProvider).user;

    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text('Ligas', style: TextStyle(fontWeight: FontWeight.bold)),
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: Colors.blue[900],
      ),
      body: rankingAsync.when(
        data: (players) => RefreshIndicator(
          onRefresh: () => ref.read(leagueRankingProvider.notifier).fetchRanking(),
          child: Column(
            children: [
              _buildLeagueHeader(currentUser?.league ?? 'BRONZE'),
              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: players.length,
                  itemBuilder: (context, index) {
                    final player = players[index];
                    final isCurrentUser = player.id == currentUser?.id;
                    return _buildRankingItem(player, index + 1, isCurrentUser);
                  },
                ),
              ),
            ],
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
    );
  }

  Widget _buildLeagueHeader(String league) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(32),
          bottomRight: Radius.circular(32),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        children: [
          Icon(LucideIcons.trophy, size: 64, color: _getLeagueColor(league)),
          const SizedBox(height: 12),
          Text(
            'Liga $league',
            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const Text(
            'Termina en 3 días',
            style: TextStyle(color: Colors.grey),
          ),
        ],
      ),
    );
  }

  Widget _buildRankingItem(dynamic player, int rank, bool isCurrentUser) {
    final bool isPromotion = rank <= 3;
    final bool isDemotion = rank > 15; // Example logic

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: isCurrentUser ? 4 : 0,
      color: isCurrentUser ? Colors.blue[50] : Colors.white,
      child: ListTile(
        leading: Container(
          width: 40,
          alignment: Alignment.center,
          child: Text(
            rank.toString(),
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 18,
              color: rank == 1 ? Colors.amber[700] : Colors.grey[600],
            ),
          ),
        ),
        title: Row(
          children: [
            CircleAvatar(
              radius: 18,
              backgroundImage: player.image != null ? NetworkImage(player.image!) : null,
              child: player.image == null ? Text(player.name?[0] ?? 'U') : null,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                player.name ?? 'Usuario',
                style: TextStyle(fontWeight: isCurrentUser ? FontWeight.bold : FontWeight.normal),
              ),
            ),
          ],
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              '${player.weeklyXP} XP',
              style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.orange),
            ),
            if (isPromotion)
              const Text('↑ Ascenso', style: TextStyle(color: Colors.green, fontSize: 10, fontWeight: FontWeight.bold))
            else if (isDemotion)
              const Text('↓ Descenso', style: TextStyle(color: Colors.red, fontSize: 10, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  Color _getLeagueColor(String league) {
    switch (league) {
      case 'BRONZE': return Colors.brown;
      case 'SILVER': return Colors.grey;
      case 'GOLD': return Colors.amber;
      case 'DIAMOND': return Colors.blue;
      default: return Colors.brown;
    }
  }
}
