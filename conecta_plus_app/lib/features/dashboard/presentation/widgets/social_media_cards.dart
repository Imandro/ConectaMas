import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../../config/theme.dart';

class SocialMediaCards extends StatelessWidget {
  const SocialMediaCards({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _SocialCard(
          title: 'Grupo de WhatsApp',
          subtitle: 'Únete a la comunidad oficial y recibe apoyo diario.',
          icon: Icons.chat_bubble_rounded,
          iconColor: const Color(0xFF25D366),
          bgColor: const Color(0xFFE7F3EE),
          titleColor: AppTheme.primary,
          subtitleColor: const Color(0xFF64748B),
          onTap: () async {
            final url = Uri.parse('https://chat.whatsapp.com/BymmU4EoImgFxLVbUfCzBX');
            if (await canLaunchUrl(url)) {
              await launchUrl(url, mode: LaunchMode.externalApplication);
            }
          },
        ),
        const SizedBox(height: 16),
        _SocialCard(
          title: 'Síguenos en Instagram',
          subtitle: '@_conectamass - Contenido diario de transformación',
          icon: Icons.camera_alt_rounded,
          iconColor: const Color(0xFFDC2743),
          bgGradient: const LinearGradient(
            colors: [
              Color(0xFFF09433),
              Color(0xFFE6683C),
              Color(0xFFDC2743),
              Color(0xFFCC2366),
              Color(0xFFBC1888),
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          titleColor: Colors.white,
          subtitleColor: Colors.white,
          onTap: () async {
            final url = Uri.parse('https://www.instagram.com/_conectamass?igsh=MTBrMnJtYjI1Z3FlOA==');
            if (await canLaunchUrl(url)) {
              await launchUrl(url, mode: LaunchMode.externalApplication);
            }
          },
        ),
      ],
    );
  }
}

class _SocialCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color iconColor;
  final Color? bgColor;
  final Gradient? bgGradient;
  final Color titleColor;
  final Color subtitleColor;
  final Future<void> Function() onTap;

  const _SocialCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.iconColor,
    this.bgColor,
    this.bgGradient,
    required this.titleColor,
    required this.subtitleColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        onTap();
      },
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: bgColor,
          gradient: bgGradient,
          borderRadius: BorderRadius.circular(24),
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
            Container(
              padding: const EdgeInsets.all(12),
              decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
              child: Icon(icon, color: iconColor, size: 32),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.fredoka(
                      fontWeight: FontWeight.bold,
                      fontSize: 20,
                      color: titleColor,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: GoogleFonts.fredoka(
                      fontSize: 14,
                      color: subtitleColor == Colors.white ? subtitleColor.withValues(alpha: 0.9) : subtitleColor,
                      fontWeight: FontWeight.w500,
                      height: 1.2,
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
