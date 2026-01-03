import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../config/theme.dart';
import '../../../shared/widgets/custom_button.dart';
import '../../../shared/widgets/custom_input_field.dart';
import '../data/auth_provider.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  bool _showPassword = false;
  final _identifierController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _identifierController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    final identifier = _identifierController.text.trim();
    final password = _passwordController.text;

    if (identifier.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor ingresa tus credenciales')),
      );
      return;
    }

    final success =
        await ref.read(authProvider.notifier).login(identifier, password);

    if (success && mounted) {
      context.go('/dashboard');
    } else if (mounted) {
      final error = ref.read(authProvider).error;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(error ?? 'Error al iniciar sesión')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                Container(
                  constraints: const BoxConstraints(maxWidth: 400),
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
                            Image.asset('assets/images/logo.png',
                                height: 60,
                                fit: BoxFit.contain,
                                errorBuilder: (c, e, s) => const Icon(
                                    Icons.flash_on,
                                    color: AppTheme.primary,
                                    size: 60)),
                            const SizedBox(height: 32),
                            Text(
                              'Bienvenido de nuevo',
                              style: GoogleFonts.fredoka(
                                  fontSize: 28,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.primary),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Ingresa para continuar tu camino.',
                              style: GoogleFonts.fredoka(
                                  color: const Color(0xFF64748B),
                                  fontSize: 16,
                                  fontWeight: FontWeight.w500),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 48),
                      Text('  Email o Usuario',
                          style: GoogleFonts.fredoka(
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                              color: AppTheme.primary)),
                      const SizedBox(height: 8),
                      CustomInputField(
                        label: 'Email o Usuario',
                        placeholder: 'usuario o nombre@ejemplo.com',
                        controller: _identifierController,
                      ),
                      const SizedBox(height: 24),
                      Text('  Contraseña',
                          style: GoogleFonts.fredoka(
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                              color: AppTheme.primary)),
                      const SizedBox(height: 8),
                      CustomInputField(
                        label: 'Contraseña',
                        placeholder: 'Ingrese su contraseña',
                        controller: _passwordController,
                        obscureText: !_showPassword,
                        suffixIcon: IconButton(
                          icon: Icon(
                              _showPassword
                                  ? Icons.visibility_off
                                  : Icons.visibility,
                              color: const Color(0xFF94A3B8)),
                          onPressed: () =>
                              setState(() => _showPassword = !_showPassword),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Align(
                        alignment: Alignment.centerRight,
                        child: TextButton(
                          onPressed: () {},
                          child: Text(
                            '¿Olvidaste tu contraseña?',
                            style: GoogleFonts.fredoka(
                                color: const Color(0xFF64748B),
                                fontSize: 14,
                                fontWeight: FontWeight.w500),
                          ),
                        ),
                      ),
                      const SizedBox(height: 32),
                      SizedBox(
                        width: double.infinity,
                        child: CustomButton(
                          text: authState.isLoading
                              ? 'Cargando...'
                              : 'Iniciar Sesión',
                          backgroundColor: AppTheme.accent,
                          textColor: AppTheme.primary,
                          onPressed: authState.isLoading ? null : _handleLogin,
                        ),
                      ),
                      const SizedBox(height: 32),
                      const Divider(color: Color(0xFFF1F5F9)),
                      const SizedBox(height: 16),
                      Center(
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text('¿No tienes cuenta? ',
                                style: GoogleFonts.fredoka(
                                    color: const Color(0xFF64748B),
                                    fontSize: 15)),
                            GestureDetector(
                              onTap: () => context.push('/register'),
                              child: Text(
                                'Regístrate aquí',
                                style: GoogleFonts.fredoka(
                                    color: AppTheme.primary,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 15),
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
                  '© 2025 Conecta+ BETA\nTu espacio seguro.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.fredoka(
                      color: const Color(0xFF94A3B8),
                      fontSize: 13,
                      fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
