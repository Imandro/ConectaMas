import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../config/theme.dart';
import '../data/bible_provider.dart';
import '../data/verses_provider.dart';

class BibleScreen extends ConsumerStatefulWidget {
  const BibleScreen({super.key});

  @override
  ConsumerState<BibleScreen> createState() => _BibleScreenState();
}

class _BibleScreenState extends ConsumerState<BibleScreen> {
  Timer? _heartbeatTimer;

  @override
  void initState() {
    super.initState();
    _startHeartbeat();
  }

  @override
  void dispose() {
    _heartbeatTimer?.cancel();
    super.dispose();
  }

  void _startHeartbeat() {
    _heartbeatTimer = Timer.periodic(const Duration(minutes: 1), (timer) {
      // In a real app, send a request to the API
      debugPrint('Mascot Heartbeat: BIBLE_READING');
    });
  }

  @override
  Widget build(BuildContext context) {
    final bibleState = ref.watch(bibleProvider);
    final bibleNotifier = ref.read(bibleProvider.notifier);

    if (bibleState.isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (bibleState.error != null) {
      return Scaffold(
        body: Center(child: Text('Error: ${bibleState.error}')),
      );
    }

    final currentBook = bibleState.currentBook;
    final verses = bibleState.currentChapterVerses;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text('La Biblia',
            style: TextStyle(
                color: AppTheme.primary, fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
              icon: const Icon(Icons.search, color: AppTheme.primary),
              onPressed: () {}),
          IconButton(
              icon: const Icon(Icons.bookmark_border, color: AppTheme.primary),
              onPressed: () {}),
        ],
      ),
      body: Column(
        children: [
          // Selectors
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.white,
            child: Row(
              children: [
                Expanded(
                  flex: 2,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    decoration: BoxDecoration(
                        color: Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(12)),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<int>(
                        value: bibleState.selectedBookIndex,
                        isExpanded: true,
                        items: List.generate(
                          bibleState.books.length,
                          (index) => DropdownMenuItem(
                            value: index,
                            child: Text(bibleState.books[index].name,
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold)),
                          ),
                        ),
                        onChanged: (v) {
                          if (v != null) bibleNotifier.selectBook(v);
                        },
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  flex: 1,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    decoration: BoxDecoration(
                        color: Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(12)),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<int>(
                        value: bibleState.selectedChapter,
                        isExpanded: true,
                        items: List.generate(
                                currentBook?.chapterCount ?? 0, (i) => i + 1)
                            .map((i) => DropdownMenuItem(
                                value: i,
                                child: Text('$i',
                                    style: const TextStyle(
                                        fontWeight: FontWeight.bold))))
                            .toList(),
                        onChanged: (v) {
                          if (v != null) bibleNotifier.selectChapter(v);
                        },
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Chapter Navigation
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  onPressed: bibleNotifier.prevChapter,
                  icon: const Icon(Icons.chevron_left),
                  color: AppTheme.primary,
                ),
                Text(
                  'Capítulo ${bibleState.selectedChapter}',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: AppTheme.primary,
                  ),
                ),
                IconButton(
                  onPressed: bibleNotifier.nextChapter,
                  icon: const Icon(Icons.chevron_right),
                  color: AppTheme.primary,
                ),
              ],
            ),
          ),

          // Bible Content
          Expanded(
            child: verses == null
                ? const Center(child: Text('No se pudo cargar el capítulo'))
                : ListView.builder(
                    padding: const EdgeInsets.all(24),
                    itemCount: verses.length + 2,
                    itemBuilder: (context, index) {
                      if (index == 0) {
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 24),
                          child: Text(
                            '${currentBook?.name} ${bibleState.selectedChapter}',
                            style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.primary),
                          ),
                        );
                      }
                      if (index == verses.length + 1) {
                        return const SizedBox(height: 40);
                      }
                      return _buildVerse(index, verses[index - 1]);
                    },
                  ),
          ),

          // Helpful Verses Sidebar (Mobile version is a bottom sheet or section)
          _buildHelpfulVersesSection(),
        ],
      ),
    );
  }

  Widget _buildHelpfulVersesSection() {
    final selectedTag = ref.watch(selectedTagProvider);
    final filteredVerses = ref.watch(filteredVersesProvider);

    final tags = [
      'Ansiedad',
      'Depresión',
      'Identidad',
      'Perdón',
      'Fortaleza',
      'Paz',
      'Confianza',
      'Valentía',
      'Descanso'
    ];

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 10,
              offset: const Offset(0, -5))
        ],
        borderRadius: const BorderRadius.vertical(top: Radius.circular(30)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(Icons.favorite, color: Colors.red, size: 20),
                  SizedBox(width: 8),
                  Text('Versículos de Ayuda',
                      style:
                          TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                ],
              ),
              if (selectedTag != null)
                TextButton(
                  onPressed: () =>
                      ref.read(selectedTagProvider.notifier).state = null,
                  child: const Text('Limpiar', style: TextStyle(fontSize: 12)),
                ),
            ],
          ),
          const SizedBox(height: 16),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: tags
                  .map((tag) => _buildVerseBadge(
                      tag, selectedTag == tag, () => _onTagSelected(tag)))
                  .toList(),
            ),
          ),
          if (selectedTag != null) ...[
            const SizedBox(height: 16),
            SizedBox(
              height: 100,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: filteredVerses.length,
                itemBuilder: (context, index) {
                  final verse = filteredVerses[index];
                  return Container(
                    width: 250,
                    margin: const EdgeInsets.only(right: 16),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppTheme.primary.withValues(alpha: 0.05),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                          color: AppTheme.primary.withValues(alpha: 0.1)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          verse.reference,
                          style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                              color: AppTheme.primary),
                        ),
                        const SizedBox(height: 4),
                        Expanded(
                          child: Text(
                            verse.text,
                            style: const TextStyle(fontSize: 13),
                            maxLines: 3,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ],
      ),
    );
  }

  void _onTagSelected(String tag) {
    ref.read(selectedTagProvider.notifier).state = tag;
  }

  Widget _buildVerse(int num, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: RichText(
        text: TextSpan(
          children: [
            TextSpan(
                text: '$num ',
                style: const TextStyle(
                    color: AppTheme.primary,
                    fontWeight: FontWeight.bold,
                    fontSize: 14)),
            TextSpan(
                text: text,
                style: const TextStyle(
                    color: Colors.black87, fontSize: 17, height: 1.6)),
          ],
        ),
      ),
    );
  }

  Widget _buildVerseBadge(String label, bool isSelected, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(right: 8),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
            color: isSelected
                ? AppTheme.primary
                : AppTheme.primary.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(20)),
        child: Text(label,
            style: TextStyle(
                color: isSelected ? Colors.white : AppTheme.primary,
                fontWeight: FontWeight.bold,
                fontSize: 12)),
      ),
    );
  }
}
