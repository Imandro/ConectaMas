import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../config/theme.dart';
import '../../../../l10n/app_localizations.dart';
import '../data/avatar_repository.dart';
import '../domain/avatar_config.dart';
import 'widgets/avatar_preview.dart';

class AvatarEditorScreen extends ConsumerStatefulWidget {
  const AvatarEditorScreen({super.key});

  @override
  ConsumerState<AvatarEditorScreen> createState() => _AvatarEditorScreenState();
}

class _AvatarEditorScreenState extends ConsumerState<AvatarEditorScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    // length 6 for Skin, Hair, Color, Face, Clothes, Bg
    _tabController = TabController(length: 6, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final avatarConfigAsync = ref.watch(avatarConfigProvider);
    final l10n = AppLocalizations.of(context);

    final List<String> tabs = [
      l10n.tabSkin,
      l10n.tabHair,
      l10n.tabColor,
      l10n.tabFace,
      l10n.tabClothes,
      l10n.tabBg
    ];

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(l10n.customizeAvatar,
            style: GoogleFonts.fredoka(fontWeight: FontWeight.bold)),
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.close, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
            },
            child: Text(l10n.done,
                style:
                    const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          )
        ],
      ),
      body: avatarConfigAsync.when(
        data: (config) => Column(
          children: [
            const SizedBox(height: 20),
            // Preview
            Center(
              child: Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                    color: Colors.grey[100],
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.grey[200]!, width: 4)),
                child: AvatarPreview(config: config, size: 220),
              ),
            ),
            const SizedBox(height: 30),

            // Tab Bar
            TabBar(
              controller: _tabController,
              isScrollable: true,
              labelColor: AppTheme.primary,
              unselectedLabelColor: Colors.grey,
              indicatorColor: AppTheme.primary,
              indicatorWeight: 3,
              labelStyle: GoogleFonts.fredoka(
                  fontWeight: FontWeight.w600, fontSize: 13),
              unselectedLabelStyle: GoogleFonts.fredoka(
                  fontWeight: FontWeight.w500, fontSize: 13),
              tabs: tabs.map((t) => Tab(text: t)).toList(),
            ),

            // Options
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildGrid(
                      5,
                      (i) => _update(config.copyWith(skinColorIndex: i)),
                      config.skinColorIndex,
                      isColor: true,
                      colors: [
                        const Color(0xFFFFDBAC),
                        const Color(0xFFF1C27D),
                        const Color(0xFFE0AC69),
                        const Color(0xFF8D5524),
                        const Color(0xFF583E2A),
                      ]),
                  _buildGrid(
                      3,
                      (i) => _update(config.copyWith(hairStyleIndex: i)),
                      config.hairStyleIndex,
                      labels: [l10n.hairShort, l10n.hairSpiky, l10n.hairLong]),
                  _buildGrid(
                      5,
                      (i) => _update(config.copyWith(hairColorIndex: i)),
                      config.hairColorIndex,
                      isColor: true,
                      colors: [
                        Colors.black,
                        const Color(0xFF4E342E),
                        const Color(0xFFE65100),
                        const Color(0xFF424242),
                        const Color(0xFFBDBDBD),
                      ]),
                  _buildGrid(
                      3,
                      (i) => _update(config.copyWith(mouthStyleIndex: i)),
                      config.mouthStyleIndex,
                      labels: [
                        l10n.mouthSmile,
                        l10n.mouthSerious,
                        l10n.mouthSurprise
                      ]),
                  _buildGrid(5, (i) => _update(config.copyWith(outfitIndex: i)),
                      config.outfitIndex,
                      isColor: true,
                      colors: [
                        Colors.red,
                        Colors.blue,
                        Colors.green,
                        Colors.orange,
                        Colors.purple,
                      ]),
                  _buildGrid(
                      5,
                      (i) => _update(config.copyWith(backgroundColorIndex: i)),
                      config.backgroundColorIndex,
                      isColor: true,
                      colors: [
                        Colors.blue.shade100,
                        Colors.green.shade100,
                        Colors.purple.shade100,
                        Colors.orange.shade100,
                        Colors.red.shade100,
                      ]),
                ],
              ),
            ),
          ],
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
    );
  }

  void _update(AvatarConfig newConfig) {
    ref.read(avatarConfigProvider.notifier).updateConfig(newConfig);
  }

  Widget _buildGrid(int count, Function(int) onTap, int selectedIndex,
      {bool isColor = false, List<Color>? colors, List<String>? labels}) {
    return GridView.builder(
      padding: const EdgeInsets.all(20),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 4,
        crossAxisSpacing: 15,
        mainAxisSpacing: 15,
      ),
      itemCount: count,
      itemBuilder: (context, index) {
        final isSelected = index == selectedIndex;
        return GestureDetector(
          onTap: () => onTap(index),
          child: Container(
            decoration: BoxDecoration(
              color: isColor ? colors![index] : Colors.white,
              borderRadius: BorderRadius.circular(15),
              border: Border.all(
                color: isSelected
                    ? AppTheme.primary
                    : (isColor ? Colors.transparent : Colors.grey[300]!),
                width: isSelected ? 3 : 1,
              ),
              boxShadow: isSelected
                  ? [
                      BoxShadow(
                          color: AppTheme.primary.withValues(alpha: 0.3),
                          blurRadius: 8,
                          offset: const Offset(0, 4))
                    ]
                  : [],
            ),
            child: !isColor && labels != null
                ? Center(
                    child: Text(labels[index],
                        style: TextStyle(
                            fontWeight: isSelected
                                ? FontWeight.bold
                                : FontWeight.normal,
                            color:
                                isSelected ? AppTheme.primary : Colors.black)))
                : (isSelected && isColor
                    ? const Icon(Icons.check, color: Colors.white)
                    : null),
          ),
        );
      },
    );
  }
}
