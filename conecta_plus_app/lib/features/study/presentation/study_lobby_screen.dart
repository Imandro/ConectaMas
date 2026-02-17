import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/study_provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import '../../../l10n/app_localizations.dart';

class StudyLobbyScreen extends ConsumerWidget {
  const StudyLobbyScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final roomsAsync = ref.watch(studyRoomsProvider);
    final l10n = AppLocalizations.of(context);

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: Text(l10n.studyTitle,
            style: const TextStyle(fontWeight: FontWeight.bold)),
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: Colors.blue[900],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showCreateRoomDialog(context, ref),
        child: const Icon(LucideIcons.plus),
      ),
      body: roomsAsync.when(
        data: (rooms) => RefreshIndicator(
          onRefresh: () => ref.read(studyRoomsProvider.notifier).fetchRooms(),
          child: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: rooms.length,
            itemBuilder: (context, index) =>
                _buildRoomCard(context, rooms[index]),
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('${l10n.errorLabel}: $err')),
      ),
    );
  }

  Widget _buildRoomCard(BuildContext context, dynamic room) {
    final l10n = AppLocalizations.of(context);
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        onTap: () => context.push('/dashboard/study/${room.id}'),
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                        color: Colors.blue[50],
                        borderRadius: BorderRadius.circular(8)),
                    child: Text(room.theme,
                        style: TextStyle(
                            color: Colors.blue[800],
                            fontSize: 10,
                            fontWeight: FontWeight.bold)),
                  ),
                  const Spacer(),
                  const Icon(LucideIcons.users, size: 14, color: Colors.grey),
                  const SizedBox(width: 4),
                  Text('${room.messageCount} msg',
                      style: const TextStyle(fontSize: 10, color: Colors.grey)),
                ],
              ),
              const SizedBox(height: 12),
              Text(room.title,
                  style: const TextStyle(
                      fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              Text(room.description,
                  style: TextStyle(color: Colors.grey[600], fontSize: 13)),
              const Divider(height: 24),
              Row(
                children: [
                  CircleAvatar(
                      radius: 12,
                      backgroundImage: room.host['image'] != null
                          ? NetworkImage(room.host['image'])
                          : null),
                  const SizedBox(width: 8),
                  Text(
                      '${l10n.hostLabel}: ${room.host['name'] ?? l10n.hostLabel}',
                      style: const TextStyle(
                          fontSize: 12, fontWeight: FontWeight.w500)),
                  const Spacer(),
                  Text(l10n.joinLabel,
                      style: const TextStyle(
                          color: Colors.blue, fontWeight: FontWeight.bold)),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showCreateRoomDialog(BuildContext context, WidgetRef ref) {
    final titleController = TextEditingController();
    final themeController = TextEditingController();
    final descController = TextEditingController();
    final l10n = AppLocalizations.of(context);

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(l10n.newStudyRoom),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
                controller: titleController,
                decoration: InputDecoration(hintText: l10n.titleLabel)),
            TextField(
                controller: themeController,
                decoration: InputDecoration(hintText: l10n.themePlaceholder)),
            TextField(
                controller: descController,
                decoration: InputDecoration(hintText: l10n.descriptionLabel)),
          ],
        ),
        actions: [
          TextButton(onPressed: () => context.pop(), child: Text(l10n.cancel)),
          ElevatedButton(
            onPressed: () async {
              await ref.read(studyRoomsProvider.notifier).createRoom(
                    titleController.text,
                    themeController.text,
                    descController.text,
                  );
              context.pop();
            },
            child: Text(l10n.create),
          ),
        ],
      ),
    );
  }
}
