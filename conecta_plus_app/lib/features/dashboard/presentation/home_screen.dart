import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../config/theme.dart';
import '../data/announcements_provider.dart';
import 'widgets/streak_card.dart';
import 'widgets/sos_card.dart';
import 'widgets/prayer_card.dart';
import 'widgets/dashboard_header.dart';
import 'widgets/struggle_summary.dart';
import 'widgets/daily_verse.dart';
import 'widgets/social_media_cards.dart';
import 'widgets/donation_card.dart';
import 'widgets/announcement_modal.dart';
import 'widgets/challenge_card.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  @override
  void initState() {
    super.initState();
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
