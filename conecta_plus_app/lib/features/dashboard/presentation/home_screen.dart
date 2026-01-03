import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
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

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  @override
  void initState() {
    super.initState();
    // Show announcement modal after a short delay
    Future.delayed(const Duration(milliseconds: 1500), () {
      if (mounted) {
        final announcements = ref.read(announcementsProvider);
        if (announcements.isNotEmpty) {
          showDialog(
            context: context,
            barrierDismissible: false,
            builder: (context) => AnnouncementModal(
              announcement: announcements.first,
              onClose: () => Navigator.of(context).pop(),
            ),
          );
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          children: [
             // 1. Header
             const DashboardHeader(),
             const SizedBox(height: 24),

             // 2. Versículo del día
             const DailyVerse(),
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
             ),
             const SizedBox(height: 24),

             // 4. Mi Seguimiento
             const StruggleSummary(),
             const SizedBox(height: 24),

             // 5. Social Media Cards
             const SocialMediaCards(),
             const SizedBox(height: 24),
             
             // 6. Daily Prayer
             const PrayerCard(),
             const SizedBox(height: 32),

             // 7. Donation / Support Card
             const DonationCard(),
             
             // Final spacing for navbar
             const SizedBox(height: 120),
          ],
        ),
      ),
    );
  }
}
