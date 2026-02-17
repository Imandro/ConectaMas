import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/league_provider.dart';
import '../../auth/data/auth_provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../l10n/app_localizations.dart';

class LeagueRankingScreen extends ConsumerWidget {
  const LeagueRankingScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final rankingAsync = ref.watch(leagueRankingProvider);
    final currentUser = ref.watch(authProvider).user;
    final l10n = AppLocalizations.of(context);

    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: Text(l10n.leaguesTitle,
            style: const TextStyle(fontWeight: FontWeight.bold)),
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: Colors.blue[900],
      ),
      body: rankingAsync.when(
        data: (players) => RefreshIndicator(
          onRefresh: () =>
              ref.read(leagueRankingProvider.notifier).fetchRanking(),
          child: Column(
            children: [
              _buildLeagueHeader(context, currentUser?.league ?? 'BRONZE'),
              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: players.length,
                  itemBuilder: (context, index) {
                    final player = players[index];
                    final isCurrentUser = player.id == currentUser?.id;
                    return _buildRankingItem(
                        context, player, index + 1, isCurrentUser);
                  },
                ),
              ),
            ],
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('${l10n.errorLabel}: $err')),
      ),
    );
  }

  Widget _buildLeagueHeader(BuildContext context, String league) {
    final l10n = AppLocalizations.of(context);
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
            l10n.leagueLabelText(l10n.getLeagueName(league)),
            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          Text(
            l10n.endsInDays(3),
            style: const TextStyle(color: Colors.grey),
          ),
        ],
      ),
    );
  }

  Widget _buildRankingItem(
      BuildContext context, dynamic player, int rank, bool isCurrentUser) {
    final l10n = AppLocalizations.of(context);
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
              backgroundImage: (player as dynamic).image != null
                  ? NetworkImage((player as dynamic).image!)
                  : null,
              child: (player as dynamic).image == null
                  ? Text((player as dynamic).name?[0] ?? 'U')
                  : null,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                (player as dynamic).name ?? l10n.anonymous,
                style: TextStyle(
                    fontWeight:
                        isCurrentUser ? FontWeight.bold : FontWeight.normal),
              ),
            ),
          ],
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              '${(player as dynamic).weeklyXP} XP',
              style: const TextStyle(
                  fontWeight: FontWeight.bold, color: Colors.orange),
            ),
            if (isPromotion)
              Text(l10n.promotionLabel,
                  style: const TextStyle(
                      color: Colors.green,
                      fontSize: 10,
                      fontWeight: FontWeight.bold))
            else if (isDemotion)
              Text(l10n.demotionLabel,
                  style: const TextStyle(
                      color: Colors.red,
                      fontSize: 10,
                      fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  Color _getLeagueColor(String league) {
    switch (league.toUpperCase()) {
      case 'BRONZE':
        return Colors.brown;
      case 'SILVER':
        return Colors.grey;
      case 'GOLD':
        return Colors.amber;
      case 'DIAMOND':
        return Colors.blue;
      default:
        return Colors.brown;
    }
  }
}
