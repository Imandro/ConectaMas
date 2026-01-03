import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:audioplayers/audioplayers.dart';
import '../../../config/theme.dart';

class SOSScreen extends StatefulWidget {
  const SOSScreen({super.key});

  @override
  State<SOSScreen> createState() => _SOSScreenState();
}

class _SOSScreenState extends State<SOSScreen> {
  String? _mode; // 'truths', 'music', 'prayer'
  String _currentPrayer = '';
  final List<String> _currentTruths = [];
  final AudioPlayer _audioPlayer = AudioPlayer();
  bool _isPlaying = false;

  final List<String> _emergencyPrayers = [
    "Padre Celestial, en este momento de angustia te necesito más que nunca. Siento que las fuerzas me abandonan, pero sé que Tú nunca me abandonas...",
    "Señor Jesús, siento que no puedo más con esta carga. Mi mente está agitada, mis emociones están desbordadas...",
    "Dios de amor infinito, en este momento tan difícil clamo a Ti con todo mi corazón. Calma la tormenta que hay en mi mente...",
    "Espíritu Santo, ven como consolador a mi corazón quebrantado. Necesito Tu guía divina en este momento de confusión...",
    "Padre Eterno, reconozco humildemente que sin Ti no puedo hacer absolutamente nada. Esta batalla es demasiado grande para mí..."
  ];

  final List<String> _truths = [
    "Dios no está enojado contigo, Él está peleando por ti.",
    "Tu identidad no está en tus errores, sino en Cristo.",
    "Ninguna condenación hay para los que están en Cristo Jesús.",
    "El amor de Dios es más grande que cualquier pecado.",
    "Tus sentimientos son reales, pero no siempre son la verdad.",
    "Eres escogido, perdonado y amado eternamente.",
    "Esta prueba es temporal, pero Su gracia es eterna.",
    "Dios perfecciona su poder en tu debilidad.",
    "No estás solo; el Espíritu Santo te consuela ahora mismo.",
    "Levántate, resplandece, porque ha venido tu luz.",
  ];

  final List<Map<String, String>> _songs = [
    {
      'title': '1000 Pedazos',
      'artist': 'Un Corazón',
      'url': 'https://firebasestorage.googleapis.com/v0/b/conecta-plus.appspot.com/o/music%2F1000-pedazos.mp3?alt=media',
    },
    {
      'title': 'Trust In God',
      'artist': 'Elevation Worship',
      'url': 'https://firebasestorage.googleapis.com/v0/b/conecta-plus.appspot.com/o/music%2Ftrust-in-god.mp3?alt=media',
    },
    {
      'title': 'Solo Hay Uno',
      'artist': 'Joel Rocco ft. Enoc Parra',
      'url': 'https://firebasestorage.googleapis.com/v0/b/conecta-plus.appspot.com/o/music%2Fsolo-hay-uno.mp3?alt=media',
    },
    {
      'title': 'Los Brazos de Papá',
      'artist': 'Grupo Grace ft. OASIS MINISTRY',
      'url': 'https://firebasestorage.googleapis.com/v0/b/conecta-plus.appspot.com/o/music%2Fbrazos-de-papa.mp3?alt=media',
    }
  ];
  int _currentSongIndex = 0;

  @override
  void dispose() {
    _audioPlayer.dispose();
    super.dispose();
  }

  void _showTruths() {
    setState(() {
      _currentTruths.clear();
      final shuffled = List<String>.from(_truths)..shuffle();
      _currentTruths.addAll(shuffled.take(5));
      _mode = 'truths';
    });
  }

  void _showPrayer() {
    setState(() {
      _currentPrayer = (_emergencyPrayers..shuffle()).first;
      _mode = 'prayer';
    });
  }

  Future<void> _handleCall() async {
    final Uri url = Uri(scheme: 'tel', path: '+5491100000000');
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
  }

  Future<void> _toggleMusic() async {
    if (_isPlaying) {
      await _audioPlayer.pause();
      setState(() => _isPlaying = false);
    } else {
      await _audioPlayer.play(UrlSource(_songs[_currentSongIndex]['url']!));
      setState(() => _isPlaying = true);
    }
  }

  Future<void> _nextSong() async {
    setState(() {
      _currentSongIndex = (_currentSongIndex + 1) % _songs.length;
    });
    if (_isPlaying) {
      await _audioPlayer.play(UrlSource(_songs[_currentSongIndex]['url']!));
    }
  }

  Future<void> _prevSong() async {
    setState(() {
      _currentSongIndex = (_currentSongIndex - 1 + _songs.length) % _songs.length;
    });
    if (_isPlaying) {
      await _audioPlayer.play(UrlSource(_songs[_currentSongIndex]['url']!));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.primary,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Align(
                alignment: Alignment.centerRight,
                child: IconButton(
                  icon: const Icon(Icons.close, color: Colors.white, size: 32),
                  onPressed: () => Navigator.pop(context),
                ),
              ),
              const SizedBox(height: 40),
              const Text('Respira.', style: TextStyle(color: Colors.white, fontSize: 48, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              const Text(
                'No has fallado todavía. Y aunque lo hicieras, Él te sigue amando. Pero hagamos una pausa de 1 minuto juntos.',
                style: TextStyle(color: Colors.white70, fontSize: 18),
              ),
              const SizedBox(height: 48),
              Expanded(
                child: _mode == null ? _buildMainActions() : _buildDetailView(),
              ),
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.05), borderRadius: BorderRadius.circular(12)),
                child: const Text(
                  'AVISO: Conecta+ BETA es una herramienta espiritual. En caso de emergencia grave, llama al 911.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.white30, fontSize: 10),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMainActions() {
    return Column(
      children: [
        _SOSActionCard(title: 'Leer una promesa', subtitle: 'Rompe la mentira con verdad', icon: Icons.auto_stories, onTap: _showTruths),
        const SizedBox(height: 16),
        _SOSActionCard(title: 'Oración de emergencia', subtitle: 'Habla con tu Padre', icon: Icons.volunteer_activism, onTap: _showPrayer),
        const SizedBox(height: 16),
        _SOSActionCard(title: 'Escuchar música', subtitle: 'Cambia la atmósfera', icon: Icons.music_note, onTap: () => setState(() => _mode = 'music')),
        const SizedBox(height: 16),
        _SOSActionCard(title: 'Llamar a un líder', subtitle: 'No pelees solo', icon: Icons.phone, isOutline: true, onTap: _handleCall),
      ],
    );
  }

  Widget _buildDetailView() {
    if (_mode == 'truths') {
      return Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: _currentTruths.length,
              itemBuilder: (c, i) => Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(16)),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('${i + 1}. ', style: const TextStyle(color: AppTheme.accent, fontWeight: FontWeight.bold, fontSize: 18)),
                    Expanded(child: Text(_currentTruths[i], style: const TextStyle(color: Colors.white, fontSize: 18))),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 24),
          SizedBox(width: double.infinity, height: 56, child: ElevatedButton(onPressed: () => setState(() => _mode = null), style: ElevatedButton.styleFrom(backgroundColor: Colors.white, foregroundColor: AppTheme.primary), child: const Text('Volver'))),
        ],
      );
    }
    if (_mode == 'prayer') {
      return Column(
        children: [
          Expanded(child: Center(child: SingleChildScrollView(child: Container(padding: const EdgeInsets.all(24), decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(24)), child: Text('"$_currentPrayer"', textAlign: TextAlign.center, style: const TextStyle(color: Colors.white, fontSize: 20, fontStyle: FontStyle.italic, height: 1.6)))))),
          const SizedBox(height: 24),
          SizedBox(width: double.infinity, height: 56, child: ElevatedButton(onPressed: () => setState(() => _mode = null), style: ElevatedButton.styleFrom(backgroundColor: Colors.white, foregroundColor: AppTheme.primary), child: const Text('Volver'))),
        ],
      );
    }
    if (_mode == 'music') {
      final currentSong = _songs[_currentSongIndex];
      return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.music_note, size: 80, color: Colors.white24),
          const SizedBox(height: 24),
          Text(currentSong['title']!, style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
          const SizedBox(height: 8),
          Text(currentSong['artist']!, style: const TextStyle(color: Colors.white70, fontSize: 18), textAlign: TextAlign.center),
          const SizedBox(height: 48),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              IconButton(
                icon: const Icon(Icons.skip_previous, size: 48, color: Colors.white),
                onPressed: _prevSong,
              ),
              const SizedBox(width: 32),
              GestureDetector(
                onTap: _toggleMusic,
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                  child: Icon(_isPlaying ? Icons.pause : Icons.play_arrow, size: 48, color: AppTheme.primary),
                ),
              ),
              const SizedBox(width: 32),
              IconButton(
                icon: const Icon(Icons.skip_next, size: 48, color: Colors.white),
                onPressed: _nextSong,
              ),
            ],
          ),
          const Spacer(),
          SizedBox(width: double.infinity, height: 56, child: ElevatedButton(onPressed: () => setState(() => _mode = null), style: ElevatedButton.styleFrom(backgroundColor: Colors.white, foregroundColor: AppTheme.primary), child: const Text('Volver'))),
        ],
      );
    }
    return Center(child: TextButton(onPressed: () => setState(() => _mode = null), child: const Text('Volver', style: TextStyle(color: Colors.white))));
  }
}

class _SOSActionCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final VoidCallback onTap;
  final bool isOutline;

  const _SOSActionCard({required this.title, required this.subtitle, required this.icon, required this.onTap, this.isOutline = false});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: isOutline ? Colors.transparent : Colors.white,
          border: isOutline ? Border.all(color: Colors.white, width: 2) : null,
          borderRadius: BorderRadius.circular(20),
          boxShadow: isOutline ? null : [BoxShadow(color: Colors.black.withValues(alpha: 0.1), blurRadius: 10, offset: const Offset(0, 4))],
        ),
        child: Row(
          children: [
            Icon(icon, color: isOutline ? Colors.white : AppTheme.accent, size: 28),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: TextStyle(color: isOutline ? Colors.white : AppTheme.primary, fontWeight: FontWeight.bold, fontSize: 16)),
                  Text(subtitle, style: TextStyle(color: isOutline ? Colors.white70 : AppTheme.textMuted, fontSize: 12)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
