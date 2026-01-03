import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../config/theme.dart';
import '../data/struggle_provider.dart';
import '../data/models/struggle_model.dart';

class StruggleDetailScreen extends ConsumerStatefulWidget {
  final String struggleId;
  const StruggleDetailScreen({super.key, required this.struggleId});

  @override
  ConsumerState<StruggleDetailScreen> createState() => _StruggleDetailScreenState();
}

class _StruggleDetailScreenState extends ConsumerState<StruggleDetailScreen> {
  int _selectedDay = 1;

  @override
  Widget build(BuildContext context) {
    final struggleState = ref.watch(struggleProvider);
    final struggle = struggleState.struggles.firstWhere(
      (s) => s.id == widget.struggleId,
      orElse: () => Struggle(id: '', title: '', description: ''),
    );

    if (struggle.id.isEmpty) {
      return const Scaffold(body: Center(child: Text('Plan no encontrado')));
    }

    final currentDayContent = struggle.days.isNotEmpty 
        ? struggle.days.firstWhere((d) => d.dayNumber == _selectedDay, orElse: () => struggle.days.first)
        : null;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: CustomScrollView(
        slivers: [
          _buildSliverAppBar(struggle),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: _buildContent(struggle, currentDayContent),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSliverAppBar(Struggle struggle) {
    return SliverAppBar(
      expandedHeight: 320,
      pinned: true,
      backgroundColor: AppTheme.primary,
      leading: Padding(
        padding: const EdgeInsets.all(8.0),
        child: CircleAvatar(
          backgroundColor: Colors.white.withValues(alpha: 0.1),
          child: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () => context.pop(),
          ),
        ),
      ),
      flexibleSpace: FlexibleSpaceBar(
        background: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
            ),
          ),
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(color: AppTheme.primary, borderRadius: BorderRadius.circular(16)),
                    child: const Icon(Icons.local_fire_department, color: AppTheme.accent, size: 32),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(struggle.title, style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                        Text(struggle.description, style: const TextStyle(color: Colors.white60, fontSize: 13), maxLines: 2, overflow: TextOverflow.ellipsis),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              // Day Timeline
              SizedBox(
                height: 70,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  itemCount: 21,
                  separatorBuilder: (context, index) => const SizedBox(width: 12),
                  itemBuilder: (context, index) {
                    final dayNum = index + 1;
                    final isCompleted = struggle.completedDays.contains(dayNum);
                    final isSelected = _selectedDay == dayNum;

                    return GestureDetector(
                      onTap: () => setState(() => _selectedDay = dayNum),
                      child: Container(
                        width: 50,
                        decoration: BoxDecoration(
                          color: isCompleted
                              ? const Color(0xFF22C55E)
                              : (isSelected
                                  ? AppTheme.primary
                                  : const Color(0xFF334155)),
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: isSelected
                              ? [
                                  BoxShadow(
                                      color: AppTheme.primary
                                          .withValues(alpha: 0.4),
                                      blurRadius: 10)
                                ]
                              : null,
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            if (isCompleted)
                              const Icon(Icons.check_circle,
                                  color: Colors.white, size: 24)
                            else
                              Text('$dayNum',
                                  style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 18,
                                      fontWeight: FontWeight.w900,
                                      height: 1.0)),
                            const Text('DÍA',
                                style: TextStyle(
                                    color: Colors.white54,
                                    fontSize: 9,
                                    fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildContent(Struggle struggle, StruggleDay? day) {
    if (day == null) return const Center(child: Text('Cargando contenido...'));

    final isDayCompleted = struggle.completedDays.contains(_selectedDay);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Day Header Card
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            border: const Border(left: BorderSide(color: AppTheme.primary, width: 8)),
            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10)],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('DÍA $_selectedDay: ${day.title}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
              const SizedBox(height: 12),
              Text(
                '"${day.scripture}"',
                style: const TextStyle(color: AppTheme.primary, fontWeight: FontWeight.bold, fontSize: 16, fontStyle: FontStyle.italic),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Tactical Study
        _buildInfoBlock(
          icon: Icons.menu_book,
          title: 'Estudio Táctico',
          content: day.bibleStudy,
          bgColor: Colors.white,
        ),
        const SizedBox(height: 24),

        // Mission & Advice Row
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: _buildInfoBlock(
                icon: Icons.lightbulb,
                title: 'TU MISIÓN',
                content: day.practicalExercise,
                bgColor: const Color(0xFFFEF3C7),
                textColor: const Color(0xFF92400E),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildInfoBlock(
                icon: Icons.chat_bubble_outline,
                title: 'CONSEJO PRO',
                content: day.youthAdvice,
                bgColor: const Color(0xFFE0F2FE),
                textColor: const Color(0xFF075985),
              ),
            ),
          ],
        ),
        const SizedBox(height: 24),

        // Reflection questions
        _buildInfoBlock(
          icon: Icons.calendar_today,
          title: 'MOMENTO DE REFLEXIÓN',
          content: day.reflectionQuestions,
          bgColor: const Color(0xFFDCFCE7),
          textColor: const Color(0xFF166534),
        ),
        const SizedBox(height: 48),

        // Action Button
        if (!struggle.isStarted)
          SizedBox(
            width: double.infinity,
            height: 64,
            child: ElevatedButton(
              onPressed: () => ref.read(struggleProvider.notifier).startStruggle(struggle.id),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primary,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                elevation: 8,
              ),
              child: const Text('INICIAR PLAN', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.white)),
            ),
          )
        else
          SizedBox(
            width: double.infinity,
            height: 64,
            child: ElevatedButton(
              onPressed: isDayCompleted ? null : () => ref.read(struggleProvider.notifier).completeDay(struggle.id, _selectedDay),
              style: ElevatedButton.styleFrom(
                backgroundColor: isDayCompleted ? Colors.grey : AppTheme.primary,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                elevation: isDayCompleted ? 0 : 8,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    isDayCompleted ? 'DÍA COMPLETADO' : 'COMPLETAR DÍA $_selectedDay',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.white),
                  ),
                  if (!isDayCompleted) ...[
                    const SizedBox(width: 12),
                    const Icon(Icons.chevron_right, color: Colors.white),
                  ],
                ],
              ),
            ),
          ),
        const SizedBox(height: 16),
        if (struggle.isStarted)
          Center(
            child: TextButton.icon(
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('¿Reiniciar plan?'),
                    content: const Text('Esto borrará tu progreso actual en este plan.'),
                    actions: [
                      TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancelar')),
                      TextButton(
                        onPressed: () {
                          ref.read(struggleProvider.notifier).resetStruggle(struggle.id);
                          Navigator.pop(context);
                        },
                        child: const Text('Reiniciar', style: TextStyle(color: Colors.red)),
                      ),
                    ],
                  ),
                );
              },
              icon: const Icon(Icons.refresh, color: AppTheme.textMuted),
              label: const Text('REINICIAR PLAN', style: TextStyle(color: AppTheme.textMuted, fontWeight: FontWeight.bold)),
            ),
          ),
        const SizedBox(height: 40),
      ],
    );
  }

  Widget _buildInfoBlock({required IconData icon, required String title, required String content, required Color bgColor, Color? textColor}) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 10)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: textColor ?? AppTheme.primary, size: 24),
              const SizedBox(width: 12),
              Text(title, style: TextStyle(fontWeight: FontWeight.w900, color: textColor ?? AppTheme.primary, fontSize: 12, letterSpacing: 0.5)),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            content,
            style: TextStyle(color: textColor?.withValues(alpha: 0.8) ?? AppTheme.textMuted, fontSize: 15, height: 1.6, fontWeight: FontWeight.normal),
          ),
        ],
      ),
    );
  }
}
