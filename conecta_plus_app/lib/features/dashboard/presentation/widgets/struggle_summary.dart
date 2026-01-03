import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../config/theme.dart';
import '../../data/struggle_provider.dart';
import '../../data/models/struggle_model.dart';

class StruggleSummary extends ConsumerWidget {
  const StruggleSummary({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final struggleState = ref.watch(struggleProvider);
    final activeCount = struggleState.struggles
        .where((s) => s.status == StruggleStatus.active && s.isStarted)
        .length;
    final availableCount = struggleState.struggles
        .where((s) => s.status == StruggleStatus.active && !s.isStarted)
        .length;

    return GestureDetector(
      onTap: () => context.push('/dashboard/luchas'),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: AppTheme.primary.withValues(alpha: 0.08),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: const Icon(Icons.shield_outlined,
                                  color: AppTheme.primary, size: 28),
                            )
                                .animate(onPlay: (c) => c.repeat(reverse: true))
                                .moveY(begin: -2, end: 2, duration: 2.seconds),
                            const SizedBox(width: 16),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Mi Seguimiento',
                                  style: GoogleFonts.fredoka(
                                    fontSize: 20,
                                    fontWeight: FontWeight.w800,
                                    color: const Color(0xFF475569),
                                  ),
                                ),
                                Text(
                                  'Gestiona tus planes de transformación',
                                  style: GoogleFonts.fredoka(
                                    fontSize: 12,
                                    color: const Color(0xFF64748B),
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: const BoxDecoration(
                            color: Color(0xFFF1F5F9),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.chevron_right,
                              color: AppTheme.primary, size: 24),
                        )
                            .animate(onPlay: (c) => c.repeat(reverse: true))
                            .moveX(begin: -2, end: 2, duration: 1.seconds),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: _StatBox(
                            value: '$activeCount',
                            label: 'EN PROGRESO',
                            valueColor: AppTheme.primary,
                            bgColor: const Color(0xFFF1F5F9),
                          ).animate().fadeIn(delay: 200.ms).slideX(begin: -0.2),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: _StatBox(
                            value: '$availableCount',
                            label: 'DISPONIBLES',
                            valueColor: AppTheme.accent,
                            bgColor: const Color(0xFFF1F5F9),
                          ).animate().fadeIn(delay: 400.ms).slideX(begin: 0.2),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              // Footer
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 12),
                color: const Color(0xFFF8FAFC),
                child: Center(
                  child: Text(
                    'Ver todos mis planes',
                    style: GoogleFonts.fredoka(
                      color: AppTheme.primary,
                      fontWeight: FontWeight.w700,
                      fontSize: 14,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    ).animate().fadeIn(duration: 400.ms).slideY(begin: 0.2);
  }
}

class _StatBox extends StatelessWidget {
  final String value;
  final String label;
  final Color valueColor;
  final Color bgColor;

  const _StatBox({
    required this.value,
    required this.label,
    required this.valueColor,
    required this.bgColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        children: [
          Text(
            value,
            style: GoogleFonts.fredoka(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: valueColor,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: GoogleFonts.fredoka(
              fontSize: 10.4,
              fontWeight: FontWeight.bold,
              color: const Color(0xFF475569),
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }
}
