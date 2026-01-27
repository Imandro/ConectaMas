import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../config/theme.dart';
import '../data/community_provider.dart';

class CommunityScreen extends ConsumerWidget {
  const CommunityScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final communityState = ref.watch(communityProvider);
    final l10n = AppLocalizations.of(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(l10n.communityTitle,
                style: GoogleFonts.inter(
                    fontWeight: FontWeight.bold,
                    color: AppTheme.primary,
                    fontSize: 24)),
            Text(l10n.communitySubtitle,
                style: const TextStyle(color: Colors.grey, fontSize: 13)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none, color: AppTheme.primary),
            onPressed: () {},
          ),
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: CircleAvatar(
              backgroundColor: AppTheme.primary,
              child: IconButton(
                icon: const Icon(Icons.add, color: Colors.white),
                onPressed: () => context.push('/comunidad/new'),
              ),
            ),
          ),
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(24),
        itemCount: communityState.categories.length,
        itemBuilder: (context, index) {
          final category = communityState.categories[index];
          return Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: _buildCategoryCard(
              context,
              category: category,
            ),
          );
        },
      ),
    );
  }

  Widget _buildCategoryCard(BuildContext context,
      {required CommunityCategory category}) {
    final l10n = AppLocalizations.of(context);

    // Map category ID to localized name and description
    String name = category.name;
    String description = category.description;

    switch (category.id) {
      case 'peticiones-oracion':
        name = l10n.catPrayer;
        description = l10n.descPrayer;
        break;
      case 'estudio-biblico':
        name = l10n.catBible;
        description = l10n.descBible;
        break;
      case 'testimonios':
        name = l10n.catTestimony;
        description = l10n.descTestimony;
        break;
      case 'preguntas-dudas':
        name = l10n.catQuestions;
        description = l10n.descQuestions;
        break;
      case 'consejos-vida':
        name = l10n.catAdvice;
        description = l10n.descAdvice;
        break;
      case 'alabanza-adoracion':
        name = l10n.catPraise;
        description = l10n.descPraise;
        break;
    }

    return GestureDetector(
      onTap: () => context.push('/comunidad/${category.id}'),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
                color: Colors.black.withValues(alpha: 0.05), blurRadius: 10)
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                  color: category.color,
                  borderRadius: BorderRadius.circular(16)),
              child: Text(category.icon, style: const TextStyle(fontSize: 32)),
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(name,
                      style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                          color: AppTheme.primary)),
                  Text(description,
                      style: const TextStyle(color: Colors.grey, fontSize: 12),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.chat_bubble_outline,
                          size: 14, color: Colors.grey),
                      const SizedBox(width: 4),
                      Text(l10n.postsCount(category.postCount),
                          style: const TextStyle(
                              color: Colors.grey, fontSize: 11)),
                    ],
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: Colors.grey),
          ],
        ),
      ),
    );
  }
}

