import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../config/theme.dart';
import '../../auth/data/auth_provider.dart';
import '../data/groups_provider.dart';
import '../data/models/group_model.dart';

class GroupDetailScreen extends ConsumerStatefulWidget {
  final String groupId;
  const GroupDetailScreen({super.key, required this.groupId});

  @override
  ConsumerState<GroupDetailScreen> createState() => _GroupDetailScreenState();
}

class _GroupDetailScreenState extends ConsumerState<GroupDetailScreen> {
  final TextEditingController _needController = TextEditingController();
  bool _isAnonymous = true;

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      final userId = ref.read(authProvider).user?.id;
      if (userId != null) {
        ref.read(groupsProvider.notifier).loadGroupDetails(widget.groupId, userId);
      }
    });
  }

  void _showNeedModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => Padding(
          padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom, left: 24, right: 24, top: 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Compartir Necesidad', style: GoogleFonts.fredoka(fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              const Text('Tu necesidad solo será visible para el líder del grupo.', style: TextStyle(color: Colors.grey)),
              const SizedBox(height: 16),
              TextField(
                controller: _needController,
                maxLines: 4,
                decoration: InputDecoration(
                  hintText: '¿En qué podemos apoyarte?',
                  filled: true,
                  fillColor: Colors.grey[100],
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 16),
              SwitchListTile(
                title: const Text('Compartir de forma anónima', style: TextStyle(fontSize: 14)),
                value: _isAnonymous,
                onChanged: (val) => setModalState(() => _isAnonymous = val),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () async {
                  if (_needController.text.isEmpty) return;
                  final userId = ref.read(authProvider).user?.id;
                  if (userId != null) {
                    final success = await ref.read(groupsProvider.notifier).submitNeed(widget.groupId, userId, _needController.text, _isAnonymous);
                    if (success) {
                      Navigator.pop(context);
                      _needController.clear();
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Necesidad enviada')));
                    }
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primary,
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
                ),
                child: const Text('Enviar al Líder', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(groupsProvider);
    final user = ref.watch(authProvider).user;
    final group = state.currentGroup;

    if (state.isLoading && group == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    
    if (group == null) {
      return const Scaffold(body: Center(child: Text('Grupo no encontrado')));
    }

    final isLeader = group.leaderId == user?.id;
    final completedTasks = state.currentTasks.where((t) => t['isCompleted'] == 1).length;
    final progress = state.currentTasks.isNotEmpty ? completedTasks / state.currentTasks.length : 0.0;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(group.name, style: GoogleFonts.fredoka(color: Colors.white)),
        backgroundColor: AppTheme.primary,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
        actions: [
          IconButton(
            icon: const Icon(Icons.share), 
            onPressed: () {
               if (group.accessCode != null) {
                 Clipboard.setData(ClipboardData(text: group.accessCode!));
                 ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Código copiado')));
               }
            }
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => ref.read(groupsProvider.notifier).loadGroupDetails(widget.groupId, user!.id),
        child: SingleChildScrollView(
           physics: const AlwaysScrollableScrollPhysics(),
           child: Column(
             crossAxisAlignment: CrossAxisAlignment.stretch,
             children: [
               // Header
               Container(
                 padding: const EdgeInsets.all(24),
                 color: AppTheme.primary,
                 child: Column(
                   children: [
                     CircleAvatar(
                       radius: 40,
                       backgroundColor: Colors.white,
                       child: Text(group.name[0].toUpperCase(), style: GoogleFonts.fredoka(fontSize: 40, color: AppTheme.primary, fontWeight: FontWeight.bold)),
                     ),
                     const SizedBox(height: 16),
                     Text(group.name, style: GoogleFonts.fredoka(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white)),
                     if (group.motto != null) 
                       Text('"${group.motto}"', style: const TextStyle(color: Colors.white70, fontStyle: FontStyle.italic)),
                     const SizedBox(height: 24),
                     Row(
                       mainAxisAlignment: MainAxisAlignment.center,
                       children: [
                         ElevatedButton.icon(
                           onPressed: () {}, 
                           icon: const Icon(Icons.copy, size: 16),
                           label: Text(group.accessCode ?? ''),
                           style: ElevatedButton.styleFrom(
                             backgroundColor: Colors.white,
                             foregroundColor: AppTheme.primary,
                             shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                           ),
                         ),
                         const SizedBox(width: 12),
                         OutlinedButton.icon(
                           onPressed: _showNeedModal,
                           icon: const Icon(Icons.message, size: 16),
                           label: const Text('Necesidad'),
                           style: OutlinedButton.styleFrom(
                             foregroundColor: Colors.white,
                             side: const BorderSide(color: Colors.white),
                             shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                           ),
                         ),
                       ],
                     )
                   ],
                 ),
               ),
               
               Padding(
                 padding: const EdgeInsets.all(20),
                 child: Column(
                   crossAxisAlignment: CrossAxisAlignment.start,
                   children: [
                     // Progress
                     Card(
                       shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                       child: Padding(
                         padding: const EdgeInsets.all(16),
                         child: Column(
                           children: [
                             Row(
                               mainAxisAlignment: MainAxisAlignment.spaceBetween,
                               children: [
                                 Text('Progreso Semanal', style: GoogleFonts.fredoka(fontWeight: FontWeight.bold)),
                                 Text('${(progress * 100).toInt()}%', style: const TextStyle(color: AppTheme.primary, fontWeight: FontWeight.bold)),
                               ],
                             ),
                             const SizedBox(height: 12),
                             LinearProgressIndicator(
                               value: progress,
                               backgroundColor: Colors.grey[200],
                               color: AppTheme.primary,
                               minHeight: 10,
                               borderRadius: BorderRadius.circular(5),
                             ),
                           ],
                         ),
                       ),
                     ),
                     
                     const SizedBox(height: 24),
                     Text('Metas de la Semana', style: GoogleFonts.fredoka(fontSize: 18, fontWeight: FontWeight.bold)),
                     const SizedBox(height: 12),
                     if (state.currentTasks.isEmpty)
                       Container(
                         padding: const EdgeInsets.all(32),
                         width: double.infinity,
                         decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
                         child: const Text('No hay metas asignadas', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey)),
                       )
                     else
                       ...state.currentTasks.map((t) {
                         final isDone = t['isCompleted'] == 1;
                         return Card(
                           margin: const EdgeInsets.only(bottom: 12),
                           shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                           child: ListTile(
                             leading: Icon(isDone ? Icons.check_circle : Icons.circle_outlined, color: isDone ? Colors.green : Colors.grey),
                             title: Text(t['title'] ?? '', style: TextStyle(decoration: isDone ? TextDecoration.lineThrough : null)),
                             subtitle: Text(t['type'] ?? ''),
                             trailing: !isDone ? TextButton(
                               onPressed: () => ref.read(groupsProvider.notifier).completeTask(widget.groupId, t['id'], user!.id),
                               child: const Text('Hecho'),
                             ) : null,
                           ),
                         );
                       }),

                     if (isLeader && state.currentNeeds.isNotEmpty) ...[
                       const SizedBox(height: 24),
                       Text('Necesidades Confidenciales', style: GoogleFonts.fredoka(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.secondary)),
                       const SizedBox(height: 12),
                       ...state.currentNeeds.map((n) => Card(
                         color: const Color(0xFFFFF7ED),
                         margin: const EdgeInsets.only(bottom: 12),
                         shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                         child: Padding(
                           padding: const EdgeInsets.all(16),
                           child: Column(
                             crossAxisAlignment: CrossAxisAlignment.start,
                             children: [
                               Row(
                                 children: [
                                   const Icon(Icons.lock, size: 14, color: Colors.orange),
                                   const SizedBox(width: 4),
                                   Text(n['isAnonymous'] ? 'Anónimo' : 'Miembro', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.orange)),
                                 ],
                               ),
                               const SizedBox(height: 8),
                               Text(n['content'] ?? '', style: const TextStyle(fontStyle: FontStyle.italic)),
                             ],
                           ),
                         ),
                       )),
                     ],

                     const SizedBox(height: 24),
                     Text('Miembros', style: GoogleFonts.fredoka(fontSize: 18, fontWeight: FontWeight.bold)),
                     const SizedBox(height: 12),
                     ...state.currentMembers.map((m) => ListTile(
                       contentPadding: EdgeInsets.zero,
                       leading: CircleAvatar(
                         backgroundImage: m.userImage != null ? NetworkImage(m.userImage!) : null,
                         child: m.userImage == null ? Text(m.userName?[0] ?? '?') : null,
                       ),
                       title: Text(m.userName ?? 'Usuario'),
                       subtitle: Text(m.role == 'ADMIN' ? 'Líder' : 'Miembro'),
                       trailing: m.role == 'ADMIN' ? const Icon(Icons.shield, size: 16, color: AppTheme.primary) : null,
                     )),
                   ],
                 ),
               )
             ],
           ),
        ),
      ),
    );
  }
}

