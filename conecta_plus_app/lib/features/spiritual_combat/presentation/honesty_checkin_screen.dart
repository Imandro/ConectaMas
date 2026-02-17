import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../l10n/app_localizations.dart';

class HonestyCheckinScreen extends StatefulWidget {
  const HonestyCheckinScreen({super.key});

  @override
  State<HonestyCheckinScreen> createState() => _HonestyCheckinScreenState();
}

class _HonestyCheckinScreenState extends State<HonestyCheckinScreen> {
  int _currentStep = 0;
  final List<bool?> _answers = List.filled(4, null);
  final TextEditingController _actionController = TextEditingController();
  bool _isProcessing = false;

  void _nextStep(bool answer) {
    setState(() {
      _answers[_currentStep] = answer;
      _currentStep++;
    });
  }

  void _finish() async {
    setState(() => _isProcessing = true);

    // Simulate saving/processing
    await Future.delayed(2.seconds);

    if (!mounted) return;

    // Determine the "Spiritual Prescription" based on answers
    String message;

    if (_answers[2] == true) {
      // Yielded to temptation
      message =
          "Dios te ama y Su gracia es mayor que tu caída. Levántate, confiesa y sigue adelante. 'Siete veces cae el justo, y vuelve a levantarse'.";
    } else if (_answers[1] == true) {
      // Tempted but didn't yield
      message =
          "¡Victoria! Has resistido al diablo y él ha huido. Sigue firme en Su Palabra.";
    } else {
      message =
          "¡Gloria a Dios por un día en victoria! Mantén tu lámpara encendida y tus ojos en Jesús.";
    }

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: Text("Reflexión de Gracia",
            style: GoogleFonts.fredoka(fontWeight: FontWeight.bold)),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context); // Close dialog
              Navigator.pop(context); // Return to Hub
            },
            child: const Text("AMÉN"),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final questions = [
      l10n.q1Spirit,
      l10n.q2Temptation,
      l10n.q3Failed,
      l10n.q4Honesty,
      l10n.q5Action,
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(l10n.honestyCheckin.toUpperCase(),
            style: GoogleFonts.fredoka(
                fontWeight: FontWeight.w900, color: Colors.blue.shade900)),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: Icon(Icons.close, color: Colors.blue.shade900),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: _isProcessing
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const CircularProgressIndicator(),
                  const SizedBox(height: 20),
                  Text(l10n.qProcess,
                      style: const TextStyle(fontWeight: FontWeight.bold)),
                ],
              ),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.all(32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  LinearProgressIndicator(
                    value: (_currentStep + 1) / questions.length,
                    backgroundColor: Colors.blue.shade50,
                    color: Colors.blue.shade600,
                  ),
                  const SizedBox(height: 60),
                  Text(
                    questions[_currentStep],
                    textAlign: TextAlign.center,
                    style: GoogleFonts.fredoka(
                      fontSize: 26,
                      fontWeight: FontWeight.bold,
                      color: const Color(
                          0xFF334155), // Slate-like color (Slate 700)
                      height: 1.3,
                    ),
                  )
                      .animate(key: ValueKey(_currentStep))
                      .fadeIn()
                      .slideY(begin: 0.1),
                  const SizedBox(height: 60),
                  if (_currentStep < 4) ...[
                    ElevatedButton(
                      onPressed: () => _nextStep(true),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue.shade600,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.all(24),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20)),
                      ),
                      child: Text(l10n.qYes,
                          style: const TextStyle(
                              fontSize: 18, fontWeight: FontWeight.bold)),
                    ),
                    const SizedBox(height: 16),
                    OutlinedButton(
                      onPressed: () => _nextStep(false),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.all(24),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20)),
                        side: BorderSide(color: Colors.blue.shade200),
                      ),
                      child: Text(l10n.qNo,
                          style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.blue.shade700)),
                    ),
                  ] else ...[
                    TextField(
                      controller: _actionController,
                      maxLines: 4,
                      decoration: InputDecoration(
                        hintText: "Escribe tu compromiso para hoy...",
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(20),
                            borderSide: BorderSide.none),
                      ),
                    ),
                    const SizedBox(height: 32),
                    ElevatedButton(
                      onPressed: _finish,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green.shade600,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.all(24),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20)),
                      ),
                      child: const Text("GUARDAR Y SELLAR",
                          style: TextStyle(
                              fontSize: 18, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ],
              ),
            ),
    );
  }
}
