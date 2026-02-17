import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../l10n/app_localizations.dart';

class SosPanicScreen extends StatefulWidget {
  const SosPanicScreen({super.key});

  @override
  State<SosPanicScreen> createState() => _SosPanicScreenState();
}

class _SosPanicScreenState extends State<SosPanicScreen> {
  String? _selectedPrayer;
  List<String>? _selectedTruths;
  String? _leaderPhone;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  void _loadData() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _leaderPhone = prefs.getString('leader_phone');
    });
  }

  void _generateRandomWeapons(AppLocalizations l10n) {
    final random = Random();
    // In a real app, these would be in AppLocalizations.
    // For now, I'll use the ones I just analyzed from the web.
    // I will simulate them being fetched from l10n to keep it clean.

    // Truths from web
    final truths = [
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

    // Prayers from web
    final prayers = [
      "Padre Celestial, en este momento de angustia te necesito más que nunca. Siento que las fuerzas me abandonan, pero sé que Tú nunca me abandonas. Llena mi corazón de Tu paz que sobrepasa todo entendimiento...",
      "Señor Jesús, siento que no puedo más con esta carga. Mi mente está agitada, mis emociones están desbordadas, y necesito Tu intervención divina ahora mismo...",
      "Dios de amor infinito, en este momento tan difícil clamo a Ti con todo mi corazón. Calma la tormenta que hay en mi mente, fortalece mi espíritu que se siente débil...",
      "Espíritu Santo, ven como consolador a mi corazón quebrantado. Necesito Tu guía divina en este momento de confusión...",
      "Padre Eterno, reconozco humildemente que sin Ti no puedo hacer absolutamente nada. Esta batalla es demasiado grande para mí, pero no para Ti...",
    ];

    setState(() {
      _selectedPrayer = prayers[random.nextInt(prayers.length)];
      final shuffledTruths = List<String>.from(truths)..shuffle(random);
      _selectedTruths = shuffledTruths.take(5).toList();
    });
  }

  Future<void> _makeCall() async {
    if (_leaderPhone == null || _leaderPhone!.isEmpty) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(AppLocalizations.of(context).sosNoLeader)),
      );
      return;
    }
    final url = Uri.parse('tel:$_leaderPhone');
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);

    // Auto-generate on first build
    if (_selectedTruths == null) {
      _generateRandomWeapons(l10n);
    }

    return Scaffold(
      backgroundColor:
          const Color(0xFF0F172A), // Dark slate blue - deep & focused
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              const Color(0xFF1E1B4B), // Very dark blue
              const Color(0xFF7F1D1D).withValues(alpha: 0.3), // Blood red hint
              const Color(0xFF0F172A),
            ],
          ),
        ),
        child: SafeArea(
          child: CustomScrollView(
            slivers: [
              SliverAppBar(
                backgroundColor: Colors.transparent,
                floating: true,
                leading: IconButton(
                  icon: const Icon(Icons.close, color: Colors.white, size: 28),
                  onPressed: () => Navigator.pop(context),
                ),
                actions: [
                  IconButton(
                    icon: const Icon(Icons.refresh, color: Colors.white70),
                    onPressed: () => _generateRandomWeapons(l10n),
                  ),
                ],
              ),
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    const Center(
                      child: Icon(Icons.shield, color: Colors.amber, size: 80),
                    )
                        .animate(onPlay: (c) => c.repeat())
                        .shimmer(duration: 2.seconds, color: Colors.white24),
                    const SizedBox(height: 24),
                    Text(
                      l10n.sosTitle,
                      textAlign: TextAlign.center,
                      style: GoogleFonts.fredoka(
                        fontSize: 40,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                        letterSpacing: -1,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.05),
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: Colors.white12),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            l10n.sosPauseTitle,
                            style: const TextStyle(
                              color: Colors.amber,
                              fontWeight: FontWeight.bold,
                              fontSize: 18,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            l10n.sosPauseDesc,
                            style: TextStyle(
                              color: Colors.white.withValues(alpha: 0.8),
                              fontSize: 15,
                              height: 1.5,
                            ),
                          ),
                        ],
                      ),
                    ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.2),
                    const SizedBox(height: 32),
                    Text(
                      l10n.sosSubtitle,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.white.withValues(alpha: 0.6),
                        fontSize: 16,
                        height: 1.4,
                      ),
                    ).animate().fadeIn(delay: 400.ms),
                    const SizedBox(height: 40),

                    // SPIRITUAL TRUTHS
                    _SectionHeader(
                        title: l10n.sosTruthsTitle, icon: Icons.auto_awesome),
                    if (_selectedTruths != null)
                      ..._selectedTruths!
                          .map((truth) => _TruthCard(truth: truth)),

                    const SizedBox(height: 40),

                    // EMERGENCY PRAYER
                    _SectionHeader(
                        title: l10n.sosPrayerTitle, icon: Icons.favorite),
                    if (_selectedPrayer != null)
                      _PrayerCard(prayer: _selectedPrayer!),

                    const SizedBox(height: 40),

                    // CALL LEADER BUTTON
                    _ActionButton(
                      onPressed: _makeCall,
                      icon: Icons.phone,
                      title: l10n.sosCallLeader,
                      subtitle: l10n.sosCallDesc,
                      color: Colors.white.withValues(alpha: 0.1),
                    ),

                    const SizedBox(height: 20),

                    Text(
                      l10n.sosDisclaimer,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.white.withValues(alpha: 0.3),
                        fontSize: 11,
                      ),
                    ),
                    const SizedBox(height: 40),
                  ]),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  final IconData icon;

  const _SectionHeader({required this.title, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          Icon(icon, color: Colors.amber, size: 20),
          const SizedBox(width: 8),
          Text(
            title,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 18,
            ),
          ),
        ],
      ),
    );
  }
}

class _TruthCard extends StatelessWidget {
  final String truth;

  const _TruthCard({required this.truth});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("•", style: TextStyle(color: Colors.amber, fontSize: 24)),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              truth,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w500,
                height: 1.4,
              ),
            ),
          ),
        ],
      ),
    ).animate().slideX(begin: 0.1).fadeIn();
  }
}

class _PrayerCard extends StatelessWidget {
  final String prayer;

  const _PrayerCard({required this.prayer});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white10),
      ),
      child: Text(
        '"$prayer"',
        textAlign: TextAlign.center,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 17,
          fontStyle: FontStyle.italic,
          height: 1.6,
          letterSpacing: 0.2,
        ),
      ),
    ).animate().fadeIn();
  }
}

class _ActionButton extends StatelessWidget {
  final VoidCallback onPressed;
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;

  const _ActionButton({
    required this.onPressed,
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onPressed,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.white24),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: Colors.white, size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.6),
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios,
                color: Colors.white24, size: 16),
          ],
        ),
      ),
    );
  }
}
