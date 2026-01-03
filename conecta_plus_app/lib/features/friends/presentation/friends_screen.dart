import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../config/theme.dart';

class FriendsScreen extends StatelessWidget {
  const FriendsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text('Comunidad Conecta+ BETA', style: TextStyle(color: AppTheme.primary, fontWeight: FontWeight.bold)),
        leading: IconButton(icon: const Icon(Icons.arrow_back, color: AppTheme.primary), onPressed: () => context.pop()),
      ),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          // Search Box
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(30), border: Border.all(color: AppTheme.primary.withValues(alpha: 0.1), width: 2)),
            child: const TextField(
              decoration: InputDecoration(hintText: 'Buscar amigos o @usuario...', border: InputBorder.none, icon: Icon(Icons.search, color: AppTheme.primary)),
            ),
          ),
          const SizedBox(height: 32),

          _buildSectionHeader('Mensajes de Apoyo Recientes'),
          const SizedBox(height: 16),
          SizedBox(
            height: 140,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                _buildMessageCard('Ana García', '¡Estoy orando por ti! 🙏', true),
                _buildMessageCard('Pedro López', '¡Sigue adelante, Dios está contigo! 💪', false),
              ],
            ),
          ),
          const SizedBox(height: 32),

          _buildSectionHeader('Mis Amigos (5)'),
          const SizedBox(height: 16),
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            childAspectRatio: 0.8,
            children: [
              _buildFriendCard('Ana García', '@anita', 'Explorador'),
              _buildFriendCard('Pedro López', '@pedro', 'Guerrero'),
              _buildFriendCard('Juan Pérez', '@juanpi', 'Líder'),
              _buildFriendCard('Marta Ruiz', '@marta', 'Explorador'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppTheme.primary));
  }

  Widget _buildMessageCard(String name, String msg, bool isNew) {
    return Container(
      width: 260,
      margin: const EdgeInsets.only(right: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), border: isNew ? Border.all(color: AppTheme.primary, width: 2) : null, boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10)]),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const CircleAvatar(radius: 12, backgroundColor: AppTheme.primary, child: Text('A', style: TextStyle(color: Colors.white, fontSize: 10))),
              const SizedBox(width: 8),
              Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
            ],
          ),
          const SizedBox(height: 12),
          Text('"$msg"', style: const TextStyle(fontStyle: FontStyle.italic, color: AppTheme.primary, fontSize: 13)),
        ],
      ),
    );
  }

  Widget _buildFriendCard(String name, String username, String level) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10)]),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const CircleAvatar(radius: 30, backgroundColor: Color(0xFFF1F5F9), child: Icon(Icons.person, color: AppTheme.primary, size: 30)),
          const SizedBox(height: 12),
          Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          Text(username, style: const TextStyle(color: Colors.grey, fontSize: 11)),
          const SizedBox(height: 12),
          Container(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4), decoration: BoxDecoration(color: AppTheme.primary.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(20)), child: Text(level, style: const TextStyle(color: AppTheme.primary, fontWeight: FontWeight.bold, fontSize: 9))),
        ],
      ),
    );
  }
}
