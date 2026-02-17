import 'package:flutter/material.dart';
import 'dart:math' as math;
import 'package:flutter_animate/flutter_animate.dart';

enum LlamiExpression { happy, sad, thinking, surprised, excited }

class LlamiMascot extends StatefulWidget {
  final int streak;
  final String? name;
  final int level;
  final LlamiExpression expression;
  final double size;

  const LlamiMascot({
    super.key,
    required this.streak,
    this.level = 1,
    this.name,
    this.expression = LlamiExpression.happy,
    this.size = 120,
  });

  @override
  State<LlamiMascot> createState() => _LlamiMascotState();
}

class _LlamiMascotState extends State<LlamiMascot>
    with TickerProviderStateMixin {
  late AnimationController _hoverController;
  late AnimationController _glowController;

  // Particles
  final List<_FireParticle> _particles = [];
  final math.Random _random = math.Random();

  @override
  void initState() {
    super.initState();
    _hoverController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat(reverse: true);

    _glowController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);

    _initParticles();
  }

  void _initParticles() {
    for (int i = 0; i < 8; i++) {
      _particles.add(_FireParticle(_random));
    }
    _hoverController.addListener(() {
      for (var p in _particles) {
        p.update();
      }
    });
  }

  @override
  void dispose() {
    _hoverController.dispose();
    _glowController.dispose();
    super.dispose();
  }

  Color _getPrimaryFireColor() {
    if (widget.streak <= 2) return const Color(0xFFFF9800); // Orange
    if (widget.streak <= 14) return const Color(0xFFFF5722); // Deep Orange
    return const Color(0xFFD32F2F); // Red
  }

  Color _getSecondaryFireColor() {
    if (widget.streak <= 2) return const Color(0xFFFFEB3B); // Yellow
    if (widget.streak <= 14) return const Color(0xFFFFC107); // Amber
    return const Color(0xFFFF9800); // Orange
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          width: widget.size,
          height: widget.size * 1.2,
          child: AnimatedBuilder(
            animation: Listenable.merge([_hoverController, _glowController]),
            builder: (context, child) {
              return CustomPaint(
                painter: LlamiFirePainter(
                  hoverValue: _hoverController.value,
                  glowValue: _glowController.value,
                  primaryColor: _getPrimaryFireColor(),
                  secondaryColor: _getSecondaryFireColor(),
                  expression: widget.expression,
                  particles: _particles,
                ),
              );
            },
          ),
        ),
        if (widget.name != null)
          Container(
            margin: const EdgeInsets.only(top: -10),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [_getPrimaryFireColor(), _getSecondaryFireColor()],
              ),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: _getPrimaryFireColor().withValues(alpha: 0.3),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                )
              ],
            ),
            child: Text(
              widget.name!.toUpperCase(),
              style: const TextStyle(
                fontWeight: FontWeight.w900,
                color: Colors.white,
                fontSize: 12,
                letterSpacing: 1.2,
              ),
            ),
          ).animate().scale(delay: 200.ms, curve: Curves.easeOutBack),
      ],
    );
  }
}

class _FireParticle {
  double x;
  double y;
  double size;
  double speed;
  double opacity;
  final math.Random rng;

  _FireParticle(this.rng)
      : x = rng.nextDouble(),
        y = rng.nextDouble(),
        size = rng.nextDouble() * 4 + 2,
        speed = rng.nextDouble() * 0.008 + 0.003,
        opacity = rng.nextDouble() * 0.6 + 0.2;

  void update() {
    y -= speed;
    if (y < 0) {
      y = 1.0;
      x = rng.nextDouble();
    }
  }
}

class LlamiFirePainter extends CustomPainter {
  final double hoverValue;
  final double glowValue;
  final Color primaryColor;
  final Color secondaryColor;
  final LlamiExpression expression;
  final List<_FireParticle> particles;

  LlamiFirePainter({
    required this.hoverValue,
    required this.glowValue,
    required this.primaryColor,
    required this.secondaryColor,
    required this.expression,
    required this.particles,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height * 0.55);
    final dropWidth = size.width * 0.65;
    final dropHeight = size.height * 0.75;

    // 1. Outer Glow
    final glowPaint = Paint()
      ..shader = RadialGradient(
        colors: [
          primaryColor.withValues(alpha: 0.3 + (glowValue * 0.2)),
          Colors.transparent
        ],
      ).createShader(Rect.fromCenter(
          center: center, width: size.width * 1.2, height: size.height * 1.2));
    canvas.drawCircle(center, size.width * 0.6, glowPaint);

    // 2. Rising Spark Particles
    final particlePaint = Paint()..style = PaintingStyle.fill;
    for (var p in particles) {
      particlePaint.color = secondaryColor.withValues(alpha: p.opacity * 0.6);
      canvas.drawCircle(
          Offset(p.x * size.width, (p.y * size.height) + (hoverValue * 5)),
          p.size * 0.8,
          particlePaint);
    }

    // 3. Main Teardrop Shape (Like Freedom in Christ)
    final dropPath = Path();
    final topPoint = center - Offset(0, dropHeight * 0.5);
    final bottomPoint = center + Offset(0, dropHeight * 0.5);

    // Start at top (pointed)
    dropPath.moveTo(center.dx, topPoint.dy);

    // Right curve (wider at middle, pointed at bottom)
    dropPath.cubicTo(
      center.dx + dropWidth * 0.6, // Control point 1 - right side
      center.dy - dropHeight * 0.15,
      center.dx + dropWidth * 0.5, // Control point 2 - right side
      center.dy + dropHeight * 0.15,
      center.dx, // End at bottom point
      bottomPoint.dy,
    );

    // Left curve (mirror of right)
    dropPath.cubicTo(
      center.dx - dropWidth * 0.5, // Control point 1 - left side
      center.dy + dropHeight * 0.15,
      center.dx - dropWidth * 0.6, // Control point 2 - left side
      center.dy - dropHeight * 0.15,
      center.dx, // End at top point
      topPoint.dy,
    );

    // Gradient paint for main drop
    final mainDropPaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          primaryColor,
          primaryColor.withValues(alpha: 0.9),
          secondaryColor,
        ],
        stops: const [0.0, 0.5, 1.0],
      ).createShader(Rect.fromCenter(
          center: center, width: dropWidth, height: dropHeight));

    canvas.drawPath(dropPath, mainDropPaint);

    // 4. Inner Highlight (Brightest part - upper middle)
    final highlightPath = Path();
    final highlightWidth = dropWidth * 0.4;
    final highlightHeight = dropHeight * 0.35;
    final highlightCenter = center - Offset(0, dropHeight * 0.1);

    highlightPath.moveTo(
        highlightCenter.dx, highlightCenter.dy - highlightHeight * 0.4);
    highlightPath.quadraticBezierTo(
      highlightCenter.dx - highlightWidth * 0.5,
      highlightCenter.dy,
      highlightCenter.dx,
      highlightCenter.dy + highlightHeight * 0.3,
    );
    highlightPath.quadraticBezierTo(
      highlightCenter.dx + highlightWidth * 0.5,
      highlightCenter.dy,
      highlightCenter.dx,
      highlightCenter.dy - highlightHeight * 0.4,
    );

    canvas.drawPath(
        highlightPath,
        Paint()
          ..shader = LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Colors.white.withValues(alpha: 0.85),
              secondaryColor.withValues(alpha: 0.7),
            ],
          ).createShader(Rect.fromCenter(
              center: highlightCenter,
              width: highlightWidth,
              height: highlightHeight)));

    // 5. Kawaii Face (Centered in wider part of drop)
    final faceCenter = center + Offset(0, dropHeight * 0.05);
    final eyeXOffset = dropWidth * 0.20;
    final eyeSize = dropWidth * 0.15;

    _drawEye(canvas, faceCenter - Offset(eyeXOffset, 0), eyeSize);
    _drawEye(canvas, faceCenter + Offset(eyeXOffset, 0), eyeSize);

    // Mouth (Happy smile)
    final mouthPaint = Paint()
      ..color = Colors.black.withValues(alpha: 0.85)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round;

    if (expression == LlamiExpression.happy ||
        expression == LlamiExpression.excited) {
      final mouthPath = Path();
      mouthPath.moveTo(faceCenter.dx - 8, faceCenter.dy + 18);
      mouthPath.quadraticBezierTo(faceCenter.dx, faceCenter.dy + 25,
          faceCenter.dx + 8, faceCenter.dy + 18);
      canvas.drawPath(mouthPath, mouthPaint);
    } else if (expression == LlamiExpression.surprised) {
      canvas.drawCircle(faceCenter + const Offset(0, 20), 5,
          Paint()..color = Colors.black.withValues(alpha: 0.85));
    } else if (expression == LlamiExpression.sad) {
      final sadMouthPath = Path();
      sadMouthPath.moveTo(faceCenter.dx - 8, faceCenter.dy + 25);
      sadMouthPath.quadraticBezierTo(faceCenter.dx, faceCenter.dy + 18,
          faceCenter.dx + 8, faceCenter.dy + 25);
      canvas.drawPath(sadMouthPath, mouthPaint);
    } else {
      canvas.drawLine(Offset(faceCenter.dx - 6, faceCenter.dy + 20),
          Offset(faceCenter.dx + 6, faceCenter.dy + 20), mouthPaint);
    }

    // 6. Shine/Reflection (Top left for commercial look)
    final shinePaint = Paint()..color = Colors.white.withValues(alpha: 0.35);
    canvas.drawOval(
        Rect.fromLTWH(center.dx - dropWidth * 0.25,
            center.dy - dropHeight * 0.35, dropWidth * 0.18, dropHeight * 0.25),
        shinePaint);
  }

  void _drawEye(Canvas canvas, Offset eyeCenter, double size) {
    // Large black eye
    canvas.drawCircle(
        eyeCenter, size / 2, Paint()..color = const Color(0xFF1A1A1A));
    // Large reflection
    canvas.drawCircle(eyeCenter - Offset(size * 0.15, size * 0.15), size * 0.18,
        Paint()..color = Colors.white);
    // Tiny reflection
    canvas.drawCircle(eyeCenter + Offset(size * 0.15, size * 0.15), size * 0.08,
        Paint()..color = Colors.white.withValues(alpha: 0.6));
  }

  @override
  bool shouldRepaint(covariant LlamiFirePainter oldDelegate) {
    return oldDelegate.hoverValue != hoverValue ||
        oldDelegate.glowValue != glowValue ||
        oldDelegate.particles != particles ||
        oldDelegate.expression != expression;
  }
}
