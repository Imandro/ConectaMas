import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../config/theme.dart';
import '../data/mascot_provider.dart';

class CheckinScreen extends ConsumerStatefulWidget {
  const CheckinScreen({super.key});

  @override
  ConsumerState<CheckinScreen> createState() => _CheckinScreenState();
}

class _CheckinScreenState extends ConsumerState<CheckinScreen> {
  String? _selectedMood;
  final TextEditingController _noteController = TextEditingController();
  bool _isSaving = false;

  final Map<int, String> _history = {
    1: '😄', 2: '😄', 3: '😐', 4: '😄', 5: '😔', 6: '😐', 7: '😄',
    8: '😄', 9: '😐', 10: '😄', 11: '😄', 12: '😔', 13: '😄', 14: '😄',
  };

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final daysInMonth = DateTime(now.year, now.month + 1, 0).day;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text('Salud Espiritual', style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: AppTheme.primary)),
        leading: IconButton(icon: const Icon(Icons.arrow_back, color: AppTheme.primary), onPressed: () => context.pop()),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Today's Checkin Card
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(32),
                boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 20)],
              ),
              child: Column(
                children: [
                  const Text('¿Cómo te sientes hoy?', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _buildMoodButton('😔', Colors.red),
                      const SizedBox(width: 16),
                      _buildMoodButton('😐', Colors.orange),
                      const SizedBox(width: 16),
                      _buildMoodButton('😄', Colors.green),
                    ],
                  ),
                  const SizedBox(height: 32),
                  TextField(
                    controller: _noteController,
                    maxLines: 3,
                    decoration: InputDecoration(
                      hintText: 'Escribe una breve nota... (Opcional)',
                      fillColor: const Color(0xFFF1F5F9),
                      filled: true,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                    ),
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    height: 54,
                    child: ElevatedButton(
                      onPressed: _selectedMood == null ? null : () {
                        setState(() => _isSaving = true);
                        Future.delayed(const Duration(seconds: 1), () {
                          if (mounted) {
                            setState(() => _isSaving = false);
                            ref.read(mascotProvider.notifier).addExperience(10);
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('¡Check-in guardado! +10 XP para Llami 🔥')));
                            context.pop();
                          }
                        });
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primary,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      ),
                      child: Text(_isSaving ? 'Guardando...' : 'Guardar Registro', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 40),

            // History Section
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Tu Mes', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.primary)),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: Colors.grey.shade200)),
                  child: Row(
                    children: [
                      const Icon(Icons.calendar_today, size: 14, color: Colors.grey),
                      const SizedBox(width: 8),
                      Text(DateFormat('MMMM', 'es').format(now).toUpperCase(), style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Calendar Grid
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 10)]),
              child: Wrap(
                spacing: 10,
                runSpacing: 10,
                children: List.generate(daysInMonth, (index) {
                  final day = index + 1;
                  final mood = _history[day];
                  final isToday = day == now.day;
                  final isFuture = day > now.day;

                  return Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      color: mood != null ? _getMoodColor(mood) : (isFuture ? Colors.grey.withValues(alpha: 0.05) : Colors.grey.withValues(alpha: 0.1)),
                      shape: BoxShape.circle,
                      border: isToday ? Border.all(color: AppTheme.primary, width: 2) : null,
                    ),
                    child: Center(
                      child: mood != null 
                        ? Text(mood, style: const TextStyle(fontSize: 16))
                        : Text('$day', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: isFuture ? Colors.grey.shade300 : Colors.grey)),
                    ),
                  );
                }),
              ),
            ),
            const SizedBox(height: 48),
          ],
        ),
      ),
    );
  }

  Widget _buildMoodButton(String emoji, Color color) {
    final isSelected = _selectedMood == emoji;
    return GestureDetector(
      onTap: () => setState(() => _selectedMood = emoji),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? color : Colors.grey.shade50,
          shape: BoxShape.circle,
          boxShadow: isSelected ? [BoxShadow(color: color.withValues(alpha: 0.3), blurRadius: 10, offset: const Offset(0, 4))] : null,
        ),
        child: Text(emoji, style: TextStyle(fontSize: 32, color: isSelected ? Colors.white : Colors.black)),
      ),
    );
  }

  Color _getMoodColor(String mood) {
    if (mood == '😄') return Colors.green.withValues(alpha: 0.1);
    if (mood == '😐') return Colors.orange.withValues(alpha: 0.1);
    if (mood == '😔') return Colors.red.withValues(alpha: 0.1);
    return Colors.grey.withValues(alpha: 0.1);
  }
}
