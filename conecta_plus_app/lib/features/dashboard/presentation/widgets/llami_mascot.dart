import 'package:flutter/material.dart';
import 'dart:math' as math;

enum LlamiExpression { happy, sad, thinking, surprised }

class LlamiMascot extends StatefulWidget {
  final int streak;
  final String? name;
  final LlamiExpression expression;
  const LlamiMascot({
    super.key, 
    required this.streak, 
    this.name,
    this.expression = LlamiExpression.happy,
  });

  @override
  State<LlamiMascot> createState() => _LlamiMascotState();
}

class _LlamiMascotState extends State<LlamiMascot> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return SizedBox(
          width: 50,
          height: 60,
          child: CustomPaint(
            painter: LlamiPainter(
              animationValue: _controller.value,
              streak: widget.streak,
              expression: widget.expression,
            ),
          ),
        );
      },
    );
  }
}

class LlamiPainter extends CustomPainter {
  final double animationValue;
  final int streak;
  final LlamiExpression expression;

  LlamiPainter({
    required this.animationValue, 
    required this.streak,
    required this.expression,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final paint = Paint()..style = PaintingStyle.fill;

    // Get colors based on streak (stage logic from web app)
    Color primaryColor;

    if (streak <= 2) {
      primaryColor = const Color(0xFFEAB308); // spark
    } else if (streak <= 14) {
      primaryColor = const Color(0xFFF59E0B); // flame
    } else if (streak <= 60) {
      primaryColor = const Color(0xFFF97316); // torch
    } else {
      primaryColor = const Color(0xFFEF4444); // sun/star
    }

    // Body Path (simplified flame shape)
    final path = Path();
    final topY = 2.0 + (animationValue * 5.0);
    path.moveTo(size.width / 2, topY);
    path.quadraticBezierTo(size.width * 0.8, size.height * 0.3, size.width * 0.9, size.height * 0.6);
    path.quadraticBezierTo(size.width * 0.9, size.height * 0.9, size.width / 2, size.height * 0.95);
    path.quadraticBezierTo(size.width * 0.1, size.height * 0.9, size.width * 0.1, size.height * 0.6);
    path.quadraticBezierTo(size.width * 0.2, size.height * 0.3, size.width / 2, topY);

    // Glow
    final glowPaint = Paint()
      ..color = primaryColor.withValues(alpha: 0.3)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 10);
    canvas.drawCircle(center, 20 + (animationValue * 5), glowPaint);

    paint.color = primaryColor;
    canvas.drawPath(path, paint);

    // Face
    final eyePaint = Paint()..color = const Color(0xFF1A1A1A);
    final eyeY = size.height * 0.45;
    final blink = (math.sin(animationValue * math.pi * 2) > 0.95) ? 0.1 : 1.0;
    
    // Draw Eyes based on Expression
    if (expression == LlamiExpression.sad) {
      canvas.drawArc(
        Rect.fromCenter(center: Offset(size.width * 0.4, eyeY), width: 6, height: 6),
        math.pi, math.pi, false, eyePaint..style = PaintingStyle.stroke..strokeWidth = 1.5,
      );
      canvas.drawArc(
        Rect.fromCenter(center: Offset(size.width * 0.6, eyeY), width: 6, height: 6),
        math.pi, math.pi, false, eyePaint,
      );
    } else if (expression == LlamiExpression.surprised) {
      canvas.drawCircle(Offset(size.width * 0.4, eyeY), 3, eyePaint..style = PaintingStyle.fill);
      canvas.drawCircle(Offset(size.width * 0.6, eyeY), 3, eyePaint);
    } else {
      canvas.drawOval(
        Rect.fromCenter(center: Offset(size.width * 0.4, eyeY), width: 4, height: 6 * blink),
        eyePaint..style = PaintingStyle.fill,
      );
      canvas.drawOval(
        Rect.fromCenter(center: Offset(size.width * 0.6, eyeY), width: 4, height: 6 * blink),
        eyePaint..style = PaintingStyle.fill,
      );
    }

    // Draw Mouth based on Expression
    final mouthPaint = Paint()
      ..color = const Color(0xFF1A1A1A)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5
      ..strokeCap = StrokeCap.round;
    
    final mouthPath = Path();
    if (expression == LlamiExpression.sad) {
      mouthPath.moveTo(size.width * 0.42, size.height * 0.62);
      mouthPath.quadraticBezierTo(size.width * 0.5, size.height * 0.57, size.width * 0.58, size.height * 0.62);
    } else if (expression == LlamiExpression.surprised) {
      canvas.drawCircle(Offset(size.width * 0.5, size.height * 0.62), 2.5, mouthPaint..style = PaintingStyle.fill);
    } else if (expression == LlamiExpression.thinking) {
      mouthPath.moveTo(size.width * 0.42, size.height * 0.6);
      mouthPath.lineTo(size.width * 0.58, size.height * 0.6);
    } else {
      mouthPath.moveTo(size.width * 0.42, size.height * 0.55);
      mouthPath.quadraticBezierTo(size.width * 0.5, size.height * 0.6, size.width * 0.58, size.height * 0.55);
    }
    canvas.drawPath(mouthPath, mouthPaint);
  }

  @override
  bool shouldRepaint(covariant LlamiPainter oldDelegate) => true;
}
