import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../config/theme.dart';

class TriviaScreen extends StatefulWidget {
  const TriviaScreen({super.key});

  @override
  State<TriviaScreen> createState() => _TriviaScreenState();
}

class _TriviaScreenState extends State<TriviaScreen> {
  int _currentIndex = 0;
  int? _selectedOption;
  bool _showFeedback = false;
  int _score = 0;
  bool _isComplete = false;

  final List<Map<String, dynamic>> _questions = [
    {
      'question': '¿Quién fue el primer rey de Israel?',
      'options': ['David', 'Saúl', 'Salomón', 'Gedeón'],
      'correctIndex': 1,
      'explanation': 'Saúl fue ungido por el profeta Samuel como el primer rey de Israel.',
      'reference': '1 Samuel 10:1'
    },
    {
      'question': '¿Cuántos días estuvo Jonás en el vientre del gran pez?',
      'options': ['1 día', '3 días', '7 días', '40 días'],
      'correctIndex': 1,
      'explanation': 'La Biblia relata que Jonás estuvo tres días y tres noches en el vientre del pez.',
      'reference': 'Jonás 1:17'
    },
  ];

  void _handleOptionSelect(int index) {
    if (_showFeedback) return;
    setState(() {
      _selectedOption = index;
      _showFeedback = true;
      if (index == _questions[_currentIndex]['correctIndex']) {
        _score++;
      }
    });
  }

  void _nextQuestion() {
    if (_currentIndex < _questions.length - 1) {
      setState(() {
        _currentIndex++;
        _selectedOption = null;
        _showFeedback = false;
      });
    } else {
      setState(() => _isComplete = true);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isComplete) return _buildResults();

    final q = _questions[_currentIndex];

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: CircleAvatar(
          backgroundColor: Colors.white,
          child: IconButton(icon: const Icon(Icons.chevron_left, color: AppTheme.primary), onPressed: () => context.pop()),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Trivia Bíblica', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primary, fontSize: 18)),
            Text('Desafía tu conocimiento', style: TextStyle(color: AppTheme.textMuted, fontSize: 12)),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            // Progress
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('PREGUNTA ${_currentIndex + 1} DE ${_questions.length}', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.grey, fontSize: 10)),
                Text('${((_currentIndex + 1) / _questions.length * 100).round()}%', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.grey, fontSize: 10)),
              ],
            ),
            const SizedBox(height: 8),
            LinearProgressIndicator(value: (_currentIndex + 1) / _questions.length, backgroundColor: Colors.white, color: AppTheme.accent, minHeight: 8),
            const SizedBox(height: 32),

            // Question Card
            Container(
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(32), boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 20)]),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(q['question'], style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, height: 1.4)),
                  const SizedBox(height: 32),
                  ...List.generate(q['options'].length, (index) => _buildOption(index, q['options'][index], q['correctIndex'])),
                  
                  if (_showFeedback) ...[
                    const SizedBox(height: 32),
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: _selectedOption == q['correctIndex'] ? Colors.green.withValues(alpha: 0.1) : Colors.red.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(_selectedOption == q['correctIndex'] ? '¡Correcto!' : 'No exactamente', style: TextStyle(fontWeight: FontWeight.bold, color: _selectedOption == q['correctIndex'] ? Colors.green : Colors.red)),
                          const SizedBox(height: 4),
                          Text(q['explanation'], style: const TextStyle(fontSize: 13, color: Colors.black54)),
                          const SizedBox(height: 8),
                          Container(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4), decoration: BoxDecoration(color: AppTheme.primary.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(20)), child: Text(q['reference'], style: const TextStyle(color: AppTheme.primary, fontSize: 10, fontWeight: FontWeight.bold))),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton(
                        onPressed: _nextQuestion,
                        style: ElevatedButton.styleFrom(backgroundColor: AppTheme.accent, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)), elevation: 0),
                        child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [Text(_currentIndex == _questions.length - 1 ? 'Ver Resultados' : 'Siguiente', style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primary)), const SizedBox(width: 8), const Icon(Icons.arrow_forward, color: AppTheme.primary)]),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOption(int index, String text, int correctIndex) {
    bool isSelected = _selectedOption == index;
    bool isCorrect = index == correctIndex;
    
    Color bgColor = Colors.grey.shade50;
    Color borderColor = Colors.grey.shade200;
    Color textColor = Colors.black87;

    if (_showFeedback) {
      if (isCorrect) {
        bgColor = Colors.green;
        borderColor = Colors.green;
        textColor = Colors.white;
      } else if (isSelected) {
        bgColor = Colors.red;
        borderColor = Colors.red;
        textColor = Colors.white;
      } else {
        bgColor = Colors.white;
        textColor = Colors.black26;
      }
    } else if (isSelected) {
      bgColor = AppTheme.accent.withValues(alpha: 0.1);
      borderColor = AppTheme.accent;
    }

    return GestureDetector(
      onTap: () => _handleOptionSelect(index),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(16), border: Border.all(color: borderColor, width: 2)),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(text, style: TextStyle(fontWeight: FontWeight.bold, color: textColor, fontSize: 16)),
            if (_showFeedback && isCorrect) const Icon(Icons.check_circle, color: Colors.white),
            if (_showFeedback && isSelected && !isCorrect) const Icon(Icons.cancel, color: Colors.white),
          ],
        ),
      ),
    );
  }

  Widget _buildResults() {
    return Scaffold(
      backgroundColor: AppTheme.primary,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(40.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.emoji_events, color: AppTheme.accent, size: 100),
              const SizedBox(height: 24),
              const Text('¡Trivia Completada!', style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              Text('Has acertado $_score de ${_questions.length} preguntas.', style: const TextStyle(color: Colors.white70, fontSize: 18)),
              const SizedBox(height: 48),
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(24)),
                child: Column(
                  children: [
                    const Text('RECOMPENSA PARA LLAMI', style: TextStyle(color: AppTheme.accent, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        Column(children: [Text('+${_score * 10}', style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)), const Text('XP', style: TextStyle(color: Colors.white54, fontSize: 12))]),
                        Column(children: [Text('+${_score * 5}', style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)), const Text('LLAMAS', style: TextStyle(color: Colors.white54, fontSize: 12))]),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 48),
              SizedBox(width: double.infinity, height: 60, child: ElevatedButton(onPressed: () => context.go('/dashboard/llami'), style: ElevatedButton.styleFrom(backgroundColor: AppTheme.accent, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30))), child: const Text('ALIMENTAR A LLAMI Y GUARDAR', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primary)))),
            ],
          ),
        ),
      ),
    );
  }
}
