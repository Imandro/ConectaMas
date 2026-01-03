import 'dart:async';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../config/theme.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'llami_mascot.dart';
import '../../data/mascot_provider.dart';

class StreakCard extends ConsumerStatefulWidget {
  const StreakCard({super.key});

  @override
  ConsumerState<StreakCard> createState() => _StreakCardState();
}

class _StreakCardState extends ConsumerState<StreakCard> {
  static const int _streakDays = 10;
  final Random _rng = Random();

  Timer? _showTimer;
  Timer? _hideTimer;

  bool _showMessage = false;
  String _message = '¡Mira cómo creces!';

  @override
  void initState() {
    super.initState();
    _message = '¡Mira cómo creces!';
    _showTimer = Timer(const Duration(milliseconds: 1500), () {
      if (!mounted) return;
      setState(() => _showMessage = true);
    });
    _hideTimer = Timer(const Duration(milliseconds: 6500), () {
      if (!mounted) return;
      setState(() => _showMessage = false);
    });
  }

  @override
  void dispose() {
    _showTimer?.cancel();
    _hideTimer?.cancel();
    super.dispose();
  }

  void _showClickMessage() {
    final messages = <String>[
      '¡Mira cómo creces!',
      'Estoy orgulloso de ti',
      'Dios sigue contigo',
      'Un día a la vez',
      'Sigue firme, tú puedes',
    ];
    final next = messages[_rng.nextInt(messages.length)];

    _hideTimer?.cancel();
    setState(() {
      _message = next;
      _showMessage = true;
    });
    _hideTimer = Timer(const Duration(milliseconds: 4000), () {
      if (!mounted) return;
      setState(() => _showMessage = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    final mascot = ref.watch(mascotProvider);

    return GestureDetector(
      onTap: () => context.push('/dashboard/llami'),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 20,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Expanded(
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: const BoxDecoration(
                      color: Color(0xFFF0FDF4),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.wb_sunny_rounded,
                      color: Color(0xFF22C55E),
                      size: 24,
                    ),
                  ).animate().scale(
                      delay: 200.ms, duration: 400.ms, curve: Curves.backOut),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Días en victoria',
                        style: GoogleFonts.fredoka(
                          fontSize: 12,
                          color: const Color(0xFF94A3B8),
                          fontWeight: FontWeight.w500,
                          height: 1.0,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '$_streakDays Días',
                        style: GoogleFonts.fredoka(
                          fontSize: 26,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.primary,
                          height: 1.0,
                        ),
                      ),
                    ],
                  ).animate().fadeIn(delay: 300.ms).slideX(begin: -0.1),
                ],
              ),
            ),
            const SizedBox(width: 12),
            SizedBox(
              width: 80, // Reduced from 104 to avoid overlap
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Stack(
                    clipBehavior: Clip.none,
                    alignment: Alignment.center,
                    children: [
                      Positioned(
                        bottom: 70, // Adjusted from 90
                        left: -30,
                        right: -30,
                        child: AnimatedOpacity(
                          opacity: _showMessage ? 1 : 0,
                          duration: const Duration(milliseconds: 200),
                          child: AnimatedScale(
                            scale: _showMessage ? 1 : 0.92,
                            duration: const Duration(milliseconds: 220),
                            curve: Curves.easeOutBack,
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 10, vertical: 8),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(
                                        color: AppTheme.accent, width: 2),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black
                                            .withValues(alpha: 0.08),
                                        blurRadius: 18,
                                        offset: const Offset(0, 10),
                                      ),
                                    ],
                                  ),
                                  child: Text(
                                    _message,
                                    textAlign: TextAlign.center,
                                    style: GoogleFonts.fredoka(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 11,
                                      color: const Color(0xFF0F172A),
                                      height: 1.1,
                                    ),
                                  ),
                                ),
                                CustomPaint(
                                  size: const Size(16, 10),
                                  painter: _BubbleTriangle(),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      GestureDetector(
                        onTap: _showClickMessage,
                        child: Hero(
                          tag: 'llami_mascot',
                          child: const LlamiMascot(streak: _streakDays)
                              .animate(
                                  onPlay: (controller) =>
                                      controller.repeat(reverse: true))
                              .moveY(
                                  begin: -5,
                                  end: 5,
                                  duration: 2.seconds,
                                  curve: Curves.easeInOut)
                              .scale(
                                  begin: const Offset(0.95, 0.95),
                                  end: const Offset(1.05, 1.05),
                                  duration: 2.seconds,
                                  curve: Curves.easeInOut),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  _LevelPill(label: 'Nivel ${mascot.level}')
                      .animate()
                      .fadeIn(delay: 500.ms)
                      .scale(delay: 500.ms),
                ],
              ),
            ),
          ],
        ),
      )
          .animate()
          .fadeIn(duration: 600.ms)
          .slideY(begin: 0.2, curve: Curves.easeOutCubic),
    );
  }
}

class _LevelPill extends StatelessWidget {
  final String label;
  const _LevelPill({required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        label,
        style: GoogleFonts.fredoka(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: AppTheme.primary,
        ),
      ),
    );
  }
}

class _BubbleTriangle extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = Colors.white;
    final path = Path()
      ..moveTo(0, 0)
      ..lineTo(size.width / 2, size.height)
      ..lineTo(size.width, 0)
      ..close();
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(_BubbleTriangle oldDelegate) => false;
}
