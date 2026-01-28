import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../data/community_provider.dart';
import '../../data/question_model.dart';
import '../question_detail_screen.dart';

class DailyQuestionModal extends ConsumerWidget {
  const DailyQuestionModal({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(qaProvider);
    final questions = state.dailyQuestions;

    if (questions.isEmpty) return const SizedBox.shrink();

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                      color: Colors.blue.withOpacity(0.1),
                      shape: BoxShape.circle),
                  child: const Icon(Icons.lightbulb, color: Colors.blue)),
              const SizedBox(width: 12),
              Expanded(
                  child: Text('Pregunta del Día',
                      style: GoogleFonts.fredoka(
                          fontSize: 20, fontWeight: FontWeight.bold))),
              IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.close)),
            ],
          ),
          const SizedBox(height: 16),
          Text('Explora las preguntas destacadas de hoy por la comunidad.',
              style: const TextStyle(color: Colors.black54)),
          const SizedBox(height: 24),
          ...questions.map((q) => _buildQuestionItem(context, q)).toList(),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Ver más preguntas'),
          )
        ],
      ),
    );
  }

  Widget _buildQuestionItem(BuildContext context, Question q) {
    return InkWell(
      onTap: () {
        Navigator.pop(context);
        Navigator.push(
            context,
            MaterialPageRoute(
                builder: (c) => QuestionDetailScreen(questionId: q.id)));
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.withOpacity(0.1)),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(q.title, style: const TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            Row(
              children: [
                Text(q.userName ?? 'Anónimo',
                    style: const TextStyle(fontSize: 10, color: Colors.grey)),
                const Spacer(),
                const Icon(Icons.remove_red_eye, size: 10, color: Colors.grey),
                const SizedBox(width: 2),
                Text('${q.views}',
                    style: const TextStyle(fontSize: 10, color: Colors.grey))
              ],
            )
          ],
        ),
      ),
    );
  }
}
