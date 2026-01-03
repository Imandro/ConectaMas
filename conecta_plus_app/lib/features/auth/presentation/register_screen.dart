import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../config/theme.dart';
import '../../../shared/widgets/custom_button.dart';
import '../../../shared/widgets/custom_input_field.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  bool _showPassword = false;
  bool _termsAccepted = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
            child: Column(
              children: [
                Container(
                  constraints: const BoxConstraints(maxWidth: 450),
                  padding: const EdgeInsets.all(40),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(32),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.04),
                        blurRadius: 30,
                        offset: const Offset(0, 15),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Center(
                        child: Column(
                          children: [
                            Image.asset('assets/images/logo.png', height: 60, fit: BoxFit.contain, errorBuilder: (c, e, s) => const Icon(Icons.flash_on, color: AppTheme.primary, size: 60)),
                            const SizedBox(height: 32),
                            Text(
                              'Únete a Conecta+',
                              style: GoogleFonts.fredoka(fontSize: 28, fontWeight: FontWeight.bold, color: AppTheme.primary),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Tu viaje hacia la libertad comienza hoy.',
                              style: GoogleFonts.fredoka(color: const Color(0xFF64748B), fontSize: 16, fontWeight: FontWeight.w500),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 48),

                      Text('  Nombre Completo', style: GoogleFonts.fredoka(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.primary)),
                      const SizedBox(height: 8),
                      const CustomInputField(
                        label: 'Nombre Completo',
                        placeholder: 'Tu nombre real',
                      ),
                      const SizedBox(height: 24),

                      Text('  Nombre de Usuario', style: GoogleFonts.fredoka(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.primary)),
                      const SizedBox(height: 8),
                      const CustomInputField(
                        label: 'Nombre de Usuario',
                        placeholder: '@usuario',
                      ),
                      const SizedBox(height: 24),

                      Text('  Email', style: GoogleFonts.fredoka(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.primary)),
                      const SizedBox(height: 8),
                      const CustomInputField(
                        label: 'Email',
                        placeholder: 'nombre@ejemplo.com',
                        keyboardType: TextInputType.emailAddress,
                      ),
                      const SizedBox(height: 24),

                      Text('  Contraseña', style: GoogleFonts.fredoka(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.primary)),
                      const SizedBox(height: 8),
                      CustomInputField(
                        label: 'Contraseña',
                        placeholder: 'Mínimo 6 caracteres',
                        obscureText: !_showPassword,
                        suffixIcon: IconButton(
                          icon: Icon(_showPassword ? Icons.visibility_off : Icons.visibility, color: const Color(0xFF94A3B8)),
                          onPressed: () => setState(() => _showPassword = !_showPassword),
                        ),
                      ),
                      const SizedBox(height: 24),

                      Text('  Pregunta de Seguridad', style: GoogleFonts.fredoka(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.primary)),
                      Text('  ¿Cómo se llamaba tu primera mascota?', style: GoogleFonts.fredoka(color: const Color(0xFF64748B), fontSize: 13)),
                      const SizedBox(height: 8),
                      const CustomInputField(
                        label: 'Respuesta de Seguridad',
                        placeholder: 'Escribe la respuesta aquí',
                      ),
                      const SizedBox(height: 12),
                      Text(
                        '*Usarás esta respuesta para recuperar tu contraseña.',
                        style: GoogleFonts.fredoka(color: const Color(0xFF94A3B8), fontSize: 12),
                      ),
                      const SizedBox(height: 32),

                      Row(
                        children: [
                          Checkbox(
                            value: _termsAccepted,
                            onChanged: (v) => setState(() => _termsAccepted = v ?? false),
                            activeColor: AppTheme.primary,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
                          ),
                          Expanded(
                            child: Text(
                              'He leído y acepto los Términos y Condiciones.',
                              style: GoogleFonts.fredoka(fontSize: 13, color: const Color(0xFF64748B), fontWeight: FontWeight.w500),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 32),

                      SizedBox(
                        width: double.infinity,
                        child: CustomButton(
                          text: 'Crear mi cuenta',
                          backgroundColor: AppTheme.accent,
                          textColor: AppTheme.primary,
                          onPressed: () => context.go('/onboarding'),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Al registrarte, aceptas que este es un espacio de respeto.',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.fredoka(color: const Color(0xFF64748B), fontSize: 12),
                      ),
                      const SizedBox(height: 32),

                      const Divider(color: Color(0xFFF1F5F9)),
                      const SizedBox(height: 16),
                      Center(
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text('¿Ya tienes cuenta? ', style: GoogleFonts.fredoka(color: const Color(0xFF64748B), fontSize: 15)),
                            GestureDetector(
                              onTap: () => context.pop(),
                              child: Text(
                                'Inicia sesión',
                                style: GoogleFonts.fredoka(color: AppTheme.primary, fontWeight: FontWeight.bold, fontSize: 15),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 40),
                Text(
                  '© 2025 Conecta+\nTu espacio seguro.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.fredoka(color: const Color(0xFF94A3B8), fontSize: 13),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
