import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../../l10n/app_localizations.dart';
import '../../data/verse_provider.dart';

class DailyVerse extends ConsumerWidget {
  const DailyVerse({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final verseAsync = ref.watch(verseProvider);

    return verseAsync.when(
      loading: () => _buildShimmer(),
      error: (err, stack) => _buildError(context),
      data: (verse) => _buildContent(context, verse, l10n),
    );
  }

  Widget _buildShimmer() {
    return Container(
      width: double.infinity,
      height: 200,
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(24),
      ),
    ).animate(onPlay: (c) => c.repeat()).shimmer(duration: 1.5.seconds);
  }

  Widget _buildError(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 200,
      decoration: BoxDecoration(
        color: Colors.red.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(24),
      ),
      child: const Center(child: Icon(Icons.error_outline, color: Colors.red)),
    );
  }

  Widget _buildContent(
      BuildContext context, VerseState verse, AppLocalizations l10n) {
    return GestureDetector(
      onTap: () => context.go('/bible'),
      child: Container(
        width: double.infinity,
        height: 200,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(24),
          // Gradient fallback
          gradient: const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFF667eea),
              Color(0xFF764ba2),
            ],
          ),
        ),
        child: Stack(
          children: [
            // Try to load network image, fallback to gradient if fails
            if (verse.imageUrl.isNotEmpty)
              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(24),
                  image: DecorationImage(
                    image: NetworkImage(verse.imageUrl),
                    fit: BoxFit.cover,
                    onError: (exception, stackTrace) {
                      // Image failed to load, gradient will show
                    },
                  ),
                ),
              ),
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(24),
                gradient: const LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Color.fromRGBO(0, 0, 0, 0.40),
                    Color.fromRGBO(0, 0, 0, 0.75),
                  ],
                ),
              ),
            ),

            // Decorative top-left circle
            Positioned(
              top: -30,
              left: -30,
              child: Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.10),
                  shape: BoxShape.circle,
                ),
              ),
            ).animate(onPlay: (c) => c.repeat(reverse: true)).scale(
                begin: const Offset(1, 1),
                end: const Offset(1.2, 1.2),
                duration: 4.seconds,
                curve: Curves.easeInOut),

            // Download Icon
            Positioned(
              top: 16,
              right: 16,
              child: GestureDetector(
                onTap: () {
                  // TODO: Implement image sharing/download
                },
                child: ClipOval(
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.share,
                          color: Colors.white, size: 18),
                    ),
                  ),
                ),
              ),
            ).animate().fadeIn(delay: 400.ms).scale(),

            // Content
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    l10n.dailyVerse.toUpperCase(),
                    style: GoogleFonts.fredoka(
                      color: Colors.white.withValues(alpha: 0.7),
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                      letterSpacing: 2.5,
                    ),
                  ).animate().fadeIn(delay: 200.ms).slideY(begin: -0.2),
                  const SizedBox(height: 12),
                  Text(
                    '"${verse.content}"',
                    textAlign: TextAlign.center,
                    maxLines: 4,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.fredoka(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      height: 1.3,
                    ),
                  )
                      .animate()
                      .fadeIn(delay: 400.ms)
                      .scale(begin: const Offset(0.9, 0.9)),
                  const SizedBox(height: 12),
                  Text(
                    '— ${verse.reference}',
                    style: GoogleFonts.fredoka(
                      color: Colors.white.withValues(alpha: 0.9),
                      fontWeight: FontWeight.w600,
                      fontSize: 15,
                    ),
                  ).animate().fadeIn(delay: 600.ms),
                ],
              ),
            ),

            // Branding Watermark
            Positioned(
              bottom: 16,
              right: 20,
              child: Text(
                'Conecta+',
                style: GoogleFonts.fredoka(
                  color: Colors.white.withValues(alpha: 0.2),
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  letterSpacing: 1.0,
                ),
              ),
            ),
          ],
        ),
      )
          .animate()
          .fadeIn(duration: 600.ms)
          .scale(begin: const Offset(0.98, 0.98), curve: Curves.easeOutBack),
    );
  }
}
