import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../config/theme.dart';
import '../../dashboard/data/mascot_provider.dart';

class TriviaScreen extends ConsumerStatefulWidget {
  const TriviaScreen({super.key});

  @override
  ConsumerState<TriviaScreen> createState() => _TriviaScreenState();
}

class _TriviaScreenState extends ConsumerState<TriviaScreen> {
  int _currentIndex = 0;
  int _score = 0;
  bool _isComplete = false;
  int? _selectedOption;
  bool _showExplanation = false;

  final List<Map<String, dynamic>> _questions = [
    {
      'question': '¿Quién fue el primer rey de Israel?',
      'options': ['David', 'Saúl', 'Salomón', 'Samuel'],
      'answer': 1,
      'explanation': 'Saúl fue ungido por el profeta Samuel como el primer rey de Israel.',
      'ref': '1 Samuel 10:1',
    },
    {
      'question': '¿Cuántos días estuvo Jonás en el vientre del gran pez?',
      'options': ['1 día', '3 días', '7 días', '40 días'],
      'answer': 1,
      'explanation': 'Jonás estuvo tres días y tres noches dentro del gran pez.',
      'ref': 'Jonás 1:17',
    },
    {
      'question': '¿Cuál es el capítulo más largo de la Biblia?',
      'options': ['Salmo 1', 'Salmo 23', 'Salmo 117', 'Salmo 119'],
      'answer': 3,
      'explanation': 'El Salmo 119 es el capítulo más largo, con 176 versículos.',
      'ref': 'Salmos 119',
    },
     {
      'question': '¿Quién escribió la mayoría de los Salmos?',
      'options': ['Moisés', 'David', 'Salomón', 'Asaf'],
      'answer': 1,
      'explanation': 'El Rey David es el autor tradicional de más de 70 salmos.',
      'ref': 'Salmos',
    },
     {
      'question': '¿En qué ciudad nació Jesús?',
      'options': ['Nazaret', 'Jerusalén', 'Belén', 'Egipto'],
      'answer': 2,
      'explanation': 'Jesús nació en Belén de Judea, como fue profetizado.',
      'ref': 'Mateo 2:1',
    },
  ];

  void _handleAnswer(int index) {
    if (_selectedOption != null) return;
    setState(() {
      _selectedOption = index;
      if (index == _questions[_currentIndex]['answer']) {
        _score++;
      }
      _showExplanation = true;
    });
  }

  void _next() {
    if (_currentIndex < _questions.length - 1) {
      setState(() {
        _currentIndex++;
        _selectedOption = null;
        _showExplanation = false;
      });
    } else {
      setState(() => _isComplete = true);
      // Award rewards
      ref.read(mascotProvider.notifier).addExperience(_score * 10);
      ref.read(mascotProvider.notifier).addFlamePoints(_score * 2);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isComplete) return _buildResults();

    final q = _questions[_currentIndex];

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Text('Trivia Bíblica', style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: AppTheme.primary)),
        leading: IconButton(icon: const Icon(Icons.close, color: AppTheme.primary), onPressed: () => context.pop()),
      ),
      body: Column(
        children: [
          LinearProgressIndicator(
            value: (_currentIndex + 1) / _questions.length,
            backgroundColor: Colors.grey.shade200,
            valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.accent),
            minHeight: 6,
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Pregunta ${_currentIndex + 1} de ${_questions.length}', style: const TextStyle(color: Colors.grey, fontWeight: FontWeight.bold, fontSize: 13)),
                  const SizedBox(height: 16),
                  Text(q['question'], style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppTheme.primary)),
                  const SizedBox(height: 32),
                  ...List.generate(4, (index) => _buildOption(index, q['options'][index])),
                  
                  if (_showExplanation) ...[
                    const SizedBox(height: 32),
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: AppTheme.accent.withValues(alpha: 0.3))),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Row(
                            children: [
                              Icon(Icons.info_outline, color: AppTheme.accent, size: 20),
                              SizedBox(width: 8),
                              Text('EXPLICACIÓN', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.accent, fontSize: 12)),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Text(q['explanation'], style: const TextStyle(fontSize: 14, height: 1.5)),
                          const SizedBox(height: 12),
                          Text('Referencia: ${q['ref']}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.grey)),
                        ],
                      ),
                    ),
                    const SizedBox(height: 32),
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton(
                        onPressed: _next,
                        style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primary, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20))),
                        child: Text(_currentIndex == _questions.length - 1 ? 'VER RESULTADOS' : 'SIGUIENTE PREGUNTA', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOption(int index, String text) {
    final isSelected = _selectedOption == index;
    final isCorrect = index == _questions[_currentIndex]['answer'];
    
    Color bgColor = Colors.white;
    Color textColor = AppTheme.primary;
    IconData? icon;

    if (_selectedOption != null) {
      if (isCorrect) {
        bgColor = Colors.green.shade50;
        textColor = Colors.green.shade700;
        icon = Icons.check_circle;
      } else if (isSelected) {
        bgColor = Colors.red.shade50;
        textColor = Colors.red.shade700;
        icon = Icons.cancel;
      }
    }

    return GestureDetector(
      onTap: () => _handleAnswer(index),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: isSelected ? textColor : Colors.white, width: 2),
          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 5)],
        ),
        child: Row(
          children: [
            Expanded(child: Text(text, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: textColor))),
            if (icon != null) Icon(icon, color: textColor),
          ],
        ),
      ),
    );
  }

  Widget _buildResults() {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.emoji_events_outlined, size: 100, color: AppTheme.accent),
            const SizedBox(height: 32),
            const Text('¡Excelente trabajo!', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: AppTheme.primary)),
            Text('Has respondido $_score de ${_questions.length} correctamente.', style: const TextStyle(color: Colors.grey, fontSize: 16)),
            const SizedBox(height: 48),
            Container(
              padding: const EdgeInsets.all(24),
              margin: const EdgeInsets.symmetric(horizontal: 40),
              decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(32)),
              child: Column(
                children: [
                  const Text('RECOMPENSAS PARA LLAMI', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12, letterSpacing: 1.2, color: Colors.grey)),
                  const SizedBox(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildRewardItem('+${_score * 10} XP', Icons.bolt, Colors.blue),
                      _buildRewardItem('+${_score * 2} 🔥', Icons.local_fire_department, Colors.orange),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 64),
            SizedBox(
              width: 250,
              height: 56,
              child: ElevatedButton(
                onPressed: () => context.go('/dashboard'),
                style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primary, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30))),
                child: const Text('VOLVER AL INICIO', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRewardItem(String text, IconData icon, Color color) {
    return Column(
      children: [
        Icon(icon, color: color, size: 32),
        const SizedBox(height: 8),
        Text(text, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: color)),
      ],
    );
  }
}
