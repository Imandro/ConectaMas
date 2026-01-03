import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../../config/theme.dart';
import '../data/challenge_data.dart';
import '../data/challenge_provider.dart';
import '../../dashboard/presentation/widgets/llami_mascot.dart';

class ChallengeScreen extends ConsumerStatefulWidget {
  const ChallengeScreen({super.key});

  @override
  ConsumerState<ChallengeScreen> createState() => _ChallengeScreenState();
}

class _ChallengeScreenState extends ConsumerState<ChallengeScreen> {
  int _currentIndex = 0;
  String? _selectedOption;
  bool? _isCorrect;
  bool _showingFeedback = false;
  final GlobalKey<State> _cardKey = GlobalKey<State>();

  void _handleOptionTap(String option) {
    if (_showingFeedback) return;
    setState(() {
      _selectedOption = option;
    });
  }

  void _checkAnswer() {
    final challengeState = ref.read(challengeProvider);
    final currentChallenge = challengeState.currentChallenges[_currentIndex];
    
    bool correct = false;
    if (currentChallenge.type == ChallengeType.verse) {
      correct = _selectedOption == currentChallenge.missingWords[0];
    } else {
      final falseIds = ['t2', 't7', 't9'];
      final expectedTrue = !falseIds.contains(currentChallenge.id);
      correct = (_selectedOption == 'Verdadero') == expectedTrue;
    }

    setState(() {
      _isCorrect = correct;
      _showingFeedback = true;
    });

    if (correct) {
      ref.read(challengeProvider.notifier).completeStep();
    }
  }

  void _nextChallenge() {
    final challengeState = ref.read(challengeProvider);
    if (_currentIndex < 4 && _currentIndex < challengeState.currentChallenges.length - 1) {
      setState(() {
        _currentIndex++;
        _selectedOption = null;
        _isCorrect = null;
        _showingFeedback = false;
      });
    } else {
      _showSuccessDialog();
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 16),
            const SizedBox(
              width: 100,
              height: 120,
              child: LlamiMascot(streak: 7, expression: LlamiExpression.happy),
            ),
            const SizedBox(height: 24),
            Text(
              '¡META LOGRADA!',
              style: GoogleFonts.fredoka(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: AppTheme.primary,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'Has completado tus 5 desafíos de hoy. ¡Tu fe se fortalece cada día!',
              textAlign: TextAlign.center,
              style: GoogleFonts.openSans(fontSize: 16),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.of(context).pop();
                  context.pop();
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primary,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: Text('CONTINUAR', style: GoogleFonts.fredoka(fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  LlamiExpression _getMascotExpression() {
    if (_showingFeedback) {
      return _isCorrect! ? LlamiExpression.happy : LlamiExpression.sad;
    }
    if (_selectedOption != null) return LlamiExpression.thinking;
    return LlamiExpression.happy;
  }

  @override
  Widget build(BuildContext context) {
    final challengeState = ref.watch(challengeProvider);
    if (challengeState.currentChallenges.isEmpty) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final currentChallenge = challengeState.currentChallenges[_currentIndex];
    final progress = (_currentIndex + 1) / 5;

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.grey),
                    onPressed: () => context.pop(),
                  ),
                  Expanded(
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: LinearProgressIndicator(
                        value: progress,
                        minHeight: 12,
                        backgroundColor: Colors.grey.shade200,
                        color: AppTheme.primary,
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  const Icon(Icons.flash_on, color: Colors.orange),
                ],
              ),
            ),

            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        SizedBox(
                          width: 80,
                          height: 80,
                          child: LlamiMascot(
                            streak: 7, 
                            expression: _getMascotExpression(),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: Colors.grey.shade300, width: 2),
                            ),
                            child: Text(
                              _showingFeedback 
                                ? (_isCorrect! ? '¡Excelente trabajo!' : '¡Oops! Sigue intentándolo.')
                                : '¿Cuál es la palabra correcta?',
                              style: GoogleFonts.fredoka(fontSize: 14),
                            ),
                          ).animate(target: _showingFeedback ? 1 : 0).scale(duration: 200.ms),
                        ),
                      ],
                    ),
                    const SizedBox(height: 32),

                    Text(
                      currentChallenge.type == ChallengeType.verse 
                        ? 'Completa el versículo:' 
                        : '¿Es esto una verdad bíblica?',
                      style: GoogleFonts.fredoka(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                    ),
                    const SizedBox(height: 16),
                    
                    Container(
                      key: _cardKey,
                      width: double.infinity,
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: AppTheme.secondary.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: AppTheme.secondary.withValues(alpha: 0.3)),
                      ),
                      child: Column(
                        children: [
                          Text(
                            currentChallenge.content,
                            textAlign: TextAlign.center,
                            style: GoogleFonts.openSans(
                              fontSize: 18,
                              height: 1.5,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          if (currentChallenge.type == ChallengeType.verse) ...[
                            const SizedBox(height: 12),
                            Text(
                              currentChallenge.reference,
                              style: GoogleFonts.openSans(
                                fontSize: 14,
                                color: Colors.grey.shade600,
                                fontStyle: FontStyle.italic,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ).animate(target: (_showingFeedback && !_isCorrect!) ? 1 : 0)
                     .shake(duration: 400.ms, hz: 6),
                    
                    const Spacer(),

                    // Options Grid - Word Bank Style
                    GridView.count(
                      shrinkWrap: true,
                      crossAxisCount: 2,
                      mainAxisSpacing: 12,
                      crossAxisSpacing: 12,
                      childAspectRatio: 2.5,
                      children: currentChallenge.options.map((option) {
                        final isSelected = _selectedOption == option;
                        return GestureDetector(
                          onTap: () => _handleOptionTap(option),
                          child: AnimatedContainer(
                            duration: 200.ms,
                            decoration: BoxDecoration(
                              color: isSelected ? AppTheme.primary.withValues(alpha: 0.1) : Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: isSelected ? AppTheme.primary : Colors.grey.shade300,
                                width: 2,
                              ),
                              boxShadow: isSelected ? [] : [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.1),
                                  offset: const Offset(0, 4),
                                  blurRadius: 0,
                                )
                              ],
                            ),
                            child: Center(
                              child: Text(
                                option,
                                style: GoogleFonts.fredoka(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: isSelected ? AppTheme.primary : Colors.black87,
                                ),
                              ),
                            ),
                          ),
                        ).animate(target: isSelected ? 1 : 0).scale(begin: const Offset(1, 1), end: const Offset(0.95, 0.95));
                      }).toList(),
                    ),
                  ],
                ),
              ),
            ),

            // Feedback
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: _showingFeedback 
                  ? (_isCorrect! ? Colors.green.shade50 : Colors.red.shade50)
                  : Colors.white,
                border: Border(top: BorderSide(color: Colors.grey.shade200)),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (_showingFeedback) ...[
                    Row(
                      children: [
                        Icon(
                          _isCorrect! ? Icons.check_circle : Icons.error,
                          color: _isCorrect! ? Colors.green : Colors.red,
                          size: 32,
                        ),
                        const SizedBox(width: 12),
                        Text(
                          _isCorrect! ? '¡Excelente!' : '¡Puedes mejorar!',
                          style: GoogleFonts.fredoka(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: _isCorrect! ? Colors.green : Colors.red,
                          ),
                        ),
                      ],
                    ).animate().slideY(begin: 0.5),
                    const SizedBox(height: 16),
                  ],
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: _selectedOption == null 
                        ? null 
                        : (_showingFeedback ? _nextChallenge : _checkAnswer),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _showingFeedback 
                          ? (_isCorrect! ? Colors.green : Colors.red)
                          : AppTheme.primary,
                        foregroundColor: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      child: Text(
                        _showingFeedback ? 'CONTINUAR' : 'COMPROBAR',
                        style: GoogleFonts.fredoka(fontWeight: FontWeight.bold, fontSize: 16),
                      ),
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
