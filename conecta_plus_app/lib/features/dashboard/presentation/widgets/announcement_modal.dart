import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../config/theme.dart';
import '../../data/models/announcement_model.dart';

class AnnouncementModal extends StatelessWidget {
  final AnnouncementModel announcement;
  final VoidCallback onClose;

  const AnnouncementModal({
    super.key,
    required this.announcement,
    required this.onClose,
  });

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.all(20),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 500),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(32),
          border: Border.all(color: AppTheme.accent.withValues(alpha: 0.3), width: 2),
        ),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Header/Banner
              Stack(
                clipBehavior: Clip.none,
                children: [
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.fromLTRB(24, 60, 24, 32),
                    decoration: const BoxDecoration(
                      color: AppTheme.primary,
                      borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
                    ),
                    child: Column(
                      children: [
                        Text(
                          announcement.title,
                          textAlign: TextAlign.center,
                          style: GoogleFonts.fredoka(
                            color: Colors.white,
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            height: 1.1,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          announcement.subtitle ?? '',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.fredoka(
                            color: AppTheme.accent,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Positioned(
                    top: -24,
                    left: 0,
                    right: 0,
                    child: Center(
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppTheme.accent,
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: AppTheme.accent.withValues(alpha: 0.4),
                              blurRadius: 20,
                              offset: const Offset(0, 5),
                            )
                          ],
                        ),
                        child: const Icon(Icons.celebration_rounded, color: AppTheme.primary, size: 32),
                      ),
                    ),
                  ),
                  Positioned(
                    top: 10,
                    right: 10,
                    child: IconButton(
                      icon: const Icon(Icons.close, color: Colors.white70),
                      onPressed: onClose,
                    ),
                  ),
                ],
              ),

              // Content
              Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  children: [
                    Text(
                      'Estamos impactados por su apoyo. En solo 3 días:',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.fredoka(
                        color: AppTheme.primary,
                        fontSize: 18,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 32),

                    // Stats row
                    if (announcement.stats != null)
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: announcement.stats!.map((stat) {
                          final index = announcement.stats!.indexOf(stat);
                          return Row(
                            children: [
                              Column(
                                children: [
                                  Text(
                                    stat.value,
                                    style: GoogleFonts.fredoka(
                                      color: AppTheme.primary,
                                      fontSize: 24,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  Text(
                                    stat.label,
                                    style: GoogleFonts.fredoka(
                                      color: const Color(0xFF94A3B8),
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                              if (index < announcement.stats!.length - 1)
                                Container(
                                  height: 40,
                                  width: 1,
                                  color: const Color(0xFFE2E8F0),
                                  margin: const EdgeInsets.symmetric(horizontal: 24),
                                ),
                            ],
                          );
                        }).toList(),
                      ),
                    
                    const SizedBox(height: 32),
                    Text(
                      announcement.content,
                      textAlign: TextAlign.center,
                      style: GoogleFonts.fredoka(
                        color: const Color(0xFF64748B),
                        fontSize: 14,
                        height: 1.5,
                      ),
                    ),
                    
                    const SizedBox(height: 32),
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppTheme.accent.withValues(alpha: 0.2)),
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(Icons.favorite, color: Colors.red, size: 20),
                          const SizedBox(width: 12),
                          Expanded(
                            child: RichText(
                              text: TextSpan(
                                children: [
                                  TextSpan(
                                    text: 'Sentimos mucho las molestias: ',
                                    style: GoogleFonts.fredoka(
                                      color: AppTheme.primary,
                                      fontSize: 13,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  TextSpan(
                                    text: 'Para asegurar la estabilidad total, hemos migrado a una infraestructura mucho más potente. Necesitamos que vuelvas a crear tu cuenta para empezar juntos esta nueva etapa.',
                                    style: GoogleFonts.fredoka(
                                      color: AppTheme.primary,
                                      fontSize: 13,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 40),
                    
                    // Action button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: onClose,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primary,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 20),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(50),
                          ),
                          elevation: 10,
                          shadowColor: AppTheme.primary.withValues(alpha: 0.3),
                        ),
                        child: Text(
                          announcement.actionText ?? 'ENTENDIDO',
                          style: GoogleFonts.fredoka(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ),
                    ),
                    
                    TextButton(
                      onPressed: onClose,
                      child: Text(
                        'Entendido, cerrar aviso',
                        style: GoogleFonts.fredoka(
                          color: const Color(0xFF94A3B8),
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
