import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../config/theme.dart';
import '../data/gamification_provider.dart';
import '../../ads/data/ad_service.dart';
import '../../../../l10n/app_localizations.dart';

class TriviaScreen extends ConsumerStatefulWidget {
  const TriviaScreen({super.key});

  @override
  ConsumerState<TriviaScreen> createState() => _TriviaScreenState();
}

class _TriviaScreenState extends ConsumerState<TriviaScreen> {
  List<Map<String, dynamic>> _questions = [];
  int _currentQuestionIndex = 0;
  int _score = 0;
  int _lives = 3;
  int _timer = 15;
  Timer? _timerTicker;
  bool _isAnswered = false;
  int? _selectedOptionIndex;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadQuestions();
  }

  Future<void> _loadQuestions() async {
    final repo = ref.read(gamificationRepositoryProvider);
    final allQuestions = await repo.loadTriviaQuestions();

    // Get completed IDs from state
    final completedIds = ref.read(gamificationProvider).completedTriviaIds;

    // Filter available
    final available =
        allQuestions.where((q) => !completedIds.contains(q['id'])).toList();

    if (available.isEmpty) {
      setState(() {
        _questions = [];
        _isLoading = false;
      });
      return;
    }

    // Shuffle and take up to 10
    available.shuffle();
    setState(() {
      _questions = available.take(10).toList();
      _isLoading = false;
    });

    if (_questions.isNotEmpty) {
      _startTimer();
    }
  }

  @override
  void dispose() {
    _timerTicker?.cancel();
    super.dispose();
  }

  void _startTimer() {
    _timer = 15;
    _timerTicker?.cancel();
    _timerTicker = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_timer > 0) {
        setState(() => _timer--);
      } else {
        _handleTimeOut();
      }
    });
  }

  void _handleTimeOut() {
    _timerTicker?.cancel();
    setState(() {
      _isAnswered = true;
      _lives--;
    });

    if (_lives == 0) {
      _showGameOverDialog();
    } else {
      Future.delayed(const Duration(seconds: 3), _nextQuestion);
    }
  }

  void _handleAnswer(int index) {
    if (_isAnswered) return;

    _timerTicker?.cancel();
    setState(() {
      _isAnswered = true;
      _selectedOptionIndex = index;
    });

    final question = _questions[_currentQuestionIndex];
    final isCorrect = index == question['answer'];

    if (isCorrect) {
      setState(() {
        _score += 10 + _timer; // Bonus for speed
      });
      // Add Manna reward
      ref.read(gamificationProvider.notifier).addManna(5);

      // Mark as completed
      if (question['id'] != null) {
        ref
            .read(gamificationProvider.notifier)
            .markTriviaCompleted(question['id']);
      }
    } else {
      setState(() => _lives--);
    }

    if (_lives == 0) {
      _showGameOverDialog();
    } else {
      Future.delayed(const Duration(seconds: 3), _nextQuestion);
    }
  }

  void _nextQuestion() {
    if (_currentQuestionIndex < _questions.length - 1) {
      setState(() {
        _currentQuestionIndex++;
        _isAnswered = false;
        _selectedOptionIndex = null;
      });
      _startTimer();
    } else {
      _showGameOverDialog(isWin: true);
    }
  }

  void _showGameOverDialog({bool isWin = false}) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        final l10n = AppLocalizations.of(context);
        return AlertDialog(
          title: Text(isWin ? l10n.levelCompleted : l10n.gameOver),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(isWin ? LucideIcons.trophy : LucideIcons.heartCrack,
                  color: isWin ? Colors.amber : Colors.red, size: 50),
              const SizedBox(height: 16),
              Text(isWin ? l10n.roundSuccess : l10n.outOfLives),
              const SizedBox(height: 16),
              if (!isWin)
                ElevatedButton.icon(
                  onPressed: () async {
                    final adService = ref.read(adServiceProvider);
                    final success = await adService.showRewardedAd(context);

                    if (success && context.mounted) {
                      Navigator.pop(context);
                      setState(() {
                        _lives = 1;
                        _isAnswered = false;
                        _selectedOptionIndex = null;
                        _timer = 15;
                      });
                      _startTimer();
                    }
                  },
                  icon: const Icon(Icons.play_circle_filled),
                  label: Text(l10n.reviveAd),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    foregroundColor: Colors.white,
                  ),
                ),
              const Divider(),
              Text('${l10n.finalScore} $_score'),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                ref
                    .read(gamificationProvider.notifier)
                    .updateHighScore('trivia', _score);
                context.pop(); // Close dialog
                context.pop(); // Go back to lobby
              },
              child: Text(AppLocalizations.of(context).exitGame),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (_questions.isEmpty) {
      final l10n = AppLocalizations.of(context);
      return Scaffold(
        appBar: AppBar(title: Text(l10n.triviaTitle)),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(LucideIcons.checkCircle,
                  size: 60, color: Colors.green),
              const SizedBox(height: 16),
              Text(
                l10n.allCompletedDesc,
                textAlign: TextAlign.center,
                style:
                    const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(l10n.comeBackLater),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () => context.pop(),
                child: Text(l10n.backMenu),
              )
            ],
          ),
        ),
      );
    }

    final question = _questions[_currentQuestionIndex];
    final options = (question['options'] as List).cast<String>();
    final correctIndex = question['answer'] as int;
    final l10n = AppLocalizations.of(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(l10n.triviaTitle),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: AppTheme.primary),
          onPressed: () => context.pop(),
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.amber.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                const Icon(LucideIcons.star, color: Colors.amber, size: 18),
                const SizedBox(width: 4),
                Text(
                  '$_score',
                  style: const TextStyle(
                      color: Colors.amber, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            // Status Bar (Lives & Timer)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: List.generate(3, (index) {
                    return Icon(
                      Icons.favorite,
                      color: index < _lives ? Colors.red : Colors.grey[300],
                      size: 28,
                    );
                  }),
                ),
                Stack(
                  alignment: Alignment.center,
                  children: [
                    CircularProgressIndicator(
                      value: _timer / 15,
                      color: _timer < 5 ? Colors.red : AppTheme.primary,
                      backgroundColor: Colors.grey[200],
                    ),
                    Text(
                      '$_timer',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 32),

            // Question Card
            Container(
              padding: const EdgeInsets.all(24),
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    blurRadius: 20,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Text(
                    '${l10n.questionLabel} ${_currentQuestionIndex + 1}/${_questions.length}',
                    style: TextStyle(
                      color: AppTheme.primary.withValues(alpha: 0.6),
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    question['question'],
                    textAlign: TextAlign.center,
                    style: GoogleFonts.fredoka(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.primary,
                    ),
                  ),
                ],
              ),
            ).animate().slideY(begin: 0.1).fadeIn(),

            const SizedBox(height: 32),

            // Options
            ...List.generate(options.length, (index) {
              Color color = Colors.white;
              Color textColor = AppTheme.primary;
              Color borderColor = Colors.grey[200]!;

              if (_isAnswered) {
                if (index == correctIndex) {
                  color = Colors.green.shade100;
                  borderColor = Colors.green;
                  textColor = Colors.green.shade900;
                } else if (index == _selectedOptionIndex) {
                  color = Colors.red.shade100;
                  borderColor = Colors.red;
                  textColor = Colors.red.shade900;
                }
              }

              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: GestureDetector(
                  onTap: () => _handleAnswer(index),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: color,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: borderColor, width: 2),
                    ),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 14,
                          backgroundColor: borderColor.withValues(alpha: 0.5),
                          child: Text(
                            String.fromCharCode(65 + index),
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: textColor,
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Text(
                            options[index],
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: textColor,
                            ),
                          ),
                        ),
                        if (_isAnswered && index == correctIndex)
                          const Icon(Icons.check_circle, color: Colors.green),
                        if (_isAnswered &&
                            index == _selectedOptionIndex &&
                            index != correctIndex)
                          const Icon(Icons.cancel, color: Colors.red),
                      ],
                    ),
                  ),
                ),
              ).animate().fadeIn(delay: (100 * index).ms).slideX();
            }),

            if (_isAnswered && question['explanation'] != null)
              Container(
                margin: const EdgeInsets.only(top: 16),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.blue.shade50,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.blue.shade200),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.lightbulb, color: Colors.blue),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        question['explanation'],
                        style: TextStyle(
                            color: Colors.blue.shade900, fontSize: 13),
                      ),
                    ),
                  ],
                ),
              ).animate().fadeIn(),
          ],
        ),
      ),
    );
  }
}
