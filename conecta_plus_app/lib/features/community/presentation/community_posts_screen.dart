import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../config/theme.dart';

class CommunityPostsScreen extends StatelessWidget {
  final String categoryId;
  const CommunityPostsScreen({super.key, required this.categoryId});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);

    // Map categoryId to localized data
    String name = '';
    String description = '';
    String icon = '';

    switch (categoryId) {
      case 'peticiones-oracion':
        name = l10n.catPrayer;
        description = l10n.descPrayer;
        icon = '🙏';
        break;
      case 'estudio-biblico':
        name = l10n.catBible;
        description = l10n.descBible;
        icon = '📖';
        break;
      case 'testimonios':
        name = l10n.catTestimony;
        description = l10n.descTestimony;
        icon = '✨';
        break;
      case 'preguntas-dudas':
        name = l10n.catQuestions;
        description = l10n.descQuestions;
        icon = '💡';
        break;
      case 'consejos-vida':
        name = l10n.catAdvice;
        description = l10n.descAdvice;
        icon = '🌱';
        break;
      case 'alabanza-adoracion':
        name = l10n.catPraise;
        description = l10n.descPraise;
        icon = '🎸';
        break;
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: Padding(
          padding: const EdgeInsets.all(8.0),
          child: CircleAvatar(
            backgroundColor: Colors.white,
            child: IconButton(
              icon: const Icon(Icons.arrow_back, color: AppTheme.primary),
              onPressed: () => context.pop(),
            ),
          ),
        ),
        title: Text(name,
            style: const TextStyle(
                color: AppTheme.primary, fontWeight: FontWeight.bold)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          // Category Banner
          Container(
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                  colors: [AppTheme.primary, Color(0xFF1E293B)]),
              borderRadius: BorderRadius.circular(32),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(icon, style: const TextStyle(fontSize: 40)),
                const SizedBox(height: 16),
                Text(name,
                    style: const TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold)),
                Text(description,
                    style: const TextStyle(color: Colors.white70, fontSize: 13)),
              ],
            ),
          ),
          const SizedBox(height: 32),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(l10n.titleLabel,
                  style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                      color: AppTheme.primary)),
              ElevatedButton(
                onPressed: () =>
                    context.go('/comunidad/new?categoryId=$categoryId'),
                style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primary,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20))),
                child: Text(l10n.newPost,
                    style: const TextStyle(color: Colors.white)),
              ),
            ],
          ),
          const SizedBox(height: 24),

          _buildPostCard(
            context,
            id: '1',
            title: 'Oración por mi familia',
            content: 'Estamos pasando por un momento difícil económicamente y pido sus oraciones para que Dios provea...',
            author: 'Anónimo',
            replies: 12,
            time: 'Hace 2h',
          ),
          _buildPostCard(
            context,
            id: '2',
            title: 'Gracias a Dios por mi salud',
            content: 'Hace unos meses pedí oración por una cirugía y hoy puedo dar testimonio de que todo salió bien...',
            author: 'Juan Pérez',
            replies: 8,
            time: 'Hace 5h',
          ),
        ],
      ),
    );
  }

  Widget _buildPostCard(BuildContext context, {required String id, required String title, required String content, required String author, required int replies, required String time}) {
    return GestureDetector(
      onTap: () => context.go('/comunidad/$categoryId/post/$id'),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 10)],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppTheme.primary)),
            const SizedBox(height: 12),
            Text(content, style: const TextStyle(color: Colors.black54, fontSize: 14, height: 1.4), maxLines: 2, overflow: TextOverflow.ellipsis),
            const SizedBox(height: 20),
            Row(
              children: [
                const Icon(Icons.person_outline, size: 16, color: Colors.grey),
                const SizedBox(width: 4),
                Text(author, style: const TextStyle(color: Colors.grey, fontSize: 12)),
                const SizedBox(width: 16),
                const Icon(Icons.access_time, size: 16, color: Colors.grey),
                const SizedBox(width: 4),
                Text(time, style: const TextStyle(color: Colors.grey, fontSize: 12)),
                const Spacer(),
                const Icon(Icons.chat_bubble_outline, size: 16, color: Colors.grey),
                const SizedBox(width: 4),
                Text('$replies', style: const TextStyle(color: Colors.grey, fontSize: 12)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
