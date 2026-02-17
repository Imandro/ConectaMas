import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../config/theme.dart';
import '../../data/gamification_provider.dart';
import '../../../../features/ads/data/ad_service.dart';

class DailyRewardsModal extends ConsumerWidget {
  const DailyRewardsModal({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(gamificationProvider);
    final streak = state.dailyStreak;
    final canClaim =
        ref.watch(gamificationProvider.notifier).canClaimDailyReward();

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Recompensas Diarias',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Text(
            '¡Vuelve cada día para ganar más!',
            style: TextStyle(color: Colors.grey[600]),
          ),
          const SizedBox(height: 32),

          // Days Grid
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: List.generate(7, (index) {
              final day = index + 1;
              final isToday =
                  day == streak + 1; // Simplistic logic for visual demo
              final isClaimed = day <= streak;
              final amount = (index + 1) * 10;

              Color bgColor = Colors.grey.shade100;
              Color textColor = Colors.grey;
              Color borderColor = Colors.transparent;

              if (isClaimed) {
                bgColor = Colors.green.withOpacity(0.1);
                textColor = Colors.green;
                borderColor = Colors.green;
              } else if (isToday) {
                bgColor = Colors.amber.withOpacity(0.1);
                textColor = Colors.amber.shade800;
                borderColor = Colors.amber;
              }

              return Expanded(
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 2),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  decoration: BoxDecoration(
                    color: bgColor,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: borderColor, width: 2),
                  ),
                  child: Column(
                    children: [
                      Text(
                        'Día $day',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: textColor,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Icon(
                        isClaimed ? LucideIcons.check : LucideIcons.coins,
                        size: 16,
                        color: textColor,
                      ),
                      const SizedBox(height: 4),
                      if (!isClaimed)
                        Text(
                          '$amount',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: textColor,
                          ),
                        ),
                    ],
                  ),
                ).animate().scale(delay: (index * 50).ms),
              );
            }),
          ),

          const SizedBox(height: 32),

          FutureBuilder<bool>(
              future: canClaim,
              builder: (context, snapshot) {
                final claimable = snapshot.data ?? false;

                if (!claimable) {
                  return Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.grey[100],
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(LucideIcons.clock, color: Colors.grey),
                        SizedBox(width: 8),
                        Text('Vuelve mañana para tu próxima recompensa'),
                      ],
                    ),
                  );
                }

                return Column(
                  children: [
                    ElevatedButton(
                      onPressed: () async {
                        final amount = (streak + 1) * 10;
                        await ref
                            .read(gamificationProvider.notifier)
                            .claimDailyReward(amount);
                        if (context.mounted) Navigator.pop(context);
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        minimumSize: const Size(double.infinity, 50),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16)),
                      ),
                      child: const Text('Reclamar Recompensa'),
                    ),
                    const SizedBox(height: 12),
                    ElevatedButton.icon(
                      onPressed: () async {
                        final adService = ref.read(adServiceProvider);
                        final success = await adService.showRewardedAd(context);

                        if (success) {
                          final amount = ((streak + 1) * 10) * 2;
                          await ref
                              .read(gamificationProvider.notifier)
                              .claimDailyReward(amount);
                          if (context.mounted) Navigator.pop(context);
                        }
                      },
                      icon: const Icon(LucideIcons.video),
                      label: const Text('Ver video para DUPLICAR (x2)'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.purple,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        minimumSize: const Size(double.infinity, 50),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16)),
                      ),
                    ),
                  ],
                );
              }),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}
