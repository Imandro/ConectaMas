import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../config/theme.dart';
import 'widgets/streak_card.dart';
import 'widgets/sos_card.dart';
import 'widgets/prayer_card.dart';
import 'widgets/dashboard_header.dart';
import 'widgets/struggle_summary.dart';
import 'widgets/daily_verse.dart';
import 'widgets/social_media_cards.dart';
import 'widgets/donation_card.dart';
import 'widgets/challenge_card.dart';
import '../../community/presentation/widgets/daily_question_modal.dart';
import 'widgets/group_summary_card.dart';
import 'widgets/growth_milestone_modal.dart';
import 'widgets/donation_missions_modal.dart';
import '../../auth/data/auth_provider.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int? _prevLevel;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _checkDailyQuestions();
      _checkLevelUp();
      _checkModals();
    });
  }

  void _checkModals() {
    // Show growth milestone if needed
    // Assuming we fetch user count from auth or a dedicated provider
    // For now using the level as a proxy or just showing it
    final user = ref.read(authProvider).user;
    GrowthMilestoneModal.checkAndShow(
        context, (user?.id.hashCode.abs() ?? 0) % 500 + 400); // Simulated count

    // Donation modal has its own delay inside checkAndShow?
    // Actually web had a 15s delay. Let's add a small delay here too.
    Future.delayed(const Duration(seconds: 15), () {
      if (mounted) DonationMissionsModal.checkAndShow(context);
    });
  }

  void _checkLevelUp() {
    final user = ref.read(authProvider).user;
    if (user == null) return;

    if (_prevLevel != null && user.level > _prevLevel!) {
      _showLevelUpDialog(user.level);
    }
    _prevLevel = user.level;
  }

  void _showLevelUpDialog(int newLevel) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Colors.blue[900],
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.stars, color: Colors.amber, size: 80),
            const SizedBox(height: 16),
            const Text(
              '¡NUEVO NIVEL!',
              style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              'Has alcanzado el nivel $newLevel',
              style: const TextStyle(color: Colors.white70, fontSize: 16),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => Navigator.pop(context),
              style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.amber, foregroundColor: Colors.black),
              child: const Text('¡GENIAL!'),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _checkDailyQuestions() async {
    // Only show if we have questions and haven't shown it today (logic can be improved)
    // For now, just a delay to simulate loading then show
    await Future.delayed(const Duration(seconds: 2));
    if (mounted) {
      showModalBottomSheet(
        context: context,
        isScrollControlled: true,
        backgroundColor: Colors.transparent,
        builder: (context) => const DailyQuestionModal(),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: ListView(
          physics: const ClampingScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          children: [
            // 1. Header
            const DashboardHeader()
                .animate()
                .fadeIn(duration: 400.ms)
                .slideY(begin: -0.1),
            const SizedBox(height: 24),

            // 2. Versículo del día
            const DailyVerse()
                .animate()
                .fadeIn(delay: 100.ms, duration: 400.ms)
                .slideY(begin: 0.1),
            const SizedBox(height: 12),

            // 3. Row: Streak and SOS
            const IntrinsicHeight(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Expanded(
                    flex: 2,
                    child: StreakCard(),
                  ),
                  SizedBox(width: 16),
                  Expanded(
                    flex: 1,
                    child: SOSCard(),
                  ),
                ],
              ),
            ).animate().fadeIn(delay: 150.ms, duration: 400.ms).scale(
                begin: const Offset(0.95, 0.95), curve: Curves.easeOutBack),
            const SizedBox(height: 16),

            const GroupSummaryCard()
                .animate()
                .fadeIn(delay: 180.ms, duration: 400.ms)
                .slideY(begin: 0.1),

            const SizedBox(height: 16),

            const ChallengeCard()
                .animate()
                .fadeIn(delay: 200.ms, duration: 400.ms)
                .slideY(begin: 0.1),
            const SizedBox(height: 24),

            // 4. Mi Seguimiento
            const StruggleSummary()
                .animate()
                .fadeIn(delay: 300.ms, duration: 400.ms)
                .slideY(begin: 0.1),
            const SizedBox(height: 24),

            // 5. Social Media Cards
            const SocialMediaCards()
                .animate()
                .fadeIn(delay: 400.ms, duration: 400.ms)
                .slideY(begin: 0.1),
            const SizedBox(height: 24),

            // 6. Daily Prayer
            const PrayerCard()
                .animate()
                .fadeIn(delay: 500.ms, duration: 400.ms)
                .slideY(begin: 0.1),
            const SizedBox(height: 32),

            // 7. Donation / Support Card
            const DonationCard()
                .animate()
                .fadeIn(delay: 600.ms, duration: 400.ms)
                .slideY(begin: 0.1),

            // Final spacing for navbar
            const SizedBox(height: 120),
          ],
        ),
      ),
    );
  }
}
