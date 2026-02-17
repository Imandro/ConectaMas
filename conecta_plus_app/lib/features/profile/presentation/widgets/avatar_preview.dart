import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/avatar_config.dart';

class AvatarPreview extends ConsumerWidget {
  final AvatarConfig config;
  final double size;

  const AvatarPreview({
    super.key,
    required this.config,
    this.size = 200,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return SizedBox(
      width: size,
      height: size,
      child: CustomPaint(
        painter: AvatarPainter(config),
      ),
    );
  }
}

class AvatarPainter extends CustomPainter {
  final AvatarConfig config;

  AvatarPainter(this.config);

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    _drawBackground(canvas, size, center, radius);
    _drawBody(canvas, size, center);
    _drawHead(canvas, size, center);
    _drawClothes(canvas, size, center);
    _drawFace(canvas, size, center);
    _drawHair(canvas, size, center);
    _drawAccessories(canvas, size, center);
  }

  void _drawBackground(Canvas canvas, Size size, Offset center, double radius) {
    final colors = [
      Colors.blue.shade100,
      Colors.green.shade100,
      Colors.purple.shade100,
      Colors.orange.shade100,
      Colors.red.shade100,
    ];
    final color = colors[config.backgroundColorIndex % colors.length];

    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    canvas.drawCircle(center, radius, paint);
  }

  void _drawBody(Canvas canvas, Size size, Offset center) {
    final skinColors = [
      const Color(0xFFFFDBAC), // Light
      const Color(0xFFF1C27D), // Medium Light
      const Color(0xFFE0AC69), // Medium
      const Color(0xFF8D5524), // Dark
      const Color(0xFF583E2A), // Very Dark
    ];
    final skinColor = skinColors[config.skinColorIndex % skinColors.length];
    final paint = Paint()..color = skinColor;

    // Neck
    final neckRect = Rect.fromCenter(
      center: Offset(center.dx, center.dy + size.height * 0.25),
      width: size.width * 0.2,
      height: size.height * 0.15,
    );
    canvas.drawRect(neckRect, paint);
  }

  void _drawHead(Canvas canvas, Size size, Offset center) {
    final skinColors = [
      const Color(0xFFFFDBAC),
      const Color(0xFFF1C27D),
      const Color(0xFFE0AC69),
      const Color(0xFF8D5524),
      const Color(0xFF583E2A),
    ];
    final skinColor = skinColors[config.skinColorIndex % skinColors.length];
    final paint = Paint()..color = skinColor;

    // Head shape
    final headRect = Rect.fromCenter(
      center: Offset(center.dx, center.dy - size.height * 0.1),
      width: size.width * 0.45,
      height: size.height * 0.5,
    );
    final rrect =
        RRect.fromRectAndRadius(headRect, Radius.circular(size.width * 0.2));
    canvas.drawRRect(rrect, paint);
  }

  void _drawClothes(Canvas canvas, Size size, Offset center) {
    final clothesColors = [
      Colors.red,
      Colors.blue,
      Colors.green,
      Colors.orange,
      Colors.purple,
    ];
    final color = clothesColors[config.outfitIndex % clothesColors.length];
    final paint = Paint()..color = color;

    // Simple Shirt
    final path = Path();
    path.moveTo(center.dx - size.width * 0.25,
        center.dy + size.height * 0.3); // Left shoulder
    path.quadraticBezierTo(
        center.dx,
        center.dy + size.height * 0.35,
        center.dx + size.width * 0.25,
        center.dy + size.height * 0.3); // Neckline
    path.lineTo(center.dx + size.width * 0.3, size.height); // Right side
    path.lineTo(center.dx - size.width * 0.3, size.height); // Left side
    path.close();

    canvas.drawPath(path, paint);
  }

  void _drawFace(Canvas canvas, Size size, Offset center) {
    // Eyes
    final eyeY = center.dy - size.height * 0.15;
    final eyeXOffset = size.width * 0.1;

    _drawEye(canvas, Offset(center.dx - eyeXOffset, eyeY), size.width * 0.04);
    _drawEye(canvas, Offset(center.dx + eyeXOffset, eyeY), size.width * 0.04);

    // Mouth
    final mouthY = center.dy + size.height * 0.05;
    final mouthPaint = Paint()
      ..color = Colors.black.withValues(alpha: 0.6)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3
      ..strokeCap = StrokeCap.round;

    final mouthPath = Path();
    // Smile
    if (config.mouthStyleIndex % 3 == 0) {
      mouthPath.moveTo(center.dx - size.width * 0.05, mouthY);
      mouthPath.quadraticBezierTo(center.dx, mouthY + size.height * 0.05,
          center.dx + size.width * 0.05, mouthY);
    }
    // Neutral
    else if (config.mouthStyleIndex % 3 == 1) {
      mouthPath.moveTo(center.dx - size.width * 0.05, mouthY);
      mouthPath.lineTo(center.dx + size.width * 0.05, mouthY);
    }
    // O-Shape
    else {
      canvas.drawCircle(
          Offset(center.dx, mouthY + size.height * 0.02),
          size.width * 0.03,
          Paint()..color = Colors.black.withValues(alpha: 0.6));
      return;
    }

    canvas.drawPath(mouthPath, mouthPaint);
  }

  void _drawEye(Canvas canvas, Offset center, double radius) {
    final paint = Paint()..color = Colors.black;
    canvas.drawCircle(center, radius, paint);
    // White reflection
    canvas.drawCircle(
        Offset(center.dx + radius * 0.3, center.dy - radius * 0.3),
        radius * 0.3,
        Paint()..color = Colors.white);
  }

  void _drawHair(Canvas canvas, Size size, Offset center) {
    final hairColors = [
      Colors.black,
      const Color(0xFF4E342E), // Bown
      const Color(0xFFE65100), // Red/Orange
      const Color(0xFFFFD54F), // Blonde
      Colors.grey,
    ];
    final color = hairColors[config.hairColorIndex % hairColors.length];
    final paint = Paint()..color = color;

    final headTop = center.dy - size.height * 0.35;
    final headLeft = center.dx - size.width * 0.225;
    final headRight = center.dx + size.width * 0.225;

    // Style 0: Short
    if (config.hairStyleIndex % 3 == 0) {
      final path = Path();
      path.moveTo(headLeft, center.dy - size.height * 0.1);
      path.quadraticBezierTo(center.dx, headTop - size.height * 0.1, headRight,
          center.dy - size.height * 0.1);
      path.close();
      canvas.drawPath(path, paint);
    }
    // Style 1: Spiky
    else if (config.hairStyleIndex % 3 == 1) {
      final path = Path();
      path.moveTo(headLeft, center.dy - size.height * 0.15);
      path.lineTo(center.dx - size.width * 0.1, headTop - size.height * 0.15);
      path.lineTo(center.dx, headTop);
      path.lineTo(center.dx + size.width * 0.1, headTop - size.height * 0.15);
      path.lineTo(headRight, center.dy - size.height * 0.15);
      path.close();
      canvas.drawPath(path, paint);
    }
    // Style 2: Long
    else {
      final path = Path();
      path.moveTo(headLeft, center.dy - size.height * 0.1);
      path.quadraticBezierTo(center.dx, headTop - size.height * 0.1, headRight,
          center.dy - size.height * 0.1);
      path.lineTo(headRight + size.width * 0.05,
          center.dy + size.height * 0.2); // Long side
      path.lineTo(headLeft - size.width * 0.05, center.dy + size.height * 0.2);
      path.close();
      canvas.drawPath(path, paint);
    }
  }

  void _drawAccessories(Canvas canvas, Size size, Offset center) {
    if (config.accessoryIndex == 1) {
      // Glasses
      final paint = Paint()
        ..color = Colors.black
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2;

      final eyeY = center.dy - size.height * 0.15;
      final eyeXOffset = size.width * 0.1;
      final radius = size.width * 0.06;

      canvas.drawCircle(Offset(center.dx - eyeXOffset, eyeY), radius, paint);
      canvas.drawCircle(Offset(center.dx + eyeXOffset, eyeY), radius, paint);
      canvas.drawLine(Offset(center.dx - eyeXOffset + radius, eyeY),
          Offset(center.dx + eyeXOffset - radius, eyeY), paint);
    }
  }

  @override
  bool shouldRepaint(covariant AvatarPainter oldDelegate) {
    return oldDelegate.config != config;
  }
}
