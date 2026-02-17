import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../config/theme.dart';

import '../../../../l10n/app_localizations.dart';

enum SocialMediaType { whatsapp, instagram }

class SocialMediaModal extends StatelessWidget {
  final SocialMediaType type;

  const SocialMediaModal({super.key, required this.type});

  static void show(BuildContext context, SocialMediaType type) {
    showDialog(
      context: context,
      builder: (context) => SocialMediaModal(type: type),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final isWhatsapp = type == SocialMediaType.whatsapp;

    final title = isWhatsapp ? l10n.joinCommunity : l10n.followInstagram;
    final subtitle = isWhatsapp ? l10n.whatsappDesc : l10n.instagramDesc;
    final buttonText = isWhatsapp ? l10n.joinGroup : l10n.followButton;
    final icon =
        isWhatsapp ? Icons.chat_bubble_rounded : Icons.camera_alt_rounded;

    final Color primaryColor =
        isWhatsapp ? const Color(0xFF25D366) : const Color(0xFFE1306C);
    final Gradient? bgGradient = isWhatsapp
        ? null
        : const LinearGradient(
            colors: [
              Color(0xFFF09433),
              Color(0xFFE6683C),
              Color(0xFFDC2743),
              Color(0xFFCC2366),
              Color(0xFFBC1888),
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          );

    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      elevation: 0,
      backgroundColor: Colors.transparent,
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 20,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Icon Header
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: isWhatsapp ? const Color(0xFFE7F3EE) : null,
                gradient: isWhatsapp ? null : bgGradient,
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon,
                size: 48,
                color: isWhatsapp ? primaryColor : Colors.white,
              ).animate(onPlay: (c) => c.repeat(reverse: true)).scale(
                    begin: const Offset(0.9, 0.9),
                    end: const Offset(1.1, 1.1),
                    duration: 2.seconds,
                    curve: Curves.easeInOut,
                  ),
            ),
            const SizedBox(height: 24),

            // Text Content
            Text(
              title,
              textAlign: TextAlign.center,
              style: GoogleFonts.fredoka(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: AppTheme.primary,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              subtitle,
              textAlign: TextAlign.center,
              style: GoogleFonts.fredoka(
                fontSize: 16,
                color: Colors.grey[600],
                fontWeight: FontWeight.w500,
                height: 1.5,
              ),
            ),
            const SizedBox(height: 32),

            // Action Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => _launchUrl(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: isWhatsapp
                      ? const Color(0xFF25D366)
                      : const Color(
                          0xFFE1306C), // Instagram brand color approximation for button
                  // If gradient background for button is needed, simpler to just use a solid color here or a Container
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 4,
                  shadowColor: (isWhatsapp
                          ? const Color(0xFF25D366)
                          : const Color(0xFFE1306C))
                      .withValues(alpha: 0.4),
                ),
                child: Text(
                  buttonText,
                  style: GoogleFonts.fredoka(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Close Button
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text(
                l10n.maybeLater,
                style: GoogleFonts.fredoka(
                  color: Colors.grey,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      ).animate().fadeIn(duration: 400.ms).slideY(begin: 0.2, end: 0),
    );
  }

  Future<void> _launchUrl(BuildContext context) async {
    final urlStr = type == SocialMediaType.whatsapp
        ? 'https://chat.whatsapp.com/BymmU4EoImgFxLVbUfCzBX'
        : 'https://www.instagram.com/_conectamass?igsh=MTBrMnJtYjI1Z3FlOA==';

    final url = Uri.parse(urlStr);

    try {
      if (await canLaunchUrl(url)) {
        await launchUrl(url, mode: LaunchMode.externalApplication);
      }
      if (context.mounted) Navigator.pop(context);
    } catch (e) {
      debugPrint('Error launching URL: $e');
    }
  }
}
