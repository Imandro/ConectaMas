import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../config/theme.dart';

class DashboardHeader extends StatelessWidget {
  const DashboardHeader({super.key});

  @override
  Widget build(BuildContext context) {
    // Dynamic date in Spanish
    final now = DateTime.now();
    final formatter = DateFormat("d 'De' MMMM", 'es');
    final dateStr = formatter.format(now);

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
              'Hola, Mario',
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
              const _ProfileAvatar(initial: 'M'),
            ],
          ),
        ).animate().fadeIn(duration: 400.ms).slideX(begin: 0.2),
      ],
    );
  }
}

class _ProfileAvatar extends StatelessWidget {
  final String initial;
  const _ProfileAvatar({required this.initial});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.go('/profile'),
      child: Container(
        height: 48,
        width: 48,
        decoration: const BoxDecoration(
          color: AppTheme.accent,
          shape: BoxShape.circle,
        ),
        child: Center(
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
