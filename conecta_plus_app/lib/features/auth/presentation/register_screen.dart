import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../config/theme.dart';
import '../../../shared/widgets/custom_button.dart';
import '../../../shared/widgets/custom_input_field.dart';
import '../../../l10n/app_localizations.dart';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/auth_provider.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  bool _showPassword = false;
  bool _termsAccepted = false;

  final _nameController = TextEditingController();
  final _usernameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _securityAnswerController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _usernameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _securityAnswerController.dispose();
    super.dispose();
  }

  Future<void> _handleRegister() async {
    final l10n = AppLocalizations.of(context);
    if (!_termsAccepted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(l10n.acceptTermsMsg)),
      );
      return;
    }

    final name = _nameController.text.trim();
    final username = _usernameController.text.trim();
    final email = _emailController.text.trim();
    final password = _passwordController.text;
    final securityAnswer = _securityAnswerController.text.trim();

    if (name.isEmpty ||
        username.isEmpty ||
        email.isEmpty ||
        password.isEmpty ||
        securityAnswer.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(l10n.completeFieldsMsg)),
      );
      return;
    }

    try {
      final success = await ref.read(authProvider.notifier).register(
            name: name,
            username: username,
            email: email,
            password: password,
            securityAnswer: securityAnswer,
          );

      if (success && mounted) {
        context.go('/onboarding');
      } else if (mounted) {
        final error = ref.read(authProvider).error;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(error ?? l10n.registerErrorMsg),
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
                            Image.asset('assets/images/logo.png',
                                height: 60,
                                fit: BoxFit.contain,
                                errorBuilder: (c, e, s) => const Icon(
                                    Icons.flash_on,
                                    color: AppTheme.primary,
                                    size: 60)),
                            const SizedBox(height: 32),
                            Text(
                              l10n.joinConecta,
                              style: GoogleFonts.fredoka(
                                  fontSize: 28,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.primary),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              l10n.registerSubtitle,
                              style: GoogleFonts.fredoka(
                                  color: const Color(0xFF64748B),
                                  fontSize: 16,
                                  fontWeight: FontWeight.w500),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 48),
                      Text('  ${l10n.fullNameLabel}',
                          style: GoogleFonts.fredoka(
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                              color: AppTheme.primary)),
                      const SizedBox(height: 8),
                      CustomInputField(
                        label: l10n.fullNameLabel,
                        placeholder: l10n.fullNameHint,
                        controller: _nameController,
                      ),
                      const SizedBox(height: 24),
                      Text('  ${l10n.usernameLabel}',
                          style: GoogleFonts.fredoka(
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                              color: AppTheme.primary)),
                      const SizedBox(height: 8),
                      CustomInputField(
                        label: l10n.usernameLabel,
                        placeholder: l10n.usernameHint,
                        controller: _usernameController,
                      ),
                      const SizedBox(height: 24),
                      Text('  ${l10n.emailLabel}',
                          style: GoogleFonts.fredoka(
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                              color: AppTheme.primary)),
                      const SizedBox(height: 8),
                      CustomInputField(
                        label: l10n.emailLabel,
                        placeholder: l10n.emailHint,
                        keyboardType: TextInputType.emailAddress,
                        controller: _emailController,
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
                        placeholder: l10n.passwordRegisterHint,
                        obscureText: !_showPassword,
                        controller: _passwordController,
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
                      const SizedBox(height: 24),
                      Text('  ${l10n.securityQuestionLabel}',
                          style: GoogleFonts.fredoka(
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                              color: AppTheme.primary)),
                      Text('  ${l10n.securityQuestion}',
                          style: GoogleFonts.fredoka(
                              color: const Color(0xFF64748B), fontSize: 13)),
                      const SizedBox(height: 8),
                      CustomInputField(
                        label: l10n.securityAnswerLabel,
                        placeholder: l10n.securityAnswerHint,
                        controller: _securityAnswerController,
                      ),
                      const SizedBox(height: 12),
                      Text(
                        l10n.securityNote,
                        style: GoogleFonts.fredoka(
                            color: const Color(0xFF94A3B8), fontSize: 12),
                      ),
                      const SizedBox(height: 32),
                      Row(
                        children: [
                          Checkbox(
                            value: _termsAccepted,
                            onChanged: (v) =>
                                setState(() => _termsAccepted = v ?? false),
                            activeColor: AppTheme.primary,
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(4)),
                          ),
                          Expanded(
                            child: Text(
                              l10n.acceptTermsText,
                              style: GoogleFonts.fredoka(
                                  fontSize: 13,
                                  color: const Color(0xFF64748B),
                                  fontWeight: FontWeight.w500),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 32),
                      SizedBox(
                        width: double.infinity,
                        child: CustomButton(
                          text: authState.isLoading
                              ? l10n.loading
                              : l10n.registerButton,
                          backgroundColor: AppTheme.accent,
                          textColor: AppTheme.primary,
                          onPressed:
                              authState.isLoading ? null : _handleRegister,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        l10n.respectSpaceMsg,
                        textAlign: TextAlign.center,
                        style: GoogleFonts.fredoka(
                            color: const Color(0xFF64748B), fontSize: 12),
                      ),
                      const SizedBox(height: 32),
                      const Divider(color: Color(0xFFF1F5F9)),
                      const SizedBox(height: 16),
                      Center(
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(l10n.alreadyHaveAccount,
                                style: GoogleFonts.fredoka(
                                    color: const Color(0xFF64748B),
                                    fontSize: 15)),
                            GestureDetector(
                              onTap: () => context.pop(),
                              child: Text(
                                l10n.loginLink,
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
                      color: const Color(0xFF94A3B8), fontSize: 13),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
