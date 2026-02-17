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
  bool _isDarkMode = false;

  void _handleFeed() async {
    if (_isFeeding) return;
    final mascotNotifier = ref.read(mascotProvider.notifier);
    final mascot = ref.read(mascotProvider);

    if (mascot.flamePoints >= 5) {
      setState(() => _isFeeding = true);
      final success = await mascotNotifier.useFlamePoints(5);

      if (success) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('¡Llami está feliz! +20 XP',
                  style: GoogleFonts.fredoka(fontWeight: FontWeight.bold)),
              behavior: SnackBarBehavior.floating,
              backgroundColor: Colors.orange,
            ),
          );
        }
      }

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

  void _showRenameDialog() {
    final TextEditingController controller =
        TextEditingController(text: ref.read(mascotProvider).name);
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
        title: Text('¿Cómo se llama tu Llami?',
            style: GoogleFonts.fredoka(fontWeight: FontWeight.bold)),
        content: TextField(
          controller: controller,
          decoration: InputDecoration(
            hintText: 'Ej: Flamita',
            filled: true,
            fillColor: Colors.grey.withValues(alpha: 0.1),
            border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: BorderSide.none),
          ),
          autofocus: true,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancelar',
                style: GoogleFonts.fredoka(color: Colors.grey)),
          ),
          ElevatedButton(
            onPressed: () {
              if (controller.text.isNotEmpty) {
                ref.read(mascotProvider.notifier).setName(controller.text);
                Navigator.pop(context);
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primary,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
            ),
            child: Text('Guardar',
                style: GoogleFonts.fredoka(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final mascot = ref.watch(mascotProvider);
    final bgColor =
        _isDarkMode ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9);
    final cardColor = _isDarkMode ? const Color(0xFF1E293B) : Colors.white;
    final textColor = _isDarkMode ? Colors.white : AppTheme.primary;

    return Scaffold(
      backgroundColor: bgColor,
      body: Stack(
        children: [
          // Background "Room" effect
          AnimatedContainer(
            duration: 500.ms,
            width: double.infinity,
            height: double.infinity,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: _isDarkMode
                    ? [const Color(0xFF0F172A), const Color(0xFF1E293B)]
                    : [const Color(0xFFE2E8F0), const Color(0xFFF1F5F9)],
              ),
            ),
          ),

          // Decorative "Window" or Light effect
          Positioned(
            top: 100,
            right: -50,
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: _isDarkMode
                    ? const Color(0xFF3B82F6).withValues(alpha: 0.1)
                    : const Color(0xFFFBBF24).withValues(alpha: 0.2),
              ),
            ).animate(onPlay: (c) => c.repeat(reverse: true)).scale(
                begin: const Offset(1, 1),
                end: const Offset(1.2, 1.2),
                duration: 4.seconds),
          ),

          SafeArea(
            child: Column(
              children: [
                // Custom App Bar
                Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                  child: Row(
                    children: [
                      GestureDetector(
                        onTap: () => context.pop(),
                        child: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: cardColor,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.05),
                                  blurRadius: 10)
                            ],
                          ),
                          child: Icon(Icons.arrow_back,
                              color: textColor, size: 24),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Refugio de Llami',
                              style: GoogleFonts.fredoka(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                  color: textColor)),
                          Text(mascot.name,
                              style: GoogleFonts.fredoka(
                                  fontSize: 14,
                                  color: _isDarkMode
                                      ? Colors.blue.shade300
                                      : Colors.blue.shade700)),
                        ],
                      ),
                      const Spacer(),
                      // Dark Mode Toggle
                      GestureDetector(
                        onTap: () => setState(() => _isDarkMode = !_isDarkMode),
                        child: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: cardColor,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.05),
                                  blurRadius: 10)
                            ],
                          ),
                          child: Icon(
                            _isDarkMode
                                ? Icons.wb_sunny_rounded
                                : Icons.nightlight_round,
                            color: _isDarkMode ? Colors.amber : Colors.indigo,
                            size: 24,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Column(
                      children: [
                        const SizedBox(height: 10),

                        // Main Visual Area (Immersive Room)
                        Stack(
                          alignment: Alignment.center,
                          children: [
                            // Room Floor/Shadow
                            Container(
                              width: 280,
                              height: 100,
                              margin: const EdgeInsets.only(top: 250),
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(100),
                                color:
                                    (_isDarkMode ? Colors.black : Colors.grey)
                                        .withValues(alpha: 0.1),
                              ),
                            ),

                            // Llami Mascot
                            Column(
                              children: [
                                const SizedBox(height: 50),
                                Transform.scale(
                                  scale: 3.5,
                                  child: LlamiMascot(
                                    streak: mascot.streak,
                                    level: mascot.level,
                                    expression: _isFeeding
                                        ? LlamiExpression.happy
                                        : LlamiExpression.thinking,
                                  )
                                      .animate(
                                          onPlay: (c) =>
                                              c.repeat(reverse: true))
                                      .moveY(
                                          begin: -5,
                                          end: 5,
                                          duration: 2.seconds,
                                          curve: Curves.easeInOut),
                                ),
                                const SizedBox(height: 80),
                              ],
                            ),

                            // Level Badge
                            Positioned(
                              top: 40,
                              right: 20,
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 16, vertical: 8),
                                decoration: BoxDecoration(
                                  color: AppTheme.accent,
                                  borderRadius: BorderRadius.circular(20),
                                  boxShadow: [
                                    BoxShadow(
                                        color: AppTheme.accent
                                            .withValues(alpha: 0.3),
                                        blurRadius: 10)
                                  ],
                                ),
                                child: Text('NIVEL ${mascot.level}',
                                    style: GoogleFonts.fredoka(
                                        fontWeight: FontWeight.bold,
                                        color: const Color(0xFF0F172A))),
                              ),
                            ).animate().fadeIn().scale(),

                            // Name Edit Button
                            Positioned(
                              bottom: 0,
                              child: GestureDetector(
                                onTap: _showRenameDialog,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 16, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: cardColor.withValues(alpha: 0.8),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                        color:
                                            textColor.withValues(alpha: 0.1)),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Text(mascot.name,
                                          style: GoogleFonts.fredoka(
                                              fontWeight: FontWeight.w600,
                                              color: textColor)),
                                      const SizedBox(width: 6),
                                      Icon(Icons.edit,
                                          size: 14,
                                          color:
                                              textColor.withValues(alpha: 0.5)),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 40),

                        // Stats & Actions Card
                        Container(
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            color: cardColor,
                            borderRadius: BorderRadius.circular(32),
                            boxShadow: [
                              BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.05),
                                  blurRadius: 20)
                            ],
                          ),
                          child: Column(
                            children: [
                              Row(
                                children: [
                                  _buildRefugeStat(
                                      '🔥 Fuego',
                                      mascot.flamePoints.toString(),
                                      Colors.orange),
                                  Container(
                                      width: 1,
                                      height: 40,
                                      color: textColor.withValues(alpha: 0.05)),
                                  _buildRefugeStat(
                                      '✨ XP',
                                      mascot.experience.toString(),
                                      Colors.blue),
                                ],
                              ),
                              const SizedBox(height: 24),
                              ClipRRect(
                                borderRadius: BorderRadius.circular(10),
                                child: LinearProgressIndicator(
                                  value: mascot.experience / 100,
                                  minHeight: 12,
                                  backgroundColor: (_isDarkMode
                                      ? Colors.white10
                                      : Colors.black12),
                                  valueColor:
                                      const AlwaysStoppedAnimation<Color>(
                                          Colors.orange),
                                ),
                              ),
                              const SizedBox(height: 12),
                              Text(
                                  'Próximo nivel: ${100 - mascot.experience} XP restantes',
                                  style: GoogleFonts.fredoka(
                                      fontSize: 12,
                                      color: textColor.withValues(alpha: 0.6))),
                            ],
                          ),
                        ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.2),

                        const SizedBox(height: 24),

                        // Action Buttons
                        Row(
                          children: [
                            Expanded(
                              flex: 2,
                              child: _buildActionButton(
                                label: 'Alimentar Llami',
                                icon: Icons.local_fire_department,
                                color: Colors.orange,
                                textColor: Colors.white,
                                onTap: _handleFeed,
                                subtitle: '-5 🔥',
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              flex: 3,
                              child: _buildActionButton(
                                label: 'Desafío Trivia',
                                icon: Icons.psychology_alt,
                                color: AppTheme.primary,
                                textColor: Colors.white,
                                onTap: () => context.push('/trivia'),
                                subtitle: 'Gana premios',
                              ),
                            ),
                          ],
                        ).animate().fadeIn(delay: 500.ms).slideY(begin: 0.2),

                        const SizedBox(height: 12),

                        _buildActionButton(
                          label: 'Ver tutorial de Llami',
                          icon: Icons.auto_awesome,
                          color: Colors.blue.shade100,
                          textColor: Colors.blue.shade900,
                          onTap: () {}, // TODO: Implement tutorial
                          fullWidth: true,
                        ).animate().fadeIn(delay: 600.ms),

                        const SizedBox(height: 40),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRefugeStat(String label, String value, Color color) {
    return Expanded(
      child: Column(
        children: [
          Text(label,
              style: GoogleFonts.fredoka(
                  fontSize: 14, fontWeight: FontWeight.bold, color: color)),
          const SizedBox(height: 4),
          Text(value,
              style: GoogleFonts.fredoka(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: _isDarkMode ? Colors.white : AppTheme.primary)),
        ],
      ),
    );
  }

  Widget _buildActionButton({
    required String label,
    required IconData icon,
    required Color color,
    required Color textColor,
    required VoidCallback onTap,
    String? subtitle,
    bool fullWidth = false,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
        width: fullWidth ? double.infinity : null,
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
                color: color.withValues(alpha: 0.3),
                blurRadius: 10,
                offset: const Offset(0, 4))
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: textColor, size: 28),
            const SizedBox(height: 8),
            Text(label,
                textAlign: TextAlign.center,
                style: GoogleFonts.fredoka(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    color: textColor)),
            if (subtitle != null)
              Text(subtitle,
                  style: GoogleFonts.fredoka(
                      fontSize: 12, color: textColor.withValues(alpha: 0.8))),
          ],
        ),
      ),
    );
  }
}
