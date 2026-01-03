import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../config/theme.dart';

class CommunityPostDetailScreen extends StatelessWidget {
  final String postId;
  const CommunityPostDetailScreen({super.key, required this.postId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: Padding(
          padding: const EdgeInsets.all(8.0),
          child: CircleAvatar(
            backgroundColor: Colors.grey.shade100,
            child: IconButton(
              icon: const Icon(Icons.arrow_back, color: AppTheme.primary),
              onPressed: () => context.pop(),
            ),
          ),
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Oración por mi familia', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: AppTheme.primary, height: 1.2)),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      const CircleAvatar(radius: 12, backgroundColor: Colors.grey, child: Icon(Icons.person, size: 14, color: Colors.white)),
                      const SizedBox(width: 8),
                      const Text('Anónimo', style: TextStyle(color: Colors.grey, fontSize: 13, fontWeight: FontWeight.bold)),
                      const SizedBox(width: 12),
                      const Text('•', style: TextStyle(color: Colors.grey)),
                      const SizedBox(width: 12),
                      const Text('Hace 2h', style: TextStyle(color: Colors.grey, fontSize: 13)),
                    ],
                  ),
                  const SizedBox(height: 32),
                  const Text(
                    'Estamos pasando por un momento difícil económicamente y pido sus oraciones para que Dios provea un nuevo empleo para mi esposo. Confiamos en que Dios tiene el control pero a veces el miedo nos invade. Gracias por sus oraciones.',
                    style: TextStyle(fontSize: 16, height: 1.6, color: Colors.black87),
                  ),
                  const SizedBox(height: 40),
                  const Divider(),
                  const SizedBox(height: 24),
                  const Text('Respuestas (3)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                  const SizedBox(height: 24),
                  _buildComment('María R.', 'Estaremos orando por ustedes. Dios es fiel y Él abrirá puertas donde parece que no las hay.', 'Hace 1h', isCounselor: true),
                  _buildComment('Carlos G.', '¡Ánimo! El Salmo 23 nos recuerda que nada nos faltará.', 'Hace 45m'),
                  _buildComment('Leticia S.', 'Me uno en oración por tu familia. ¡Dios proveerá!', 'Hace 10m'),
                ],
              ),
            ),
          ),
          
          // Comment input
          Container(
            padding: const EdgeInsets.only(left: 24, right: 12, top: 12, bottom: 24),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, -5))],
            ),
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(30)),
                    child: const TextField(
                      decoration: InputDecoration(hintText: 'Escribe una respuesta...', border: InputBorder.none, hintStyle: TextStyle(fontSize: 14)),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                CircleAvatar(
                  backgroundColor: AppTheme.primary,
                  child: IconButton(icon: const Icon(Icons.send, color: Colors.white, size: 20), onPressed: () {}),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildComment(String author, String content, String time, {bool isCounselor = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(author, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              if (isCounselor) ...[
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(color: Colors.green.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(4)),
                  child: const Row(
                    children: [
                      Icon(Icons.verified, size: 10, color: Colors.green),
                      SizedBox(width: 4),
                      Text('CONSEJERO', style: TextStyle(color: Colors.green, fontSize: 8, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              ],
              const Spacer(),
              Text(time, style: const TextStyle(color: Colors.grey, fontSize: 11)),
            ],
          ),
          const SizedBox(height: 8),
          Text(content, style: const TextStyle(color: Colors.black87, fontSize: 14, height: 1.4)),
        ],
      ),
    );
  }
}
