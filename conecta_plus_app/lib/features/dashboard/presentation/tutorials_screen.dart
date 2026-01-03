import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../config/theme.dart';
import '../data/tutorials_provider.dart';
import '../data/models/tutorial_model.dart';

class TutorialsScreen extends ConsumerWidget {
  const TutorialsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tutorials = ref.watch(tutorialsProvider);
    final featured = tutorials.firstWhere((t) => t.id == 'install', orElse: () => tutorials.first);
    final others = tutorials.where((t) => t.id != featured.id).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          'Centro de Aprendizaje', 
          style: GoogleFonts.fredoka(fontWeight: FontWeight.bold, color: AppTheme.primary, fontSize: 24)
        ),
        leading: Padding(
          padding: const EdgeInsets.all(8.0),
          child: GestureDetector(
            onTap: () => context.pop(),
            child: Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.chevron_left, color: AppTheme.primary),
            ),
          ),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          // Featured Tutorial Card
          GestureDetector(
            onTap: () => context.push(featured.href),
            child: Container(
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppTheme.primary, Color(0xFF1E293B)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(40),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.primary.withValues(alpha: 0.2), 
                    blurRadius: 30, 
                    offset: const Offset(0, 15)
                  )
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6), 
                    decoration: BoxDecoration(
                      color: Colors.white, 
                      borderRadius: BorderRadius.circular(20)
                    ), 
                    child: Text(
                      'RECOMENDADO', 
                      style: GoogleFonts.fredoka(
                        color: AppTheme.primary, 
                        fontWeight: FontWeight.bold, 
                        fontSize: 11
                      )
                    )
                  ),
                  const SizedBox(height: 24),
                  Text(
                    featured.title, 
                    style: GoogleFonts.fredoka(
                      color: Colors.white, 
                      fontSize: 32, 
                      fontWeight: FontWeight.bold,
                      height: 1.1,
                    )
                  ),
                  const SizedBox(height: 12),
                  Text(
                    featured.description, 
                    style: GoogleFonts.fredoka(
                      color: Colors.white.withValues(alpha: 0.8), 
                      fontSize: 16,
                      fontWeight: FontWeight.w400,
                    )
                  ),
                  const SizedBox(height: 32),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(30),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.play_circle_fill, color: AppTheme.primary, size: 20),
                        const SizedBox(width: 8),
                        Text(
                          'Comenzar Guía', 
                          style: GoogleFonts.fredoka(
                            color: AppTheme.primary, 
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          )
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 40),
          
          Text(
            'Todos los Tutoriales',
            style: GoogleFonts.fredoka(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: AppTheme.primary,
            ),
          ),
          const SizedBox(height: 20),

          // Grid of Tutorials
          ...others.map((tutorial) => _buildTutorialItem(context, tutorial)),
          
          const SizedBox(height: 40),
          
          // Help Section
          Container(
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(32),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              children: [
                const Icon(Icons.info_outline, color: AppTheme.primary, size: 40),
                const SizedBox(height: 16),
                Text(
                  '¿Aún tienes dudas?',
                  style: GoogleFonts.fredoka(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.primary,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Nuestro equipo de líderes está listo para apoyarte en cualquier momento.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.fredoka(
                    fontSize: 14,
                    color: const Color(0xFF64748B),
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: () => context.push('/dashboard/sos'),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: AppTheme.primary, width: 2),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                    child: Text(
                      'Contactar Soporte',
                      style: GoogleFonts.fredoka(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: AppTheme.primary,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildTutorialItem(BuildContext context, TutorialModel tutorial) {
    // Map icon name to IconData
    IconData icon;
    switch (tutorial.iconName) {
      case 'local_fire_department': icon = Icons.local_fire_department_rounded; break;
      case 'menu_book': icon = Icons.menu_book_rounded; break;
      case 'warning_amber': icon = Icons.warning_amber_rounded; break;
      case 'people': icon = Icons.people_rounded; break;
      case 'download': icon = Icons.download_rounded; break;
      default: icon = Icons.help_outline_rounded;
    }

    final color = Color(int.parse('FF${tutorial.colorHex}', radix: 16));

    return GestureDetector(
      onTap: () => context.push(tutorial.href),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white, 
          borderRadius: BorderRadius.circular(24), 
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04), 
              blurRadius: 15,
              offset: const Offset(0, 4),
            )
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(16), 
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.12), 
                borderRadius: BorderRadius.circular(16)
              ), 
              child: Icon(icon, color: color, size: 28),
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    tutorial.title, 
                    style: GoogleFonts.fredoka(
                      fontWeight: FontWeight.bold, 
                      fontSize: 18,
                      color: AppTheme.primary,
                    )
                  ),
                  const SizedBox(height: 4),
                  Text(
                    tutorial.description, 
                    style: GoogleFonts.fredoka(
                      color: const Color(0xFF64748B), 
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                    )
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right_rounded, color: Color(0xFFCBD5E1)),
          ],
        ),
      ),
    );
  }
}
