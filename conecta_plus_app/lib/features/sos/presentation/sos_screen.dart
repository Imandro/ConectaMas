import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../config/theme.dart';
import '../../../l10n/app_localizations.dart';
import '../data/sos_content.dart';

class SOSScreen extends ConsumerStatefulWidget {
  const SOSScreen({super.key});

  @override
  ConsumerState<SOSScreen> createState() => _SOSScreenState();
}

class _SOSScreenState extends ConsumerState<SOSScreen> {
  String? _mode; // 'truths', 'music', 'prayer'
  String _currentPrayer = '';
  final List<String> _currentTruths = [];
  final AudioPlayer _audioPlayer = AudioPlayer();
  bool _isPlaying = false;

  final List<Map<String, String>> _songs = [
    {
      'title': '1000 Pedazos',
      'artist': 'Un Corazón',
      'url':
          'https://firebasestorage.googleapis.com/v0/b/conecta-plus.appspot.com/o/music%2F1000-pedazos.mp3?alt=media',
    },
    {
      'title': 'Trust In God',
      'artist': 'Elevation Worship',
      'url':
          'https://firebasestorage.googleapis.com/v0/b/conecta-plus.appspot.com/o/music%2Ftrust-in-god.mp3?alt=media',
    },
    {
      'title': 'Solo Hay Uno',
      'artist': 'Joel Rocco ft. Enoc Parra',
      'url':
          'https://firebasestorage.googleapis.com/v0/b/conecta-plus.appspot.com/o/music%2Fsolo-hay-uno.mp3?alt=media',
    },
    {
      'title': 'Los Brazos de Papá',
      'artist': 'Grupo Grace ft. OASIS MINISTRY',
      'url':
          'https://firebasestorage.googleapis.com/v0/b/conecta-plus.appspot.com/o/music%2Fbrazos-de-papa.mp3?alt=media',
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
      final shuffled = List<String>.from(SOSContent.truths)..shuffle();
      _currentTruths.addAll(shuffled.take(5));
      _mode = 'truths';
    });
  }

  void _showPrayer() {
    setState(() {
      _currentPrayer = (List<String>.from(SOSContent.prayers)..shuffle()).first;
      _mode = 'prayer';
    });
  }

  Future<void> _handleCall() async {
    // Assuming leaderPhone might be in user metadata or a specific field we can fetch
    // For now using a placeholder if not available, but real implementation should use database data
    final String leaderPhone = '+5491100000000';
    final Uri url = Uri(scheme: 'tel', path: leaderPhone);
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

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);

    return Scaffold(
      backgroundColor: AppTheme.primary,
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF0F172A), AppTheme.primary],
          ),
        ),
        child: SafeArea(
          child: Stack(
            children: [
              // Decorative background elements
              Positioned(
                top: -100,
                left: -100,
                child: Container(
                  width: 300,
                  height: 300,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.blue.withValues(alpha: 0.05),
                  ),
                ).animate(onPlay: (c) => c.repeat(reverse: true)).scale(
                    duration: 5.seconds,
                    begin: const Offset(1, 1),
                    end: const Offset(1.5, 1.5)),
              ),

              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const SizedBox.shrink(),
                        IconButton(
                          icon: const Icon(Icons.close,
                              color: Colors.white, size: 28),
                          onPressed: () => Navigator.pop(context),
                          style: IconButton.styleFrom(
                            backgroundColor:
                                Colors.white.withValues(alpha: 0.1),
                            padding: const EdgeInsets.all(8),
                          ),
                        ),
                      ],
                    ),

                    Expanded(
                      child: SingleChildScrollView(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const SizedBox(height: 24),
                            Text(l10n.sosTitle,
                                    style: GoogleFonts.fredoka(
                                        color: Colors.white,
                                        fontSize: 48,
                                        fontWeight: FontWeight.bold))
                                .animate()
                                .fadeIn()
                                .slideX(begin: -0.2),

                            const SizedBox(height: 24),

                            // Spiritual Context Section (Match Web App)
                            Container(
                              padding: const EdgeInsets.all(20),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(28),
                                border: Border.all(
                                    color: Colors.white.withValues(alpha: 0.1)),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      const Icon(Icons.spa,
                                          color: Colors.amber, size: 20),
                                      const SizedBox(width: 8),
                                      Text('Pausa y Reconecta',
                                          style: GoogleFonts.fredoka(
                                              fontWeight: FontWeight.bold,
                                              color: Colors.amber)),
                                    ],
                                  ),
                                  const SizedBox(height: 12),
                                  Text(
                                    'La ansiedad y la tentación a menudo nos roban la perspectiva. Este espacio ha sido diseñado específicamente para ayudarte a recuperar el aliento espiritual.',
                                    style: GoogleFonts.fredoka(
                                        color:
                                            Colors.white.withValues(alpha: 0.9),
                                        fontSize: 14,
                                        height: 1.4),
                                  ),
                                ],
                              ),
                            ).animate().fadeIn(delay: 200.ms).scale(),

                            const SizedBox(height: 24),

                            Text(
                              l10n.sosSubtitle,
                              style: GoogleFonts.fredoka(
                                  color: Colors.white70, fontSize: 18),
                            ).animate().fadeIn(delay: 400.ms),

                            const SizedBox(height: 40),

                            _mode == null
                                ? _buildMainActions(l10n)
                                : _buildDetailView(),

                            const SizedBox(height: 40),
                          ],
                        ),
                      ),
                    ),

                    // Disclaimer at bottom
                    Padding(
                      padding: const EdgeInsets.only(bottom: 24),
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.05),
                            borderRadius: BorderRadius.circular(20)),
                        child: Text(
                          l10n.sosDisclaimer,
                          textAlign: TextAlign.center,
                          style: GoogleFonts.fredoka(
                              color: Colors.white30, fontSize: 11),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMainActions(AppLocalizations l10n) {
    return Column(
      children: [
        _SOSActionCard(
            title: 'Rompe la Mentira',
            subtitle: 'Leer verdades bíblicas',
            icon: Icons.auto_stories,
            color: Colors.white,
            iconColor: Colors.orange,
            onTap: _showTruths),
        const SizedBox(height: 16),
        _SOSActionCard(
            title: 'Habla con tu Padre',
            subtitle: 'Oración de emergencia',
            icon: Icons.volunteer_activism,
            color: Colors.white,
            iconColor: Colors.blue,
            onTap: _showPrayer),
        const SizedBox(height: 16),
        _SOSActionCard(
            title: 'Cambia la Atmósfera',
            subtitle: 'Música de alabanza',
            icon: Icons.music_note,
            color: Colors.white,
            iconColor: Colors.purple,
            onTap: () => setState(() => _mode = 'music')),
        const SizedBox(height: 16),
        _SOSActionCard(
            title: 'Llama por Ayuda',
            subtitle: 'Contactar a un líder',
            icon: Icons.phone_forwarded,
            color: Colors.transparent,
            isOutline: true,
            iconColor: Colors.white,
            onTap: _handleCall),
      ].animate(interval: 100.ms).fadeIn().slideY(begin: 0.2),
    );
  }

  Widget _buildDetailView() {
    if (_mode == 'truths') {
      return Column(
        children: [
          ..._currentTruths
              .map((truth) => Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(
                          color: Colors.white.withValues(alpha: 0.1)),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Icon(Icons.check_circle_outline,
                            color: Colors.amber, size: 24),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Text(truth,
                              style: GoogleFonts.fredoka(
                                  color: Colors.white,
                                  fontSize: 18,
                                  height: 1.4)),
                        ),
                      ],
                    ),
                  ))
              .toList()
              .animate(interval: 100.ms)
              .fadeIn()
              .slideX(),
          const SizedBox(height: 32),
          _buildBackButton(),
        ],
      );
    }
    if (_mode == 'prayer') {
      return Column(
        children: [
          Container(
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(32),
              border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
            ),
            child: Text('"$_currentPrayer"',
                textAlign: TextAlign.center,
                style: GoogleFonts.fredoka(
                    color: Colors.white,
                    fontSize: 20,
                    fontStyle: FontStyle.italic,
                    height: 1.6)),
          ).animate().fadeIn().scale(),
          const SizedBox(height: 32),
          _buildBackButton(),
        ],
      );
    }
    if (_mode == 'music') {
      final currentSong = _songs[_currentSongIndex];
      return Column(
        children: [
          Container(
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(32),
              border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
            ),
            child: Column(
              children: [
                const Icon(Icons.music_note, size: 64, color: Colors.blue),
                const SizedBox(height: 24),
                Text(currentSong['title']!,
                    style: GoogleFonts.fredoka(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold),
                    textAlign: TextAlign.center),
                const SizedBox(height: 8),
                Text(currentSong['artist']!,
                    style: GoogleFonts.fredoka(
                        color: Colors.white70, fontSize: 16),
                    textAlign: TextAlign.center),
                const SizedBox(height: 40),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.skip_previous,
                          size: 36, color: Colors.white),
                      onPressed: () {
                        setState(() => _currentSongIndex =
                            (_currentSongIndex - 1 + _songs.length) %
                                _songs.length);
                        if (_isPlaying) _toggleMusic();
                      },
                    ),
                    const SizedBox(width: 24),
                    GestureDetector(
                      onTap: _toggleMusic,
                      child: Container(
                        padding: const EdgeInsets.all(20),
                        decoration: const BoxDecoration(
                            color: Colors.white, shape: BoxShape.circle),
                        child: Icon(_isPlaying ? Icons.pause : Icons.play_arrow,
                            size: 36, color: AppTheme.primary),
                      ),
                    ),
                    const SizedBox(width: 24),
                    IconButton(
                      icon: const Icon(Icons.skip_next,
                          size: 36, color: Colors.white),
                      onPressed: () {
                        setState(() => _currentSongIndex =
                            (_currentSongIndex + 1) % _songs.length);
                        if (_isPlaying) _toggleMusic();
                      },
                    ),
                  ],
                ),
              ],
            ),
          ).animate().fadeIn().slideY(),
          const SizedBox(height: 32),
          _buildBackButton(),
        ],
      );
    }
    return _buildBackButton();
  }

  Widget _buildBackButton() {
    return SizedBox(
      width: double.infinity,
      height: 60,
      child: ElevatedButton(
        onPressed: () => setState(() => _mode = null),
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.white.withValues(alpha: 0.1),
          foregroundColor: Colors.white,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          elevation: 0,
        ),
        child: Text('Volver al menú',
            style: GoogleFonts.fredoka(fontWeight: FontWeight.bold)),
      ),
    );
  }
}

class _SOSActionCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;
  final Color iconColor;
  final VoidCallback onTap;
  final bool isOutline;

  const _SOSActionCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.color,
    required this.iconColor,
    required this.onTap,
    this.isOutline = false,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(28),
          border: isOutline ? Border.all(color: Colors.white, width: 2) : null,
          boxShadow: isOutline
              ? null
              : [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.2),
                    blurRadius: 15,
                    offset: const Offset(0, 8),
                  )
                ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isOutline
                    ? Colors.white.withValues(alpha: 0.1)
                    : iconColor.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: iconColor, size: 28),
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title,
                      style: GoogleFonts.fredoka(
                          color: isOutline ? Colors.white : AppTheme.primary,
                          fontWeight: FontWeight.bold,
                          fontSize: 18)),
                  const SizedBox(height: 4),
                  Text(subtitle,
                      style: GoogleFonts.fredoka(
                          color:
                              isOutline ? Colors.white70 : AppTheme.textMuted,
                          fontSize: 14)),
                ],
              ),
            ),
            Icon(Icons.chevron_right,
                color: isOutline ? Colors.white30 : AppTheme.textMuted),
          ],
        ),
      ),
    );
  }
}
