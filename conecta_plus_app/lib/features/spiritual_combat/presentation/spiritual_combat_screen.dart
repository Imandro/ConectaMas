import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../l10n/app_localizations.dart';
import '../../dashboard/presentation/widgets/llami_mascot.dart';
import '../domain/victory_record.dart';
import '../data/spiritual_combat_repository.dart';

class SpiritualCombatScreen extends ConsumerStatefulWidget {
  const SpiritualCombatScreen({super.key});

  @override
  ConsumerState<SpiritualCombatScreen> createState() =>
      _SpiritualCombatScreenState();
}

class _SpiritualCombatScreenState extends ConsumerState<SpiritualCombatScreen> {
  String? _companionName;
  String? _companionPhone;

  @override
  void initState() {
    super.initState();
    _loadAllianceData();
  }

  void _loadAllianceData() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _companionName = prefs.getString('companion_name');
      _companionPhone = prefs.getString('companion_phone');
    });
  }

  void _saveAllianceData(String name, String phone) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('companion_name', name);
    await prefs.setString('companion_phone', phone);
    _loadAllianceData();
  }

  Future<void> _sendReinforcement(AppLocalizations l10n) async {
    if (_companionPhone == null || _companionPhone!.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(l10n.noCompanion)),
      );
      return;
    }

    final message = l10n.allianceAlertMsg.replaceFirst('%s', 'Tu Compañero');
    final url = Uri.parse(
        'whatsapp://send?phone=$_companionPhone&text=${Uri.encodeComponent(message)}');

    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    } else {
      final smsUrl = Uri.parse(
          'sms:$_companionPhone?body=${Uri.encodeComponent(message)}');
      if (await canLaunchUrl(smsUrl)) {
        await launchUrl(smsUrl);
      }
    }
  }

  void _showAssignCompanion(AppLocalizations l10n) {
    final nameController = TextEditingController(text: _companionName);
    final phoneController = TextEditingController(text: _companionPhone);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
          top: 32,
          left: 24,
          right: 24,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(l10n.assignCompanion,
                style: GoogleFonts.fredoka(
                    fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 24),
            TextField(
              controller: nameController,
              decoration: InputDecoration(
                  labelText: l10n.companionName,
                  border: const OutlineInputBorder()),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: phoneController,
              keyboardType: TextInputType.phone,
              decoration: InputDecoration(
                  labelText: l10n.companionPhone,
                  border: const OutlineInputBorder()),
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: () {
                _saveAllianceData(nameController.text, phoneController.text);
                Navigator.pop(context);
              },
              style: ElevatedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 50)),
              child: Text(l10n.save),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final victoriesAsync = ref.watch(victoriesProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(l10n.spiritualCombatTitle.toUpperCase(),
            style: GoogleFonts.fredoka(
                fontWeight: FontWeight.w900, color: Colors.blue.shade900)),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.blue.shade900),
          onPressed: () => context.pop(),
        ),
      ),
      body: CustomScrollView(
        slivers: [
          // HEADER: MASCOT & SOS
          SliverToBoxAdapter(
            child: Container(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  const LlamiMascot(
                    streak: 7,
                    expression: LlamiExpression.happy,
                  ),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(
                        flex: 2,
                        child: _ActionCard(
                          onTap: () =>
                              context.push('/dashboard/spiritual-combat/panic'),
                          icon: Icons.emergency,
                          label: l10n.sosTitle.toUpperCase(),
                          color: Colors.red.shade700,
                          isMain: true,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          children: [
                            _ActionCard(
                              onTap: () => context.push('/dashboard/checkin'),
                              icon: Icons.check_circle_outline,
                              label: l10n.registerVictory,
                              color: Colors.green.shade600,
                            ),
                            const SizedBox(height: 12),
                            _ActionCard(
                              onTap: () => context
                                  .push('/dashboard/spiritual-combat/chat'),
                              icon: Icons.auto_stories_outlined,
                              label: l10n.biblicalAdvice,
                              color: Colors.amber.shade700,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          // LIFE SUMMARY (RESUMEN DE VIDA)
          _SectionHeader(
              title: l10n.struggleSummary, icon: Icons.analytics_outlined),
          SliverToBoxAdapter(
            child: Container(
              height: 140,
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  _LifeSummaryItem(
                      label: "Ansiedad", value: "80%", color: Colors.blue),
                  _LifeSummaryItem(
                      label: "Pureza", value: "65%", color: Colors.purple),
                  _LifeSummaryItem(
                      label: "Orgullo", value: "90%", color: Colors.orange),
                  _LifeSummaryItem(
                      label: "Ira", value: "40%", color: Colors.red),
                ],
              ),
            ),
          ),

          // AVAILABLE PLANS (PLANES DISPONIBLES)
          _SectionHeader(
              title: l10n.availablePlans, icon: Icons.explore_outlined),
          SliverToBoxAdapter(
            child: SizedBox(
              height: 180,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 20),
                children: [
                  _AvailablePlanCard(
                      title: "Dominio Propio", days: 7, color: Colors.indigo),
                  _AvailablePlanCard(
                      title: "Mente Renovada", days: 14, color: Colors.teal),
                  _AvailablePlanCard(
                      title: "Paz Profunda", days: 5, color: Colors.cyan),
                ],
              ),
            ),
          ),

          // VICTORY HALL (SALÓN DE VICTORIAS)
          _SectionHeader(
              title: l10n.victoryHall, icon: Icons.emoji_events_outlined),
          victoriesAsync.when(
            data: (list) => list.isEmpty
                ? SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.all(40),
                      child: Column(
                        children: [
                          Icon(Icons.history,
                              size: 48, color: Colors.grey.shade300),
                          const SizedBox(height: 12),
                          Text(l10n.emptyStrugglesDesc,
                              style: const TextStyle(color: Colors.grey)),
                        ],
                      ),
                    ),
                  )
                : SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final v = list.reversed.toList()[index];
                        return _VictoryTile(victory: v);
                      },
                      childCount: list.length,
                    ),
                  ),
            loading: () => const SliverToBoxAdapter(
                child: Center(child: CircularProgressIndicator())),
            error: (e, _) =>
                SliverToBoxAdapter(child: Center(child: Text('Error: $e'))),
          ),

          // ALIANZA DE VICTORIA
          _SectionHeader(
              title: l10n.allianceTitle, icon: Icons.handshake_outlined),
          SliverToBoxAdapter(
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                children: [
                  _AllianceCard(
                    companionName: _companionName ?? l10n.noCompanion,
                    hasCompanion: _companionName != null,
                    onEdit: () => _showAssignCompanion(l10n),
                    onCheckin: () =>
                        context.push('/dashboard/spiritual-combat/honesty'),
                  ),
                  const SizedBox(height: 16),
                  _ReinforcementButton(
                    onPressed: () => _sendReinforcement(l10n),
                    label: l10n.reinforcementBtn,
                    subtitle: l10n.reinforcementDesc,
                  ),
                ],
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 120)),
        ],
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
    return SliverPadding(
      padding: const EdgeInsets.fromLTRB(24, 32, 24, 16),
      sliver: SliverToBoxAdapter(
        child: Row(
          children: [
            Icon(icon, size: 20, color: Colors.blue.shade800),
            const SizedBox(width: 8),
            Text(
              title.toUpperCase(),
              style: GoogleFonts.fredoka(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: Colors.blue.shade900,
                letterSpacing: 1.2,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ActionCard extends StatelessWidget {
  final VoidCallback onTap;
  final IconData icon;
  final String label;
  final Color color;
  final bool isMain;

  const _ActionCard({
    required this.onTap,
    required this.icon,
    required this.label,
    required this.color,
    this.isMain = false,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: isMain ? 130 : 60,
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: color.withValues(alpha: 0.3),
              blurRadius: 12,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Stack(
          children: [
            if (isMain)
              Positioned(
                right: -20,
                bottom: -20,
                child: Icon(icon, size: 100, color: Colors.white10),
              ),
            Center(
              child: isMain
                  ? Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(icon, color: Colors.white, size: 32),
                        const SizedBox(height: 8),
                        Text(label,
                            style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold)),
                      ],
                    )
                  : Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(icon, color: Colors.white, size: 20),
                        const SizedBox(width: 8),
                        Text(label,
                            style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 13)),
                      ],
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

class _LifeSummaryItem extends StatelessWidget {
  final String label;
  final String value;
  final Color color;

  const _LifeSummaryItem(
      {required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 100,
      margin: const EdgeInsets.only(right: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.grey.shade100),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(value,
              style: TextStyle(
                  color: color, fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(label, style: const TextStyle(color: Colors.grey, fontSize: 12)),
        ],
      ),
    );
  }
}

class _AvailablePlanCard extends StatelessWidget {
  final String title;
  final int days;
  final Color color;

  const _AvailablePlanCard(
      {required this.title, required this.days, required this.color});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    return Container(
      width: 160,
      margin: const EdgeInsets.only(right: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.grey.shade100),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 100,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(24)),
            ),
            child: Center(child: Icon(Icons.menu_book, color: color, size: 40)),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: const TextStyle(fontWeight: FontWeight.bold)),
                Text("$days días - ${l10n.planPending}",
                    style: const TextStyle(color: Colors.grey, fontSize: 10)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _VictoryTile extends StatelessWidget {
  final VictoryRecord victory;
  const _VictoryTile({required this.victory});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(20, 0, 20, 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.shade100),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.green.shade50,
              shape: BoxShape.circle,
            ),
            child: Icon(Icons.check, color: Colors.green.shade600, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(victory.battleFront,
                    style: const TextStyle(fontWeight: FontWeight.bold)),
                Text(victory.reflection,
                    style: const TextStyle(color: Colors.grey, fontSize: 12),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis),
              ],
            ),
          ),
          Text("${victory.date.day}/${victory.date.month}",
              style: TextStyle(
                  color: Colors.green.shade700,
                  fontWeight: FontWeight.bold,
                  fontSize: 12)),
        ],
      ),
    );
  }
}

class _AllianceCard extends StatelessWidget {
  final String companionName;
  final bool hasCompanion;
  final VoidCallback onEdit;
  final VoidCallback onCheckin;

  const _AllianceCard({
    required this.companionName,
    required this.hasCompanion,
    required this.onEdit,
    required this.onCheckin,
  });

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.blue.shade900, Colors.blue.shade700],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(28),
        boxShadow: [
          BoxShadow(
              color: Colors.blue.shade900.withValues(alpha: 0.2),
              blurRadius: 15,
              offset: const Offset(0, 8)),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 24,
                backgroundColor: Colors.white24,
                child: Icon(hasCompanion ? Icons.person : Icons.person_add,
                    color: Colors.white),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(l10n.battleCompanion,
                        style: const TextStyle(
                            color: Colors.white70, fontSize: 12)),
                    Text(companionName,
                        style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 18)),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.edit, color: Colors.white70, size: 20),
                onPressed: onEdit,
              ),
            ],
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: onCheckin,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: Colors.blue.shade900,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16)),
              minimumSize: const Size(double.infinity, 50),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.verified_user),
                const SizedBox(width: 12),
                Text(l10n.honestyCheckin.toUpperCase(),
                    style: const TextStyle(fontWeight: FontWeight.bold)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ReinforcementButton extends StatelessWidget {
  final VoidCallback onPressed;
  final String label;
  final String subtitle;

  const _ReinforcementButton({
    required this.onPressed,
    required this.label,
    required this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.red.shade900,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Colors.red.shade700, width: 2),
        ),
        child: Row(
          children: [
            const Icon(Icons.emergency_share, color: Colors.white, size: 32),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label,
                      style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w900,
                          fontSize: 16)),
                  Text(subtitle,
                      style:
                          const TextStyle(color: Colors.white70, fontSize: 12)),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: Colors.white70),
          ],
        ),
      )
          .animate(onPlay: (c) => c.repeat())
          .shimmer(duration: 3.seconds, color: Colors.white10),
    );
  }
}
