import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../config/theme.dart';
import '../data/community_provider.dart'; // Renamed logic, file name same for now
import '../data/question_model.dart';
import 'ask_question_screen.dart';

class QuestionListScreen extends ConsumerStatefulWidget {
  final String? categoryId;
  const QuestionListScreen({super.key, this.categoryId});

  @override
  ConsumerState<QuestionListScreen> createState() => _QuestionListScreenState();
}

class _QuestionListScreenState extends ConsumerState<QuestionListScreen> {
  final TextEditingController _searchController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final qaState = ref.watch(qaProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(
            widget.categoryId != null
                ? 'Comunidad: ${widget.categoryId}'
                : 'Comunidad Q&A',
            style: GoogleFonts.fredoka(
                fontWeight: FontWeight.bold, color: AppTheme.primary)),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: AppTheme.primary),
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Buscar preguntas...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none),
                filled: true,
                fillColor: Colors.white,
              ),
              onSubmitted: (value) {
                ref.read(qaProvider.notifier).loadQuestions(search: value);
              },
            ),
          ),

          // Question List
          Expanded(
            child: qaState.isLoading
                ? const Center(child: CircularProgressIndicator())
                : _buildQuestionList(qaState),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const AskQuestionScreen()),
          );
        },
        label: const Text('Preguntar'),
        icon: const Icon(Icons.add),
        backgroundColor: AppTheme.primary,
      ),
    );
  }

  Widget _buildQuestionList(QAState qaState) {
    final categoryQuestions = widget.categoryId != null
        ? qaState.questions
            .where((q) => q.categoryId == widget.categoryId)
            .toList()
        : qaState.questions;

    if (categoryQuestions.isEmpty) {
      return const Center(child: Text('No hay preguntas en esta categoría'));
    }

    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      itemCount: categoryQuestions.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final question = categoryQuestions[index];
        return _QuestionCard(
          question: question,
          onTap: () {
            context.push(
                '/comunidad/${widget.categoryId ?? "default"}/post/${question.id}');
          },
        );
      },
    );
  }
}

class _QuestionCard extends StatelessWidget {
  final Question question;
  final VoidCallback onTap;

  const _QuestionCard({required this.question, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 10,
                offset: const Offset(0, 4))
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 12,
                  backgroundImage: question.userImage != null
                      ? NetworkImage(question.userImage!)
                      : null,
                  child: question.userImage == null
                      ? Text(question.userName?[0] ?? '?',
                          style: const TextStyle(fontSize: 10))
                      : null,
                ),
                const SizedBox(width: 8),
                Text(question.userName ?? 'Anónimo',
                    style: const TextStyle(fontSize: 12, color: Colors.grey)),
                const Spacer(),
                if (question.isTrending)
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                        color: Colors.orange.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8)),
                    child: const Text('🔥 Trending',
                        style: TextStyle(
                            fontSize: 10,
                            color: Colors.orange,
                            fontWeight: FontWeight.bold)),
                  ),
              ],
            ),
            const SizedBox(height: 8),
            Text(question.title,
                style:
                    const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            Text(question.content,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(color: Colors.black54, fontSize: 13)),
            const SizedBox(height: 12),
            Row(
              children: [
                const Icon(Icons.remove_red_eye_outlined,
                    size: 14, color: Colors.grey),
                const SizedBox(width: 4),
                Text('${question.views}',
                    style: const TextStyle(fontSize: 12, color: Colors.grey)),
                const SizedBox(width: 16),
                const Icon(Icons.favorite_outline,
                    size: 14, color: Colors.grey),
                const SizedBox(width: 4),
                Text('${question.likes}',
                    style: const TextStyle(fontSize: 12, color: Colors.grey)),
              ],
            )
          ],
        ),
      ),
    );
  }
}
