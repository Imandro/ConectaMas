import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../config/theme.dart';
import '../../../../l10n/app_localizations.dart';
import '../../../../features/auth/data/auth_provider.dart';
import '../../../profile/data/avatar_repository.dart';
import '../../../profile/domain/avatar_config.dart';
import '../../../profile/presentation/widgets/avatar_preview.dart';
import '../../../profile/presentation/avatar_editor_screen.dart';

class DashboardHeader extends ConsumerWidget {
  const DashboardHeader({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final locale = Localizations.localeOf(context);
    final user = ref.watch(authProvider).user;
    final name = user?.name ?? 'Usuario';
    final initial = name.isNotEmpty ? name[0].toUpperCase() : 'U';
    final avatarConfigAsync = ref.watch(avatarConfigProvider);

    // Dynamic date localized
    final now = DateTime.now();
    final dateStr = DateFormat.MMMMd(locale.languageCode).format(now);

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              dateStr,
              style: GoogleFonts.fredoka(
                color: const Color(0xFF64748B),
                fontWeight: FontWeight.w600,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              l10n.hello(name),
              style: GoogleFonts.fredoka(
                fontSize: 32,
                fontWeight: FontWeight.bold,
                color: AppTheme.accent,
                height: 1.1,
              ),
            ),
          ],
        ).animate().fadeIn(duration: 400.ms).slideX(begin: -0.2),
        // Pill container for buttons
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(50),
            border: Border.all(color: const Color(0xFFF1F5F9)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            children: [
              _HeaderIconButton(
                  icon: Icons.help_outline,
                  onPressed: () => context.go('/dashboard/tutorials')),
              _HeaderIconButton(
                  icon: Icons.group_outlined,
                  onPressed: () => context.go('/dashboard/friends')),
              _ProfileAvatar(initial: initial, configAsync: avatarConfigAsync),
            ],
          ),
        ).animate().fadeIn(duration: 400.ms).slideX(begin: 0.2),
      ],
    );
  }
}

class _ProfileAvatar extends StatelessWidget {
  final String initial;
  final AsyncValue<AvatarConfig> configAsync;

  const _ProfileAvatar({required this.initial, required this.configAsync});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        // Navigate to Avatar Editor
        Navigator.of(context).push(
          MaterialPageRoute(builder: (_) => const AvatarEditorScreen()),
        );
      },
      child: Container(
        height: 48,
        width: 48,
        decoration: BoxDecoration(
            color: AppTheme.accent,
            shape: BoxShape.circle,
            border: Border.all(color: Colors.white, width: 2),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.1),
                blurRadius: 4,
                offset: const Offset(0, 2),
              )
            ]),
        child: ClipOval(
          child: configAsync.when(
            data: (config) => AvatarPreview(
              config: config,
              size: 48,
            ),
            loading: () => Center(
              child: Text(
                initial,
                style: GoogleFonts.fredoka(
                  fontWeight: FontWeight.bold,
                  color: AppTheme.primary,
                  fontSize: 20,
                ),
              ),
            ),
            error: (_, __) => Center(
              child: Text(
                initial,
                style: GoogleFonts.fredoka(
                  fontWeight: FontWeight.bold,
                  color: AppTheme.primary,
                  fontSize: 20,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _HeaderIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onPressed;

  const _HeaderIconButton({required this.icon, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(50),
        child: Padding(
          padding: const EdgeInsets.all(10.0),
          child: Icon(icon, color: AppTheme.primary, size: 28),
        ),
      ),
    );
  }
}
