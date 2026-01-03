import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../config/theme.dart';

class SOSCard extends StatelessWidget {
  const SOSCard({super.key});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.push('/sos'),
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: AppTheme.error,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.08),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.warning_rounded, color: Colors.white, size: 36)
                .animate(onPlay: (c) => c.repeat(reverse: true))
                .scale(
                    begin: const Offset(0.9, 0.9),
                    end: const Offset(1.1, 1.1),
                    duration: 1.seconds,
                    curve: Curves.easeInOut),
            const SizedBox(height: 6),
            Text('SOS',
                style: GoogleFonts.fredoka(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                  height: 1.0,
                )),
          ],
        ),
      )
          .animate(onPlay: (c) => c.repeat(reverse: true))
          .shimmer(
              duration: 3.seconds, color: Colors.white.withValues(alpha: 0.3))
          .animate()
          .fadeIn(duration: 400.ms)
          .scale(begin: const Offset(0.9, 0.9), curve: Curves.easeOutBack),
    );
  }
}
