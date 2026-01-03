import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../config/theme.dart';
import '../../../../shared/widgets/custom_button.dart';

class CheckInCard extends StatelessWidget {
  const CheckInCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppTheme.accent.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: AppTheme.accent.withValues(alpha: 0.2), width: 2),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppTheme.accent.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.favorite, color: AppTheme.accent),
              ),
              const SizedBox(width: 16),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'SALUD ESPIRITUAL',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.accent,
                        letterSpacing: 1.1,
                      ),
                    ),
                    Text(
                      '¿Cómo estás hoy?',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.primary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            child: CustomButton(
              text: 'Hacer Check-in diario',
              backgroundColor: AppTheme.accent,
              onPressed: () => context.go('/dashboard/checkin'),
            ),
          ),
        ],
      ),
    );
  }
}

class _CheckInDialog extends StatefulWidget {
  const _CheckInDialog();

  @override
  State<_CheckInDialog> createState() => _CheckInDialogState();
}

class _CheckInDialogState extends State<_CheckInDialog> {
  int _mood = 3;
  bool _readBible = false;
  bool _prayed = false;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
      ),
      padding: EdgeInsets.fromLTRB(24, 24, 24, MediaQuery.of(context).viewInsets.bottom + 24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Check-in Espiritual',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.primary),
          ),
          const SizedBox(height: 24),
          
          // Mood
          const Text('¿Cuál es tu estado de ánimo?', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: List.generate(5, (index) => IconButton(
              icon: Icon(
                index < _mood ? Icons.star : Icons.star_border,
                color: AppTheme.accent,
                size: 32,
              ),
              onPressed: () => setState(() => _mood = index + 1),
            )),
          ),
          
          const SizedBox(height: 32),
          
          // Habits
          const Text('Hábitos de hoy', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          CheckboxListTile(
            title: const Text('Leí la Biblia'),
            value: _readBible,
            activeColor: AppTheme.primary,
            onChanged: (v) => setState(() => _readBible = v ?? false),
          ),
          CheckboxListTile(
            title: const Text('Hice una oración'),
            value: _prayed,
            activeColor: AppTheme.primary,
            onChanged: (v) => setState(() => _prayed = v ?? false),
          ),
          
          const SizedBox(height: 32),
          
          SizedBox(
            width: double.infinity,
            child: CustomButton(
              text: 'Guardar Check-in',
              onPressed: () => Navigator.pop(context),
            ),
          ),
        ],
      ),
    );
  }
}
