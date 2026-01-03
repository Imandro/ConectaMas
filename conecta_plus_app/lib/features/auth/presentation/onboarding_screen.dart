import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../config/theme.dart';
import '../../../shared/widgets/custom_button.dart';
import '../../dashboard/presentation/widgets/llami_mascot.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  int _currentStep = 1;
  final int _totalSteps = 11;

  // Selected Data
  String _spiritualStatus = '';
  final List<String> _sins = [];
  final List<String> _problems = [];
  final List<String> _connectionMethods = [];
  String _gender = '';
  int _age = 18;
  String _mascotName = 'Llami';
  String _leaderPhone = '';

  void _nextStep() {
    if (_currentStep < _totalSteps) {
      setState(() => _currentStep++);
    } else {
      context.go('/dashboard');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.primary,
      body: SafeArea(
        child: Column(
          children: [
            // Progress Bar
            Padding(
              padding: const EdgeInsets.all(24),
              child: Container(
                height: 8,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: FractionallySizedBox(
                  alignment: Alignment.centerLeft,
                  widthFactor: _currentStep / _totalSteps,
                  child: Container(
                    decoration: BoxDecoration(
                      color: AppTheme.accent,
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
              ),
            ),

            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: _buildCurrentStep(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCurrentStep() {
    Widget child;
    switch (_currentStep) {
      case 1:
        child = _buildSpiritualStatus();
        break;
      case 2:
        child = _buildSins();
        break;
      case 3:
        child = _buildProblems();
        break;
      case 4:
        child = _buildConnection();
        break;
      case 5:
        child = _buildGender();
        break;
      case 6:
        child = _buildAge();
        break;
      case 7:
        child = _buildMascot();
        break;
      case 8:
        child = _buildLeaderPhone();
        break;
      case 9:
        child = _buildCommunityIntro();
        break;
      case 10:
        child = _buildSupportAd();
        break;
      case 11:
        child = _buildFinalStep();
        break;
      default:
        child = const SizedBox();
        break;
    }
    return child
        .animate(key: ValueKey(_currentStep))
        .fadeIn(duration: 400.ms)
        .slideX(begin: 0.1, curve: Curves.easeOutQuad);
  }

  // MARK: - Step Builders

  Widget _buildStepHeader(IconData icon, String title, String subtitle) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.05),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: AppTheme.accent, size: 32)
              .animate(onPlay: (c) => c.repeat(reverse: true))
              .scale(
                  begin: const Offset(0.9, 0.9),
                  end: const Offset(1.1, 1.1),
                  duration: 2.seconds,
                  curve: Curves.easeInOut),
        ),
        const SizedBox(height: 24),
        Text(
          title,
          textAlign: TextAlign.center,
          style: const TextStyle(
              fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white),
        ).animate().fadeIn(delay: 100.ms).slideY(begin: 0.2),
        const SizedBox(height: 8),
        Text(
          subtitle,
          textAlign: TextAlign.center,
          style: const TextStyle(fontSize: 16, color: Colors.white60),
        ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.2),
        const SizedBox(height: 32),
      ],
    );
  }

  Widget _buildSpiritualStatus() {
    final options = [
      {
        'id': 'ACCEPT',
        'title': 'Aceptar a Jesús por Primera Vez',
        'icon': Icons.auto_awesome
      },
      {
        'id': 'RENEW',
        'title': 'Reconciliar y Renovar mi Fe',
        'icon': Icons.refresh
      },
      {
        'id': 'DEEPEN',
        'title': 'Conectar Más Profundamente',
        'icon': Icons.bolt
      },
    ];

    return Column(
      children: [
        _buildStepHeader(Icons.shield_outlined, 'Bienvenido a Conecta+',
            '¿Dónde estás espiritualmente?'),
        ...options.map((opt) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: _SelectionButton(
                title: opt['title'] as String,
                icon: opt['icon'] as IconData,
                isSelected: _spiritualStatus == opt['id'],
                onTap: () =>
                    setState(() => _spiritualStatus = opt['id'] as String),
              ),
            )),
        const Spacer(),
        SizedBox(
          width: double.infinity,
          child: CustomButton(
            text: 'Continuar',
            backgroundColor: AppTheme.accent,
            onPressed: _spiritualStatus.isEmpty ? null : _nextStep,
          ),
        ),
        const SizedBox(height: 24),
      ],
    );
  }

  Widget _buildSins() {
    final options = [
      "Pornografía",
      "Mentira",
      "Enojo / Ira",
      "Orgullo",
      "Envidia",
      "Adicciones",
      "Relaciones Tóxicas"
    ];
    return Column(
      children: [
        _buildStepHeader(
            Icons.heart_broken_outlined,
            'Pecados que Quiero Dejar',
            'Selecciona lo que resuene contigo. Esto es privado.'),
        Expanded(
          child: ListView(
            children: options
                .map((sin) => Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: _SelectionButton(
                        title: sin,
                        isSelected: _sins.contains(sin),
                        onTap: () => setState(() => _sins.contains(sin)
                            ? _sins.remove(sin)
                            : _sins.add(sin)),
                      ),
                    ))
                .toList(),
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
            width: double.infinity,
            child: CustomButton(text: 'Continuar', onPressed: _nextStep)),
        const SizedBox(height: 24),
      ],
    );
  }

  Widget _buildProblems() {
    final options = [
      "Ansiedad / Estrés",
      "Depresión / Tristeza",
      "Soledad",
      "Baja autoestima",
      "Problemas familiares",
      "Falta de propósito"
    ];
    return Column(
      children: [
        _buildStepHeader(Icons.psychology_outlined, 'Problemas que Enfrento',
            '¿Con qué luchas actualmente?'),
        Expanded(
          child: ListView(
            children: options
                .map((prob) => Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: _SelectionButton(
                        title: prob,
                        isSelected: _problems.contains(prob),
                        onTap: () => setState(() => _problems.contains(prob)
                            ? _problems.remove(prob)
                            : _problems.add(prob)),
                      ),
                    ))
                .toList(),
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
            width: double.infinity,
            child: CustomButton(text: 'Continuar', onPressed: _nextStep)),
        const SizedBox(height: 24),
      ],
    );
  }

  Widget _buildConnection() {
    final options = [
      "Orar más",
      "Leer la Biblia",
      "Ayunar",
      "Unirme a un grupo",
      "Adorar (música)",
      "Estudiar la Palabra"
    ];
    return Column(
      children: [
        _buildStepHeader(
            Icons.connect_without_contact_outlined,
            '¿Cómo Quiero Conectar?',
            '¿De qué formas quieres crecer con Dios?'),
        Expanded(
          child: ListView(
            children: options
                .map((opt) => Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: _SelectionButton(
                        title: opt,
                        isSelected: _connectionMethods.contains(opt),
                        onTap: () => setState(() =>
                            _connectionMethods.contains(opt)
                                ? _connectionMethods.remove(opt)
                                : _connectionMethods.add(opt)),
                      ),
                    ))
                .toList(),
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
            width: double.infinity,
            child: CustomButton(text: 'Continuar', onPressed: _nextStep)),
        const SizedBox(height: 24),
      ],
    );
  }

  Widget _buildGender() {
    return Column(
      children: [
        _buildStepHeader(Icons.person_outline, 'Sobre ti',
            'Para personalizar tu experiencia, dinos tu género.'),
        Row(
          children: [
            Expanded(
                child: _GenderButton(
                    title: 'Hombre',
                    emoji: '👨',
                    isSelected: _gender == 'MALE',
                    onTap: () => setState(() => _gender = 'MALE'))),
            const SizedBox(width: 16),
            Expanded(
                child: _GenderButton(
                    title: 'Mujer',
                    emoji: '👩',
                    isSelected: _gender == 'FEMALE',
                    onTap: () => setState(() => _gender = 'FEMALE'))),
          ],
        ),
        const Spacer(),
        SizedBox(
            width: double.infinity,
            child: CustomButton(
                text: 'Continuar',
                onPressed: _gender.isEmpty ? null : _nextStep)),
        const SizedBox(height: 24),
      ],
    );
  }

  Widget _buildAge() {
    return Column(
      children: [
        _buildStepHeader(Icons.calendar_today_outlined, 'Tu Edad',
            'Ayúdanos a personalizar tu experiencia.'),
        const SizedBox(height: 40),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            IconButton(
                onPressed: () => setState(() => _age > 10 ? _age-- : null),
                icon: const Icon(Icons.remove_circle_outline,
                    color: Colors.white, size: 40)),
            const SizedBox(width: 32),
            Text('$_age',
                style: const TextStyle(
                    fontSize: 60,
                    fontWeight: FontWeight.bold,
                    color: Colors.white)),
            const SizedBox(width: 32),
            IconButton(
                onPressed: () => setState(() => _age < 99 ? _age++ : null),
                icon: const Icon(Icons.add_circle_outline,
                    color: Colors.white, size: 40)),
          ],
        ),
        const Spacer(),
        SizedBox(
            width: double.infinity,
            child: CustomButton(text: 'Continuar', onPressed: _nextStep)),
        const SizedBox(height: 24),
      ],
    );
  }

  Widget _buildMascot() {
    return Column(
      children: [
        const SizedBox(height: 40),
        Center(
          child: const LlamiMascot(streak: 1)
              .animate(onPlay: (c) => c.repeat(reverse: true))
              .moveY(
                  begin: -10,
                  end: 10,
                  duration: 2.seconds,
                  curve: Curves.easeInOut)
              .scale(
                  begin: const Offset(0.95, 0.95),
                  end: const Offset(1.05, 1.05),
                  duration: 2.seconds,
                  curve: Curves.easeInOut),
        ),
        const SizedBox(height: 32),
        const Text('Dale nombre a tu compañera',
            textAlign: TextAlign.center,
            style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white)),
        const SizedBox(height: 8),
        const Text('Tu mascota te acompañará en cada paso.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.white60)),
        const SizedBox(height: 32),
        TextField(
          textAlign: TextAlign.center,
          style: const TextStyle(
              color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
          decoration: InputDecoration(
            hintText: 'Ej. Llami',
            hintStyle: TextStyle(color: Colors.white.withValues(alpha: 0.2)),
            border: InputBorder.none,
          ),
          onChanged: (v) => setState(() => _mascotName = v),
        ),
        if (_mascotName.trim().isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(top: 12),
            child: Text(
              'Tu mascota se llamará: $_mascotName',
              textAlign: TextAlign.center,
              style: const TextStyle(
                  color: Colors.white60,
                  fontSize: 12,
                  fontWeight: FontWeight.w600),
            ),
          ),
        const Spacer(),
        SizedBox(
            width: double.infinity,
            child: CustomButton(text: 'Continuar', onPressed: _nextStep)),
        const SizedBox(height: 24),
      ],
    );
  }

  Widget _buildLeaderPhone() {
    return Column(
      children: [
        _buildStepHeader(Icons.phone_outlined, 'Contacto de Emergencia',
            'Ingresa el WhatsApp de tu líder para tenerlo a mano en caso de SOS.'),
        TextField(
          textAlign: TextAlign.center,
          style: const TextStyle(color: Colors.white, fontSize: 18),
          decoration: InputDecoration(
            hintText: '+54 9 11 ...',
            hintStyle: TextStyle(color: Colors.white.withValues(alpha: 0.2)),
            filled: true,
            fillColor: Colors.white.withValues(alpha: 0.05),
            border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: BorderSide.none),
          ),
          onChanged: (v) => setState(() => _leaderPhone = v),
        ),
        if (_leaderPhone.trim().isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(top: 12),
            child: Text(
              'Contacto guardado: $_leaderPhone',
              textAlign: TextAlign.center,
              style: const TextStyle(
                  color: Colors.white60,
                  fontSize: 12,
                  fontWeight: FontWeight.w600),
            ),
          ),
        const Spacer(),
        SizedBox(
            width: double.infinity,
            child: CustomButton(text: 'Continuar', onPressed: _nextStep)),
        const SizedBox(height: 8),
        TextButton(
            onPressed: _nextStep,
            child: const Text('Prefiero omitir',
                style: TextStyle(color: Colors.white54))),
        const SizedBox(height: 16),
      ],
    );
  }

  Widget _buildCommunityIntro() {
    return Column(
      children: [
        _buildStepHeader(Icons.people_outline, 'Comunidad de Apoyo',
            'En Conecta+ no estás solo. Puedes agregar amigos para orar.'),
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.05),
              borderRadius: BorderRadius.circular(24)),
          child: Column(
            children: [
              const Icon(Icons.favorite, color: AppTheme.accent, size: 40),
              const SizedBox(height: 16),
              const Text('Apoyo Anónimo y Seguro',
                  style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      fontSize: 18)),
              const SizedBox(height: 8),
              const Text(
                'Tus amigos podrán enviarte mensajes de ánimo sin necesidad de ver tus detalles privados.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white60, height: 1.4),
              ),
            ],
          ),
        ),
        const Spacer(),
        SizedBox(
            width: double.infinity,
            child: CustomButton(
                text: '¡Me encanta! Continuar', onPressed: _nextStep)),
        const SizedBox(height: 24),
      ],
    );
  }

  Widget _buildSupportAd() {
    return Column(
      children: [
        _buildStepHeader(
            Icons.volunteer_activism_outlined,
            '¡Ayúdanos a Crecer!',
            'Conecta+ es un proyecto gratuito hecho con amor.'),
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
              color: Colors.white, borderRadius: BorderRadius.circular(24)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Meta: Licencia Play Store (\$25 USD)',
                  style: TextStyle(
                      fontWeight: FontWeight.bold, color: AppTheme.primary)),
              const SizedBox(height: 12),
              LinearProgressIndicator(
                  value: 0.48,
                  backgroundColor: Colors.grey.shade200,
                  color: AppTheme.accent,
                  minHeight: 12),
              const SizedBox(height: 12),
              const Text(
                  'Cada aporte nos acerca a la meta. Si este proyecto bendice tu vida, considera sembrar una semilla.',
                  style: TextStyle(color: AppTheme.textMuted, fontSize: 12)),
            ],
          ),
        ),
        const Spacer(),
        SizedBox(
            width: double.infinity,
            child: CustomButton(
                text: 'Quiero Apoyar',
                backgroundColor: AppTheme.accent,
                onPressed: () {})),
        const SizedBox(height: 8),
        TextButton(
            onPressed: _nextStep,
            child: const Text('Continuar por ahora',
                style: TextStyle(color: Colors.white54))),
        const SizedBox(height: 16),
      ],
    );
  }

  Widget _buildFinalStep() {
    return Column(
      children: [
        _buildStepHeader(Icons.auto_awesome, '¡Todo Listo!',
            'Has dado el primer paso hacia una vida de mayor conexión con Dios.'),
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.05),
              border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
              borderRadius: BorderRadius.circular(24)),
          child: const Column(
            children: [
              Text(
                '"Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes..."',
                textAlign: TextAlign.center,
                style: TextStyle(
                    color: Colors.white,
                    fontStyle: FontStyle.italic,
                    fontSize: 16,
                    height: 1.5),
              ),
              SizedBox(height: 8),
              Text('- Josué 1:9',
                  style: TextStyle(
                      color: AppTheme.accent, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
        const Spacer(),
        SizedBox(
            width: double.infinity,
            child: CustomButton(
                text: '¡Empezar mi Camino!',
                backgroundColor: AppTheme.accent,
                onPressed: _nextStep)),
        const SizedBox(height: 24),
      ],
    );
  }
}

class _SelectionButton extends StatelessWidget {
  final String title;
  final IconData? icon;
  final bool isSelected;
  final VoidCallback onTap;

  const _SelectionButton(
      {required this.title,
      this.icon,
      required this.isSelected,
      required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected
              ? AppTheme.accent.withValues(alpha: 0.1)
              : Colors.white.withValues(alpha: 0.05),
          border: Border.all(
              color: isSelected
                  ? AppTheme.accent
                  : Colors.white.withValues(alpha: 0.1),
              width: 2),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          children: [
            if (icon != null) ...[
              Icon(icon, color: AppTheme.accent),
              const SizedBox(width: 16)
            ],
            Expanded(
                child: Text(title,
                    style: const TextStyle(
                        color: Colors.white, fontWeight: FontWeight.bold))),
            if (isSelected)
              const Icon(Icons.check_circle, color: AppTheme.accent)
                  .animate()
                  .scale(duration: 200.ms, curve: Curves.backOut),
          ],
        ),
      ),
    ).animate(target: isSelected ? 1 : 0).scale(
        begin: const Offset(1, 1),
        end: const Offset(1.02, 1.02),
        duration: 200.ms);
  }
}

class _GenderButton extends StatelessWidget {
  final String title;
  final String emoji;
  final bool isSelected;
  final VoidCallback onTap;

  const _GenderButton(
      {required this.title,
      required this.emoji,
      required this.isSelected,
      required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 32),
        decoration: BoxDecoration(
          color: isSelected
              ? AppTheme.accent.withValues(alpha: 0.1)
              : Colors.white.withValues(alpha: 0.05),
          border: Border.all(
              color: isSelected
                  ? AppTheme.accent
                  : Colors.white.withValues(alpha: 0.1),
              width: 2),
          borderRadius: BorderRadius.circular(24),
        ),
        child: Column(
          children: [
            Text(emoji, style: const TextStyle(fontSize: 40)),
            const SizedBox(height: 12),
            Text(title,
                style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    ).animate(target: isSelected ? 1 : 0).scale(
        begin: const Offset(1, 1),
        end: const Offset(1.05, 1.05),
        duration: 200.ms);
  }
}
