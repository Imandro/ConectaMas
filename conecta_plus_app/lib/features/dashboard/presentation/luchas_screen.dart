import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../config/theme.dart';
import '../data/struggle_provider.dart';
import '../data/models/struggle_model.dart';

class LuchasScreen extends ConsumerStatefulWidget {
  const LuchasScreen({super.key});

  @override
  ConsumerState<LuchasScreen> createState() => _LuchasScreenState();
}

class _LuchasScreenState extends ConsumerState<LuchasScreen> {
  bool _isAdding = false;
  final TextEditingController _titleController = TextEditingController();

  @override
  void dispose() {
    _titleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final struggleState = ref.watch(struggleProvider);
    final notifier = ref.read(struggleProvider.notifier);

    final availableStruggles = struggleState.struggles.where((s) => s.status == StruggleStatus.active && !s.isStarted).toList();
    final activeStruggles = struggleState.struggles.where((s) => s.status == StruggleStatus.active && s.isStarted).toList();
    final overcomeStruggles = struggleState.struggles.where((s) => s.status == StruggleStatus.vencido).toList();

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
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Mi Seguimiento 🛡️',
              style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: AppTheme.primary, fontSize: 18),
            ),
            Text(
              'Gestiona tus planes de transformación.',
              style: TextStyle(color: AppTheme.textMuted, fontSize: 12),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: AppTheme.primary),
            onPressed: () => ref.read(struggleProvider.notifier).refresh(),
          ),
        ],
      ),
      body: struggleState.isLoading && struggleState.struggles.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: () => ref.read(struggleProvider.notifier).refresh(),
              child: ListView(
                padding: const EdgeInsets.all(24),
                children: [
                  if (struggleState.error != null)
                    Container(
                      padding: const EdgeInsets.all(12),
                      margin: const EdgeInsets.only(bottom: 16),
                      decoration: BoxDecoration(
                        color: Colors.red.shade50,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.red.shade200),
                      ),
                      child: Text(
                        struggleState.error!,
                        style: TextStyle(color: Colors.red.shade700),
                      ),
                    ),
                  _buildAddStruggleCard(notifier),
                  const SizedBox(height: 32),
                  
                  if (activeStruggles.isNotEmpty) ...[
                    _buildSectionHeader('En Progreso (${activeStruggles.length})'),
                    ...activeStruggles.map((s) => _buildStruggleCard(context, s)),
                    const SizedBox(height: 24),
                  ],

                  _buildSectionHeader('Planes Disponibles (${availableStruggles.length})'),
                  if (availableStruggles.isEmpty && !struggleState.isLoading)
                    _buildEmptyState('No hay planes nuevos disponibles.')
                  else
                    ...availableStruggles.map((s) => _buildStruggleCard(context, s)),

                  if (overcomeStruggles.isNotEmpty) ...[
                    const SizedBox(height: 32),
                    _buildSectionHeader('Salón de Victorias'),
                    ...overcomeStruggles.map((s) => _buildVictoryCard(s.title)),
                  ],
                ],
              ),
            ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16, left: 4),
      child: Text(
        title.toUpperCase(),
        style: GoogleFonts.inter(
          fontSize: 12,
          fontWeight: FontWeight.w900,
          color: AppTheme.textMuted,
          letterSpacing: 1,
        ),
      ),
    );
  }

  Widget _buildEmptyState(String message) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.grey.withValues(alpha: 0.2), style: BorderStyle.none),
      ),
      child: Center(
        child: Text(
          message,
          style: TextStyle(color: AppTheme.textMuted, fontSize: 12, fontStyle: FontStyle.italic),
        ),
      ),
    );
  }

  Widget _buildAddStruggleCard(StruggleNotifier notifier) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10)],
          ),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('¿Nueva batalla?', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    Text('Agrega un área para trabajar hoy.', style: TextStyle(color: AppTheme.textMuted, fontSize: 12)),
                  ],
                ),
              ),
              GestureDetector(
                onTap: () => setState(() => _isAdding = !_isAdding),
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: AppTheme.primary, shape: BoxShape.circle),
                  child: Icon(_isAdding ? Icons.close : Icons.add, color: Colors.white),
                ),
              ),
            ],
          ),
        ),
        if (_isAdding) ...[
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: AppTheme.primary.withValues(alpha: 0.2)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _titleController,
                    decoration: const InputDecoration(
                      hintText: 'Nueva área a trabajar...',
                      border: InputBorder.none,
                      hintStyle: TextStyle(fontSize: 14),
                    ),
                  ),
                ),
                TextButton(
                  onPressed: () {
                    if (_titleController.text.isNotEmpty) {
                      notifier.addStruggle(_titleController.text);
                      _titleController.clear();
                      setState(() => _isAdding = false);
                    }
                  },
                  child: const Text('Agregar', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primary)),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildStruggleCard(BuildContext context, Struggle struggle) {
    final bool isAvailable = !struggle.isStarted;
    
    return GestureDetector(
      onTap: () => context.push('/dashboard/luchas/${struggle.id}'),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border(
            left: BorderSide(
              color: isAvailable ? AppTheme.accent : AppTheme.primary,
              width: 5,
            ),
          ),
          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 10)],
        ),
        child: Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(struggle.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: isAvailable ? AppTheme.accent.withValues(alpha: 0.1) : AppTheme.primary.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              isAvailable ? 'Plan por iniciar' : 'Día ${struggle.currentDay} / 7',
                              style: TextStyle(
                                color: isAvailable ? const Color(0xFFB45309) : AppTheme.primary,
                                fontWeight: FontWeight.bold,
                                fontSize: 10,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text('Ver apartado', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                        ],
                      ),
                    ],
                  ),
                ),
                Icon(Icons.chevron_right, color: AppTheme.textMuted),
              ],
            ),
            if (!isAvailable) ...[
              const SizedBox(height: 16),
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: LinearProgressIndicator(
                  value: struggle.progress,
                  backgroundColor: Colors.grey.shade100,
                  color: AppTheme.primary,
                  minHeight: 6,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildVictoryCard(String title) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFD1FAE5),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.green.withValues(alpha: 0.1)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: const BoxDecoration(color: Colors.green, shape: BoxShape.circle),
            child: const Icon(Icons.emoji_events, color: Colors.white, size: 16),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.green)),
                Text('Vencido con éxito', style: TextStyle(color: Colors.green.withValues(alpha: 0.7), fontSize: 11)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
