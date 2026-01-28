import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/community_provider.dart';
import '../data/question_model.dart';
import '../../auth/data/auth_provider.dart';

class QuestionDetailScreen extends ConsumerStatefulWidget {
  final String questionId;
  const QuestionDetailScreen({super.key, required this.questionId});

  @override
  ConsumerState<QuestionDetailScreen> createState() => _QuestionDetailScreenState();
}

class _QuestionDetailScreenState extends ConsumerState<QuestionDetailScreen> {
  final _answerController = TextEditingController();
  
  @override
  void initState() {
    super.initState();
    Future.microtask(() => 
      ref.read(qaProvider.notifier).loadQuestionDetail(widget.questionId)
    );
  }

  Future<void> _submitAnswer() async {
     if (_answerController.text.isEmpty) return;
     final user = ref.read(authProvider).user;
     if (user == null) return;
     
     final success = await ref.read(qaProvider.notifier).createAnswer(
       user.id,
       widget.questionId,
       _answerController.text
     );
     
     if (success) {
       _answerController.clear();
     }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(qaProvider);
    final question = state.currentQuestion;

    if (state.isLoading && question == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (question == null) {
      return const Scaffold(body: Center(child: Text('Pregunta no encontrada')));
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Pregunta')),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // Question Header
                Text(question.title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                 Row(
                   children: [
                     CircleAvatar(radius: 10, backgroundImage: question.userImage != null ? NetworkImage(question.userImage!) : null),
                     const SizedBox(width: 8),
                     Text(question.userName ?? 'Anónimo', style: const TextStyle(color: Colors.grey)),
                   ],
                 ),
                const SizedBox(height: 16),
                Text(question.content, style: const TextStyle(fontSize: 16)),
                const Divider(height: 32),
                
                // Answers
                Text('${state.currentAnswers.length} Respuestas', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                const SizedBox(height: 16),
                ...state.currentAnswers.map((answer) => Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 4)]),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                        Row(
                         children: [
                           Text(answer.userName ?? 'Anónimo', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                           const Spacer(),
                           if (answer.isAccepted) const Icon(Icons.check_circle, color: Colors.green, size: 16),
                         ],
                       ),
                       const SizedBox(height: 4),
                       Text(answer.content),
                    ],
                  ),
                )),
              ],
            ),
          ),
          
          // Answer Input
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(color: Colors.white, border: Border(top: BorderSide(color: Colors.black12))),
            child: Row(
              children: [
                Expanded(child: TextField(controller: _answerController, decoration: const InputDecoration(hintText: 'Añadir respuesta...', border: InputBorder.none))),
                IconButton(icon: const Icon(Icons.send, color: Colors.blue), onPressed: _submitAnswer),
              ],
            ),
          )
        ],
      ),
    );
  }
}
