import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../config/theme.dart';
import '../data/gamification_provider.dart';
import '../../../../l10n/app_localizations.dart';

class VerseScrambleScreen extends ConsumerStatefulWidget {
  const VerseScrambleScreen({super.key});

  @override
  ConsumerState<VerseScrambleScreen> createState() =>
      _VerseScrambleScreenState();
}

class _VerseScrambleScreenState extends ConsumerState<VerseScrambleScreen> {
  List<Map<String, dynamic>> _verses = [];
  int _currentVerseIndex = 0;
  List<String> _shuffledWords = [];
  List<String?> _placedWords = [];
  bool _isSuccess = false;
  bool _isError = false;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadVerses();
  }

  Future<void> _loadVerses() async {
    final repo = ref.read(gamificationRepositoryProvider);
    final allVerses = await repo.loadVerses();

    final completedIds = ref.read(gamificationProvider).completedVerseIds;
    final available =
        allVerses.where((v) => !completedIds.contains(v['id'])).toList();

    if (available.isEmpty) {
      setState(() {
        _verses = [];
        _isLoading = false;
      });
      return;
    }

    available.shuffle();
    setState(() {
      _verses = available.take(5).toList();
      _isLoading = false;
    });

    if (_verses.isNotEmpty) {
      _loadCurrentVerse();
    }
  }

  void _loadCurrentVerse() {
    final verse = _verses[_currentVerseIndex]['text'] as String;
    _shuffledWords = verse.split(' ')..shuffle();
    _placedWords = List.filled(verse.split(' ').length, null);
    _isSuccess = false;
    _isError = false;
    setState(() {});
  }

  void _onWordTap(String word, bool isFromBank) {
    setState(() {
      _isError = false;
      if (isFromBank) {
        // Find first empty slot
        final emptyIndex = _placedWords.indexOf(null);
        if (emptyIndex != -1) {
          _placedWords[emptyIndex] = word;
          _shuffledWords.remove(word); // Ideally remove only one instance
        }
      } else {
        // Return to bank
        _placedWords[_placedWords.indexOf(word)] = null;
        _shuffledWords.add(word);
      }
    });

    // Auto-check if full
    if (!_placedWords.contains(null)) {
      _checkAnswer();
    }
  }

  void _checkAnswer() {
    final currentVerseMap = _verses[_currentVerseIndex];
    final currentVerse = currentVerseMap['text'] as String;
    final constructed = _placedWords.join(' ');

    if (constructed == currentVerse) {
      setState(() => _isSuccess = true);
      ref.read(gamificationProvider.notifier).addManna(10);

      if (currentVerseMap['id'] != null) {
        ref
            .read(gamificationProvider.notifier)
            .markVerseCompleted(currentVerseMap['id']);
      }

      _showSuccessDialog();
    } else {
      setState(() => _isError = true);
      // Haptic feedback could go here
    }
  }

  void _showSuccessDialog() {
    final l10n = AppLocalizations.of(context);
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: Text(l10n.correctExclamation),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(LucideIcons.checkCircle, color: Colors.green, size: 60),
            const SizedBox(height: 16),
            Text(l10n.earnedManna, style: TextStyle(color: AppTheme.textMuted)),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              if (_currentVerseIndex < _verses.length - 1) {
                setState(() => _currentVerseIndex++);
                _loadCurrentVerse();
              } else {
                _showAllCompletedDialog();
              }
            },
            child: Text(l10n.nextButton),
          )
        ],
      ),
    );
  }

  void _showAllCompletedDialog() {
    final l10n = AppLocalizations.of(context);
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: Text(l10n.roundCompleted),
        content: Text(l10n.sessionCompleted),
        actions: [
          TextButton(
            onPressed: () {
              context.pop();
              context.pop();
            },
            child: Text(l10n.backMenu),
          )
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (_verses.isEmpty) {
      final l10n = AppLocalizations.of(context);
      return Scaffold(
        appBar: AppBar(title: Text(l10n.scrambleTitle)),
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

    final reference = _verses[_currentVerseIndex]['reference'] as String;
    final l10n = AppLocalizations.of(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(l10n.scrambleTitle),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: AppTheme.primary),
          onPressed: () => context.pop(),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            // Progress Bar
            LinearProgressIndicator(
              value: (_currentVerseIndex + 1) / _verses.length,
              backgroundColor: Colors.grey[200],
              color: AppTheme.primary,
              borderRadius: BorderRadius.circular(10),
            ),
            const SizedBox(height: 16),
            Text(
              '${l10n.verseLabel} ${_currentVerseIndex + 1}',
              style: TextStyle(color: AppTheme.textMuted),
            ),
            const SizedBox(height: 32),

            // Reference Hint
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.blue.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                reference,
                style: const TextStyle(
                  color: Colors.blue,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
            ),
            const SizedBox(height: 32),

            // Target Area
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: _isError
                    ? Border.all(color: Colors.red, width: 2)
                    : (_isSuccess
                        ? Border.all(color: Colors.green, width: 2)
                        : null),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    blurRadius: 20,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: Wrap(
                spacing: 8,
                runSpacing: 8,
                alignment: WrapAlignment.center,
                children: List.generate(_placedWords.length, (index) {
                  final word = _placedWords[index];
                  return GestureDetector(
                    onTap: word != null ? () => _onWordTap(word, false) : null,
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 10),
                      decoration: BoxDecoration(
                        color:
                            word != null ? AppTheme.primary : Colors.grey[100],
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: word != null
                            ? [
                                BoxShadow(
                                    color:
                                        AppTheme.primary.withValues(alpha: 0.3),
                                    blurRadius: 8,
                                    offset: const Offset(0, 4))
                              ]
                            : [],
                      ),
                      child: Text(
                        word ?? '',
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                    ),
                  );
                }),
              ),
            ),

            const Spacer(),

            // Word Bank
            Wrap(
              spacing: 12,
              runSpacing: 12,
              alignment: WrapAlignment.center,
              children: _shuffledWords.map((word) {
                return GestureDetector(
                  onTap: () => _onWordTap(word, true),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 20, vertical: 12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.grey.shade300, width: 2),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.05),
                          blurRadius: 5,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Text(
                      word,
                      style: GoogleFonts.fredoka(
                        color: AppTheme.primary,
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                    ),
                  ),
                ).animate().scale(curve: Curves.easeOutBack, duration: 200.ms);
              }).toList(),
            ),
            const SizedBox(height: 48),
          ],
        ),
      ),
    );
  }
}
