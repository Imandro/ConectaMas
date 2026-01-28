import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/prayer_provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:timeago/timeago.dart' as timeago;

class PrayerWallScreen extends ConsumerStatefulWidget {
  const PrayerWallScreen({super.key});

  @override
  ConsumerState<PrayerWallScreen> createState() => _PrayerWallScreenState();
}

class _PrayerWallScreenState extends ConsumerState<PrayerWallScreen> {
  final _contentController = TextEditingController();
  bool _isAnonymous = false;
  bool _isPosting = false;

  @override
  Widget build(BuildContext context) {
    final prayersAsync = ref.watch(globalPrayersProvider);

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text('Muro de Oración',
            style: TextStyle(fontWeight: FontWeight.bold)),
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: Colors.blue[900],
      ),
      body: Column(
        children: [
          _buildInputSection(),
          Expanded(
            child: prayersAsync.when(
              data: (prayers) => RefreshIndicator(
                onRefresh: () =>
                    ref.read(globalPrayersProvider.notifier).fetchPrayers(),
                child: ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: prayers.length,
                  itemBuilder: (context, index) =>
                      _buildPrayerCard(prayers[index]),
                ),
              ),
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, stack) => Center(child: Text('Error: $err')),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInputSection() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: Colors.grey[200]!)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          TextField(
            controller: _contentController,
            maxLines: 3,
            decoration: InputDecoration(
              hintText: '¿Por qué necesitas oración hoy?',
              border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide.none),
              filled: true,
              fillColor: Colors.grey[100],
            ),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Switch(
                    value: _isAnonymous,
                    onChanged: (v) => setState(() => _isAnonymous = v),
                  ),
                  const Text('Anónimo', style: TextStyle(fontSize: 12)),
                ],
              ),
              ElevatedButton.icon(
                onPressed: _isPosting ? null : _handlePost,
                icon: const Icon(LucideIcons.send, size: 18),
                label: const Text('Publicar'),
                style: ElevatedButton.styleFrom(
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Future<void> _handlePost() async {
    if (_contentController.text.trim().isEmpty) return;
    setState(() => _isPosting = true);
    try {
      await ref.read(globalPrayersProvider.notifier).createRequest(
            _contentController.text.trim(),
            _isAnonymous,
          );
      _contentController.clear();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Pedido publicado. ¡Estamos orando!')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    } finally {
      setState(() => _isPosting = false);
    }
  }

  Widget _buildPrayerCard(dynamic prayer) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 0,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 16,
                  backgroundColor:
                      prayer.isAnonymous ? Colors.grey[300] : Colors.blue[100],
                  child: Icon(
                      prayer.isAnonymous
                          ? LucideIcons.shield
                          : LucideIcons.user,
                      size: 16),
                ),
                const SizedBox(width: 12),
                Text(
                  prayer.isAnonymous
                      ? 'Guerrero de Oración'
                      : (prayer.user['name'] ?? 'Usuario'),
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                const Spacer(),
                Text(
                  timeago.format(prayer.createdAt, locale: 'es'),
                  style: TextStyle(color: Colors.grey[500], fontSize: 12),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              prayer.content,
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(LucideIcons.heart, size: 14, color: Colors.red),
                    const SizedBox(width: 4),
                    Text('${prayer.prayCount} orando',
                        style:
                            TextStyle(color: Colors.grey[600], fontSize: 12)),
                  ],
                ),
                TextButton.icon(
                  onPressed: () => ref
                      .read(globalPrayersProvider.notifier)
                      .prayFor(prayer.id),
                  icon: const Icon(LucideIcons.helpingHand, size: 18),
                  label: const Text('Oar'),
                  style: TextButton.styleFrom(foregroundColor: Colors.blue),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
