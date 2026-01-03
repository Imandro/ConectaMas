import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../config/theme.dart';

class NewPostScreen extends StatefulWidget {
  const NewPostScreen({super.key});

  @override
  State<NewPostScreen> createState() => _NewPostScreenState();
}

class _NewPostScreenState extends State<NewPostScreen> {
  bool _isAnonymous = false;
  String? _selectedCategoryId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close, color: AppTheme.primary),
          onPressed: () => context.pop(),
        ),
        title: const Text('Nueva Publicación', style: TextStyle(color: AppTheme.primary, fontWeight: FontWeight.bold)),
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            child: ElevatedButton(
              onPressed: () => context.pop(),
              style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primary, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20))),
              child: const Text('Publicar', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
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
            const Text('¿En qué categoría quieres publicar?', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(16)),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  hint: const Text('Selecciona una categoría'),
                  isExpanded: true,
                  value: _selectedCategoryId,
                  items: const [
                    DropdownMenuItem(value: '1', child: Text('🙏 Peticiones de Oración')),
                    DropdownMenuItem(value: '2', child: Text('📖 Estudio Bíblico')),
                    DropdownMenuItem(value: '3', child: Text('✨ Testimonios')),
                    DropdownMenuItem(value: '4', child: Text('💡 Preguntas y Dudas')),
                  ],
                  onChanged: (v) => setState(() => _selectedCategoryId = v),
                ),
              ),
            ),
            const SizedBox(height: 32),

            // Title
            const Text('Título', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.textMuted)),
            const TextField(
              decoration: InputDecoration(
                hintText: 'Ej: Oración por fortaleza',
                border: UnderlineInputBorder(),
              ),
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 32),

            // Content
            const Text('Contenido', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.textMuted)),
            const TextField(
              decoration: InputDecoration(
                hintText: 'Cuéntanos lo que tienes en el corazón...',
                border: InputBorder.none,
              ),
              maxLines: 8,
            ),
            const SizedBox(height: 32),

            // Anonymous Switch
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(24)),
              child: Row(
                children: [
                  const Icon(Icons.visibility_off, color: AppTheme.primary),
                  const SizedBox(width: 16),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Publicar de forma anónima', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                        Text('Tu nombre no será visible para los demás.', style: TextStyle(color: Colors.grey, fontSize: 11)),
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
