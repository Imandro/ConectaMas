import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../config/theme.dart';
import '../../../l10n/app_localizations.dart';
import '../data/community_provider.dart';
import '../../auth/data/auth_provider.dart';

class NewPostScreen extends ConsumerStatefulWidget {
  const NewPostScreen({super.key});

  @override
  ConsumerState<NewPostScreen> createState() => _NewPostScreenState();
}

class _NewPostScreenState extends ConsumerState<NewPostScreen> {
  final _titleController = TextEditingController();
  final _contentController = TextEditingController();
  bool _isAnonymous = false;
  String? _selectedCategoryId;
  bool _isLoading = false;

  Future<void> _publish() async {
    if (_titleController.text.isEmpty ||
        _contentController.text.isEmpty ||
        _selectedCategoryId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor, completa todos los campos')),
      );
      return;
    }

    setState(() => _isLoading = true);
    final user = ref.read(authProvider).user;
    if (user == null) return;

    final success = await ref.read(qaProvider.notifier).createQuestion(
          user.id,
          _titleController.text,
          _contentController.text,
        );

    setState(() => _isLoading = false);

    if (success && mounted) {
      context.pop();
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Error al publicar')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close, color: AppTheme.primary),
          onPressed: () => context.pop(),
        ),
        title: Text(l10n.newPost,
            style: const TextStyle(
                color: AppTheme.primary, fontWeight: FontWeight.bold)),
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            child: _isLoading
                ? const Center(
                    child: SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2)))
                : ElevatedButton(
                    onPressed: _publish,
                    style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primary,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20))),
                    child: Text(l10n.publish,
                        style: const TextStyle(
                            color: Colors.white, fontWeight: FontWeight.bold)),
                  ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Category Selector
            Text(l10n.whichCategory,
                style:
                    const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(16)),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  hint: Text(l10n.selectCategory),
                  isExpanded: true,
                  value: _selectedCategoryId,
                  items: [
                    DropdownMenuItem(
                        value: 'peticiones-oracion',
                        child: Text('🙏 ${l10n.catPrayer}')),
                    DropdownMenuItem(
                        value: 'estudio-biblico',
                        child: Text('📖 ${l10n.catBible}')),
                    DropdownMenuItem(
                        value: 'testimonios',
                        child: Text('✨ ${l10n.catTestimony}')),
                    DropdownMenuItem(
                        value: 'preguntas-dudas',
                        child: Text('💡 ${l10n.catQuestions}')),
                  ],
                  onChanged: (v) => setState(() => _selectedCategoryId = v),
                ),
              ),
            ),
            const SizedBox(height: 32),

            // Title
            Text(l10n.titleLabel,
                style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    color: AppTheme.textMuted)),
            TextField(
              controller: _titleController,
              decoration: InputDecoration(
                hintText: l10n.hintTitle,
                border: const UnderlineInputBorder(),
              ),
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 32),

            // Content
            Text(l10n.contentLabel,
                style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    color: AppTheme.textMuted)),
            TextField(
              controller: _contentController,
              decoration: InputDecoration(
                hintText: l10n.hintContent,
                border: InputBorder.none,
              ),
              maxLines: 8,
            ),
            const SizedBox(height: 32),

            // Anonymous Switch
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(24)),
              child: Row(
                children: [
                  const Icon(Icons.visibility_off, color: AppTheme.primary),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(l10n.publishAnonymous,
                            style: const TextStyle(
                                fontWeight: FontWeight.bold, fontSize: 14)),
                        Text(l10n.identityHidden,
                            style: const TextStyle(
                                color: Colors.grey, fontSize: 11)),
                      ],
                    ),
                  ),
                  Switch(
                    value: _isAnonymous,
                    onChanged: (v) => setState(() => _isAnonymous = v),
                    activeThumbColor: AppTheme.primary,
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
