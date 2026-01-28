import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import '../data/potato_provider.dart';

class GamesLobbyScreen extends ConsumerWidget {
  const GamesLobbyScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text('Juegos y Gamificación', style: TextStyle(fontWeight: FontWeight.bold)),
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: Colors.blue[900],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildGameCard(
            context,
            title: 'Ligas y Ranking',
            subtitle: 'Mira tu progreso y compite con otros',
            icon: LucideIcons.trophy,
            color: Colors.amber,
            onTap: () => context.push('/dashboard/leagues'),
          ),
          const SizedBox(height: 16),
          _buildGameCard(
            context,
            title: 'Papa Caliente',
            subtitle: '¡No te quedes con la bomba! Juego multijugador',
            icon: LucideIcons.bomb,
            color: Colors.redAccent,
            onTap: () => _showPotatoDialog(context, ref),
          ),
        ],
      ),
    );
  }

  Widget _buildGameCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      elevation: 2,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(16)),
                child: Icon(icon, color: color, size: 32),
              ),
              const SizedBox(width: 20),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    Text(subtitle, style: TextStyle(color: Colors.grey[600], fontSize: 13)),
                  ],
                ),
              ),
              const Icon(LucideIcons.chevronRight, color: Colors.grey),
            ],
          ),
        ),
      ),
    );
  }

  void _showPotatoDialog(BuildContext context, WidgetRef ref) {
    final codeController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Papa Caliente'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ElevatedButton(
              onPressed: () async {
                final room = await ref.read(potatoRepositoryProvider).createRoom();
                context.pop();
                context.push('/dashboard/games/potato/${room.id}');
              },
              style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 50)),
              child: const Text('Crear Sala Nueva'),
            ),
            const SizedBox(height: 16),
            const Text('O únete con un código:'),
            TextField(
              controller: codeController,
              decoration: const InputDecoration(hintText: 'CÓDIGO'),
              textAlign: TextAlign.center,
              textCapitalization: TextCapitalization.characters,
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => context.pop(), child: const Text('Cancelar')),
          ElevatedButton(
            onPressed: () async {
              try {
                final roomId = await ref.read(potatoRepositoryProvider).joinRoom(codeController.text.toUpperCase());
                context.pop();
                context.push('/dashboard/games/potato/$roomId');
              } catch (e) {
                ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
              }
            },
            child: const Text('Unirme'),
          ),
        ],
      ),
    );
  }
}
