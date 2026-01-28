import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../config/theme.dart';
import '../../auth/data/auth_provider.dart';
import '../data/groups_provider.dart';

class CreateGroupScreen extends ConsumerStatefulWidget {
  final bool isLeader;
  const CreateGroupScreen({super.key, required this.isLeader});

  @override
  ConsumerState<CreateGroupScreen> createState() => _CreateGroupScreenState();
}

class _CreateGroupScreenState extends ConsumerState<CreateGroupScreen> {
  // Survey Controllers
  final _fullNameCtrl = TextEditingController();
  final _docIdCtrl = TextEditingController();
  final _addressCtrl = TextEditingController();
  final _maritalStatusCtrl = TextEditingController();
  final _testimonyCtrl = TextEditingController();
  final _motivationCtrl = TextEditingController();
  
  // Group Create Controllers
  final _groupNameCtrl = TextEditingController();
  final _mottoCtrl = TextEditingController();
  
  int _step = 0;
  bool _isLoading = false;
  late bool _isLeaderView;

  @override
  void initState() {
    super.initState();
    _isLeaderView = widget.isLeader;
  }

  Future<void> _submitSurvey() async {
    final user = ref.read(authProvider).user;
    if (user == null) return;

    if (_fullNameCtrl.text.isEmpty || _testimonyCtrl.text.isEmpty) return;

    setState(() => _isLoading = true);
    
    final success = await ref.read(groupsProvider.notifier).submitLeaderApplication(
      user.id,
      {
        'fullName': _fullNameCtrl.text,
        'documentId': _docIdCtrl.text,
        'birthDate': DateTime(1990), // Mocked for simplicity
        'address': _addressCtrl.text,
        'maritalStatus': _maritalStatusCtrl.text,
        'testimony': _testimonyCtrl.text,
        'motivation': _motivationCtrl.text,
      }
    );
    
    setState(() => _isLoading = false);
    
    if (success && mounted) {
       ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('¡Solicitud Aprobada! Ahora puedes crear tu grupo.')));
       // Refresh user profile to get new role
       await ref.read(authProvider.notifier).refreshProfile();
       setState(() {
         _isLeaderView = true;
       });
    }
  }

  Future<void> _createGroup() async {
    final user = ref.read(authProvider).user;
    if (user == null) return;
    
    if (_groupNameCtrl.text.isEmpty) return;
    
    setState(() => _isLoading = true);
    
    final success = await ref.read(groupsProvider.notifier).createGroup(
      user.id, 
      _groupNameCtrl.text, 
      _mottoCtrl.text
    );
    setState(() => _isLoading = false);
    
    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Grupo creado exitosamente')));
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(_isLeaderView ? 'Crear Grupo' : 'Ser Líder')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: _isLeaderView ? _buildCreateGroupForm() : _buildSurveyForm(),
      ),
    );
  }

  Widget _buildSurveyForm() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text('Solicitud de Liderazgo', style: GoogleFonts.fredoka(fontSize: 24, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        const Text('Completa este formulario para convertirte en líder de grupo.'),
        const SizedBox(height: 24),
        
        TextField(controller: _fullNameCtrl, decoration: const InputDecoration(labelText: 'Nombre Completo', border: OutlineInputBorder())),
        const SizedBox(height: 16),
        TextField(controller: _docIdCtrl, decoration: const InputDecoration(labelText: 'DNI / Identificación', border: OutlineInputBorder())),
        const SizedBox(height: 16),
        TextField(controller: _addressCtrl, decoration: const InputDecoration(labelText: 'Dirección', border: OutlineInputBorder())),
        const SizedBox(height: 16),
        TextField(controller: _maritalStatusCtrl, decoration: const InputDecoration(labelText: 'Estado Civil', border: OutlineInputBorder())),
        const SizedBox(height: 16),
        TextField(controller: _testimonyCtrl, maxLines: 3, decoration: const InputDecoration(labelText: 'Tu Testimonio Breve', border: OutlineInputBorder())),
        const SizedBox(height: 16),
        TextField(controller: _motivationCtrl, maxLines: 2, decoration: const InputDecoration(labelText: '¿Por qué quieres ser líder?', border: OutlineInputBorder())),
        const SizedBox(height: 32),
        
        ElevatedButton(
          onPressed: _isLoading ? null : _submitSurvey,
          style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primary, padding: const EdgeInsets.all(16)),
          child: _isLoading ? const CircularProgressIndicator(color: Colors.white) : const Text('Enviar Solicitud', style: TextStyle(color: Colors.white)),
        )
      ],
    );
  }

  Widget _buildCreateGroupForm() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text('Nuevo Grupo', style: GoogleFonts.fredoka(fontSize: 24, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        const Text('Nombra tu grupo y asígnale un lema inspirador.'),
        const SizedBox(height: 24),
        
        TextField(controller: _groupNameCtrl, decoration: const InputDecoration(labelText: 'Nombre del Grupo', border: OutlineInputBorder())),
        const SizedBox(height: 16),
        TextField(controller: _mottoCtrl, decoration: const InputDecoration(labelText: 'Lema (Opcional)', border: OutlineInputBorder())),
        const SizedBox(height: 32),
         ElevatedButton(
          onPressed: _isLoading ? null : _createGroup,
          style: ElevatedButton.styleFrom(backgroundColor: Colors.green, padding: const EdgeInsets.all(16)),
          child: _isLoading ? const CircularProgressIndicator(color: Colors.white) : const Text('Crear Grupo', style: TextStyle(color: Colors.white)),
        )
      ],
    );
  }
}
