import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../config/theme.dart';
import '../../../shared/widgets/custom_button.dart';
import '../../../shared/widgets/custom_input_field.dart';
import '../data/auth_provider.dart';
import '../../../l10n/app_localizations.dart';

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
    final l10n = AppLocalizations.of(context);

    if (identifier.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(l10n.enterCredentials)),
      );
      return;
    }

    try {
      final success =
          await ref.read(authProvider.notifier).login(identifier, password);

      if (success && mounted) {
        context.go('/dashboard');
      } else if (mounted) {
        final error = ref.read(authProvider).error;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(error ?? l10n.loginError),
            duration: const Duration(seconds: 5),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(l10n.criticalError(e.toString()))),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final l10n = AppLocalizations.of(context);

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
                              l10n.welcomeBack,
                              style: GoogleFonts.fredoka(
                                  fontSize: 28,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.primary),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              l10n.loginSubtitle,
                              style: GoogleFonts.fredoka(
                                  color: const Color(0xFF64748B),
                                  fontSize: 16,
                                  fontWeight: FontWeight.w500),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 48),
                      Text('  ${l10n.emailOrUsername}',
                          style: GoogleFonts.fredoka(
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                              color: AppTheme.primary)),
                      const SizedBox(height: 8),
                      CustomInputField(
                        label: l10n.emailOrUsername,
                        placeholder: l10n.emailOrUsernameHint,
                        controller: _identifierController,
                      ),
                      const SizedBox(height: 24),
                      Text('  ${l10n.passwordLabel}',
                          style: GoogleFonts.fredoka(
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                              color: AppTheme.primary)),
                      const SizedBox(height: 8),
                      CustomInputField(
                        label: l10n.passwordLabel,
                        placeholder: l10n.passwordHint,
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
                            l10n.forgotPassword,
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
                              ? l10n.loading
                              : l10n.loginButton,
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
                            Text(l10n.noAccount,
                                style: GoogleFonts.fredoka(
                                    color: const Color(0xFF64748B),
                                    fontSize: 15)),
                            GestureDetector(
                              onTap: () => context.push('/register'),
                              child: Text(
                                l10n.registerHere,
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
                  l10n.footerText,
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
