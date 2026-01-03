import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../config/theme.dart';
import '../../dashboard/data/struggle_provider.dart';
import '../../dashboard/data/models/struggle_model.dart';
import '../data/devotionals_provider.dart';

class DevotionalsScreen extends ConsumerStatefulWidget {
  const DevotionalsScreen({super.key});

  @override
  ConsumerState<DevotionalsScreen> createState() => _DevotionalsScreenState();
}

class _DevotionalsScreenState extends ConsumerState<DevotionalsScreen> {
  String _selectedCategory = 'Para ti';
  final List<String> _categories = [
    'Para ti',
    'Ansiedad',
    'Identidad',
    'Integridad',
    'Soledad',
    'Fe',
    'Relaciones',
    'Oración'
  ];

  @override
  Widget build(BuildContext context) {
    final devotionalState = ref.watch(devotionalsProvider);
    final struggleState = ref.watch(struggleProvider);

    // Get active struggles to recommend devotionals
    final activeStruggleTitles = struggleState.struggles
        .where((s) => s.status == StruggleStatus.active && s.isStarted)
        .map((s) => s.title.toLowerCase())
        .toList();

    List<Devotional> recommendedDevotionals = [];
    if (_selectedCategory == 'Para ti') {
      // If user has active struggles, prioritize those categories
      if (activeStruggleTitles.isNotEmpty) {
        recommendedDevotionals = devotionalState.devotionals.where((d) {
          return activeStruggleTitles.any((title) =>
              d.category.toLowerCase().contains(title) ||
              title.contains(d.category.toLowerCase()));
        }).toList();
      }

      // If no matches or few matches, add default recommendations
      if (recommendedDevotionals.length < 2) {
        final additional = devotionalState.devotionals
            .where(
                (d) => d.isRecommended && !recommendedDevotionals.contains(d))
            .toList();
        recommendedDevotionals.addAll(additional);
      }
    }

    final filteredDevotionals = _selectedCategory == 'Para ti'
        ? devotionalState.devotionals
        : devotionalState.devotionals
            .where((d) => d.category == _selectedCategory)
            .toList();

    // --- Grouping Logic ---
    final Map<String, List<Devotional>> groupedDevs = {};
    final List<dynamic> displayItems = [];

    for (var dev in filteredDevotionals) {
      final name = _getGroupName(dev.title);
      if (name != dev.title) {
        groupedDevs.putIfAbsent(name, () => []).add(dev);
      } else {
        displayItems.add(dev);
      }
    }

    groupedDevs.forEach((name, devs) {
      if (devs.length > 1) {
        displayItems.add({'type': 'group', 'name': name, 'devotionals': devs});
      } else {
        displayItems.addAll(devs);
      }
    });
    // --- End Grouping Logic ---

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: CustomScrollView(
          physics: const ClampingScrollPhysics(),
          slivers: [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Devocionales',
                      style: GoogleFonts.fredoka(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.primary,
                      ),
                    ).animate().fadeIn().slideX(begin: -0.1),
                    const SizedBox(height: 8),
                    Text(
                      'Alimento diario para tu espíritu.',
                      style: TextStyle(color: AppTheme.textMuted, fontSize: 16),
                    ).animate().fadeIn(delay: 100.ms).slideX(begin: -0.1),
                  ],
                ),
              ),
            ),

            // Recommended Section
            if (_selectedCategory == 'Para ti' &&
                recommendedDevotionals.isNotEmpty) ...[
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Row(
                    children: [
                      const Icon(Icons.auto_awesome,
                          color: AppTheme.accent, size: 20),
                      const SizedBox(width: 8),
                      Text(
                        'RECOMENDADOS PARA TI',
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          fontWeight: FontWeight.w900,
                          color: AppTheme.primary,
                          letterSpacing: 1.2,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: SizedBox(
                  height: 160,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 16),
                    itemCount: recommendedDevotionals.length,
                    itemBuilder: (context, index) {
                      final dev = recommendedDevotionals[index];
                      return _buildRecommendedCard(dev)
                          .animate()
                          .fadeIn(delay: (200 + index * 100).ms)
                          .scale(
                              begin: const Offset(0.9, 0.9),
                              curve: Curves.easeOutBack);
                    },
                  ),
                ),
              ),
            ],

            // Categories Filter
            SliverToBoxAdapter(
              child: Container(
                height: 50,
                margin: const EdgeInsets.symmetric(vertical: 8),
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  itemCount: _categories.length,
                  itemBuilder: (context, index) {
                    final cat = _categories[index];
                    final isSelected = _selectedCategory == cat;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ChoiceChip(
                        label: Text(cat),
                        selected: isSelected,
                        onSelected: (selected) {
                          if (selected) setState(() => _selectedCategory = cat);
                        },
                        selectedColor: AppTheme.primary,
                        labelStyle: TextStyle(
                          color: isSelected ? Colors.white : AppTheme.primary,
                          fontWeight:
                              isSelected ? FontWeight.bold : FontWeight.normal,
                        ),
                        backgroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20)),
                        side: BorderSide(
                            color: isSelected
                                ? AppTheme.primary
                                : Colors.transparent),
                      ),
                    );
                  },
                ),
              ),
            ),

            // Devotionals List
            SliverPadding(
              padding: const EdgeInsets.all(24),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final item = displayItems[index];

                    if (item is Map) {
                      return _buildGroupCard(item['name'], item['devotionals'])
                          .animate()
                          .fadeIn(delay: (400 + index * 50).ms)
                          .slideY(begin: 0.1);
                    }

                    final dev = item as Devotional;
                    return _buildDevotionalCard(dev)
                        .animate()
                        .fadeIn(delay: (400 + index * 50).ms)
                        .slideY(begin: 0.1);
                  },
                  childCount: displayItems.length,
                ),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 100)),
          ],
        ),
      ),
    );
  }

  String _getGroupName(String title) {
    if (title.contains(':')) return title.split(':').first.trim();
    final regex = RegExp(r'\s+D[íi]a\s+', caseSensitive: false);
    if (regex.hasMatch(title)) {
      return title.split(regex).first.trim();
    }
    return title;
  }

  Widget _buildGroupCard(String name, List<Devotional> devs) {
    return GestureDetector(
      onTap: () {
        // Show days in a bottom sheet or navigate
        _showGroupDays(name, devs);
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: const Border(
            left: BorderSide(color: AppTheme.primary, width: 5),
          ),
          boxShadow: [
            BoxShadow(
                color: Colors.black.withValues(alpha: 0.04), blurRadius: 10)
          ],
        ),
        child: Row(
          children: [
            Container(
              height: 60,
              width: 60,
              decoration: BoxDecoration(
                color: AppTheme.primary.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(15),
              ),
              child: const Icon(Icons.collections_bookmark_rounded,
                  color: AppTheme.primary, size: 30),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name,
                      style: const TextStyle(
                          fontWeight: FontWeight.bold, fontSize: 18)),
                  const SizedBox(height: 4),
                  Text('${devs.length} días de contenido',
                      style:
                          TextStyle(color: AppTheme.textMuted, fontSize: 13)),
                ],
              ),
            ),
            Icon(Icons.chevron_right, color: AppTheme.textMuted),
          ],
        ),
      ),
    );
  }

  void _showGroupDays(String name, List<Devotional> devs) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.75,
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
        ),
        child: Column(
          children: [
            const SizedBox(height: 12),
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              name,
              style: GoogleFonts.fredoka(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: AppTheme.primary,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Selecciona un día para continuar',
              style: TextStyle(color: AppTheme.textMuted),
            ),
            const SizedBox(height: 24),
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                itemCount: devs.length,
                itemBuilder: (context, index) {
                  final dev = devs[index];
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: ListTile(
                      contentPadding: const EdgeInsets.all(12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                        side: BorderSide(color: Colors.grey.shade100),
                      ),
                      leading: CircleAvatar(
                        backgroundColor: AppTheme.primary.withValues(alpha: 0.1),
                        child: Text('${index + 1}',
                            style: const TextStyle(
                                color: AppTheme.primary,
                                fontWeight: FontWeight.bold)),
                      ),
                      title: Text(dev.title,
                          style: const TextStyle(fontWeight: FontWeight.bold)),
                      trailing: const Icon(Icons.arrow_forward_ios, size: 14),
                      onTap: () {
                        Navigator.pop(context);
                        context.push('/devotionals/${dev.id}');
                      },
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRecommendedCard(Devotional dev) {
    return GestureDetector(
      onTap: () => context.push('/devotionals/${dev.id}'),
      child: Container(
        width: 280,
        margin: const EdgeInsets.only(right: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
              color: AppTheme.primary.withValues(alpha: 0.1), width: 2),
          boxShadow: [
            BoxShadow(
                color: Colors.black.withValues(alpha: 0.05), blurRadius: 10)
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 80,
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: NetworkImage(dev.image),
                  fit: BoxFit.cover,
                ),
                borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(22),
                    bottomLeft: Radius.circular(22)),
              ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                          color: AppTheme.primary,
                          borderRadius: BorderRadius.circular(12)),
                      child: Text(dev.category,
                          style: const TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.bold)),
                    ),
                    const SizedBox(height: 8),
                    Text(dev.title,
                        style: const TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 14),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis),
                    const SizedBox(height: 4),
                    Text('${dev.time} lectura',
                        style:
                            TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDevotionalCard(Devotional dev) {
    return GestureDetector(
      onTap: () => context.push('/devotionals/${dev.id}'),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
                color: Colors.black.withValues(alpha: 0.03), blurRadius: 10)
          ],
        ),
        child: Row(
          children: [
            Container(
              height: 100,
              width: 100,
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: NetworkImage(dev.image),
                  fit: BoxFit.cover,
                ),
                borderRadius: BorderRadius.circular(20),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                            color: Colors.grey.shade100,
                            borderRadius: BorderRadius.circular(12)),
                        child: Text(dev.category,
                            style: TextStyle(
                                color: AppTheme.textMuted,
                                fontSize: 10,
                                fontWeight: FontWeight.bold)),
                      ),
                      const Icon(Icons.favorite_border,
                          size: 18, color: Colors.grey),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(dev.title,
                      style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          height: 1.2)),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      const Icon(Icons.access_time,
                          size: 14, color: Colors.grey),
                      const SizedBox(width: 4),
                      Text('${dev.time} lectura',
                          style: const TextStyle(
                              color: Colors.grey, fontSize: 12)),
                    ],
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
