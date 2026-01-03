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
        padding: const EdgeInsets.all(20),
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
          children: [
            Expanded(
              flex: 3,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: const BoxDecoration(
                          color: Color(0xFFDCFCE7),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.wb_sunny_rounded,
                          color: Color(0xFF22C55E),
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Días en\nvictoria',
                        style: GoogleFonts.fredoka(
                          fontSize: 14,
                          color: const Color(0xFF94A3B8),
                          fontWeight: FontWeight.w500,
                          height: 1.1,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${mascot.streak}',
                    style: GoogleFonts.fredoka(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFF1E293B),
                      height: 1.0,
                    ),
                  ),
                  Text(
                    'Días',
                    style: GoogleFonts.fredoka(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFF1E293B),
                      height: 1.0,
                    ),
                  ),
                  const SizedBox(height: 12),
                  _LevelPill(label: 'Nivel ${mascot.level}'),
                ],
              ),
            ),
            Expanded(
              flex: 2,
              child: Stack(
                clipBehavior: Clip.none,
                alignment: Alignment.center,
                children: [
                  Positioned(
                    bottom: 80,
                    left: -40,
                    right: -40,
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
                                    color: const Color(0xFFFFD166), width: 2),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.08),
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
                                  fontSize: 10,
                                  color: const Color(0xFF0F172A),
                                  height: 1.1,
                                ),
                              ),
                            ),
                            CustomPaint(
                              size: const Size(12, 8),
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
                      child: IntrinsicHeight(
                        child: LlamiMascot(streak: mascot.streak),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
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
