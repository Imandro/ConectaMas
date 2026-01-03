import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../config/theme.dart';
import '../data/mascot_provider.dart';
import 'widgets/llami_mascot.dart';

class LlamiRefugeScreen extends ConsumerStatefulWidget {
  const LlamiRefugeScreen({super.key});

  @override
  ConsumerState<LlamiRefugeScreen> createState() => _LlamiRefugeScreenState();
}

class _LlamiRefugeScreenState extends ConsumerState<LlamiRefugeScreen> {
  bool _isFeeding = false;

  void _handleFeed() {
    if (_isFeeding) return;
    final mascotNotifier = ref.read(mascotProvider.notifier);
    final mascot = ref.read(mascotProvider);

    if (mascot.flamePoints >= 5) {
      setState(() => _isFeeding = true);
      mascotNotifier.useFlamePoints(5);

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('¡Llami está feliz! +20 XP',
              style: GoogleFonts.fredoka(fontWeight: FontWeight.bold)),
          behavior: SnackBarBehavior.floating,
          backgroundColor: Colors.orange,
        ),
      );

      Future.delayed(const Duration(seconds: 2), () {
        if (mounted) setState(() => _isFeeding = false);
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('No tienes suficientes Puntos de Fuego 🔥',
              style: GoogleFonts.fredoka()),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final mascot = ref.watch(mascotProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9), // Lighter background
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () => context.pop(),
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.chevron_left,
                          color: AppTheme.primary, size: 28),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Text('El Refugio de Llami',
                      style: GoogleFonts.fredoka(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.primary)),
                  const Spacer(),
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.help_outline,
                        color: AppTheme.primary, size: 24),
                  ),
                ],
              ),
            ).animate().fadeIn(duration: 400.ms).slideY(begin: -0.2),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  children: [
                    const SizedBox(height: 16),
                    // Main Card (Match inspiration image)
                    Stack(
                      alignment: Alignment.topCenter,
                      children: [
                        Container(
                          width: double.infinity,
                          margin: const EdgeInsets.only(top: 40),
                          padding: const EdgeInsets.only(
                              top: 80, bottom: 40, left: 32, right: 32),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(40),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.04),
                                blurRadius: 30,
                                offset: const Offset(0, 15),
                              ),
                            ],
                          ),
                          child: Column(
                            children: [
                              // Mascot
                              SizedBox(
                                height: 180,
                                child: Stack(
                                  alignment: Alignment.center,
                                  children: [
                                    Transform.scale(
                                      scale: 2.2,
                                      child: LlamiMascot(streak: mascot.streak)
                                          .animate(
                                              onPlay: (c) =>
                                                  c.repeat(reverse: true))
                                          .moveY(
                                              begin: -10,
                                              end: 10,
                                              duration: 2.seconds,
                                              curve: Curves.easeInOut),
                                    ),
                                    if (_isFeeding)
                                      const Positioned(
                                        top: 0,
                                        child: Icon(Icons.local_fire_department,
                                            color: Colors.orange, size: 60),
                                      )
                                          .animate()
                                          .scale(duration: 500.ms)
                                          .fadeOut(delay: 1.seconds),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 40),
                              // Decorative lines at bottom
                              Column(
                                children: List.generate(
                                    4,
                                    (index) => Container(
                                          margin:
                                              const EdgeInsets.only(bottom: 8),
                                          height: 2,
                                          width: double.infinity,
                                          color: const Color(0xFFF1F5F9),
                                        )),
                              ),
                            ],
                          ),
                        ),
                        // Speech Bubble with Badge
                        Positioned(
                          top: 0,
                          child: Stack(
                            clipBehavior: Clip.none,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 24, vertical: 12),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(24),
                                  border: Border.all(
                                      color: const Color(0xFFFBBF24), width: 3),
                                  boxShadow: [
                                    BoxShadow(
                                      color:
                                          Colors.black.withValues(alpha: 0.05),
                                      blurRadius: 15,
                                      offset: const Offset(0, 5),
                                    ),
                                  ],
                                ),
                                child: Text(
                                  '¡Vas muy bien! Sigue así',
                                  style: GoogleFonts.fredoka(
                                    color: const Color(0xFF1E293B),
                                    fontWeight: FontWeight.bold,
                                    fontSize: 18,
                                  ),
                                ),
                              ),
                              // Blue sparkle badge
                              Positioned(
                                right: -15,
                                top: -5,
                                child: Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF3B82F6),
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                        color: Colors.white, width: 2),
                                    boxShadow: [
                                      BoxShadow(
                                        color: const Color(0xFF3B82F6)
                                            .withValues(alpha: 0.3),
                                        blurRadius: 10,
                                        offset: const Offset(0, 4),
                                      ),
                                    ],
                                  ),
                                  child: const Icon(Icons.auto_awesome,
                                      color: Colors.white, size: 16),
                                ),
                              ).animate(onPlay: (c) => c.repeat()).shimmer(
                                  duration: 2.seconds,
                                  color: Colors.white.withValues(alpha: 0.5)),
                            ],
                          ),
                        ),
                      ],
                    )
                        .animate()
                        .fadeIn(delay: 200.ms)
                        .scale(duration: 500.ms, curve: Curves.backOut),

                    const SizedBox(height: 24),

                    // Stats Card
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(32),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.04),
                            blurRadius: 20,
                            offset: const Offset(0, 10),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              _buildStatItem('NIVEL', mascot.level.toString(),
                                  Icons.bolt_rounded),
                              Container(
                                  width: 1,
                                  height: 40,
                                  color: const Color(0xFFF1F5F9)),
                              _buildStatItem(
                                  'FUEGO',
                                  mascot.flamePoints.toString(),
                                  Icons.local_fire_department_rounded,
                                  color: Colors.orange),
                            ],
                          ),
                          const SizedBox(height: 24),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Progreso Nivel ${mascot.level + 1}',
                                  style: GoogleFonts.fredoka(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 14,
                                      color: const Color(0xFF64748B))),
                              Text('${mascot.experience}/100 XP',
                                  style: GoogleFonts.fredoka(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 14,
                                      color: Colors.orange)),
                            ],
                          ),
                          const SizedBox(height: 12),
                          ClipRRect(
                            borderRadius: BorderRadius.circular(10),
                            child: LinearProgressIndicator(
                              value: mascot.experience / 100,
                              minHeight: 12,
                              backgroundColor: const Color(0xFFF1F5F9),
                              valueColor: const AlwaysStoppedAnimation<Color>(
                                  Colors.orange),
                            ),
                          ),
                        ],
                      ),
                    ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.2),

                    const SizedBox(height: 24),

                    // Action Buttons
                    Column(
                      children: [
                        SizedBox(
                          width: double.infinity,
                          height: 60,
                          child: ElevatedButton.icon(
                            onPressed:
                                mascot.flamePoints < 5 ? null : _handleFeed,
                            icon: const Icon(Icons.local_fire_department,
                                color: Color(0xFF0F172A), size: 24),
                            label: Text('Avivar el Fuego (-5 🔥)',
                                style: GoogleFonts.fredoka(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                    color: const Color(0xFF0F172A))),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.accent,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20)),
                              elevation: 0,
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        SizedBox(
                          width: double.infinity,
                          height: 60,
                          child: OutlinedButton.icon(
                            onPressed: () => context.push('/trivia'),
                            icon: const Icon(Icons.gamepad_outlined,
                                color: AppTheme.primary, size: 24),
                            label: Text('Desafío Trivia Diario',
                                style: GoogleFonts.fredoka(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                    color: AppTheme.primary)),
                            style: OutlinedButton.styleFrom(
                              side: const BorderSide(
                                  color: AppTheme.primary, width: 2),
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20)),
                            ),
                          ),
                        ),
                      ],
                    ).animate().fadeIn(delay: 600.ms).slideY(begin: 0.2),

                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, String value, IconData icon,
      {Color? color}) {
    return Expanded(
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 18, color: color ?? const Color(0xFF64748B)),
              const SizedBox(width: 6),
              Text(label,
                  style: GoogleFonts.fredoka(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFF64748B))),
            ],
          ),
          const SizedBox(height: 12),
          Text(value,
              style: GoogleFonts.fredoka(
                  fontSize: 40,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.primary)),
        ],
      ),
    );
  }
}
