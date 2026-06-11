import 'dart:async';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:connectivity_plus/connectivity_plus.dart';

const String kAppUrl = 'https://conecta-mas.vercel.app';

enum AppState { splash, loading, ready, error, noInternet }

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  AppState _state = AppState.splash;
  late final WebViewController _controller;
  StreamSubscription? _connectivitySub;
  bool _hasInternet = true;

  @override
  void initState() {
    super.initState();
    _checkConnectivity();
    _initWebView();
    _startSplashTimer();
  }

  Future<void> _checkConnectivity() async {
    final result = await Connectivity().checkConnectivity();
    _hasInternet = !result.contains(ConnectivityResult.none);

    _connectivitySub = Connectivity().onConnectivityChanged.listen((result) {
      final online = !result.contains(ConnectivityResult.none);
      if (online != _hasInternet) {
        setState(() {
          _hasInternet = online;
          if (online && _state == AppState.noInternet) {
            _state = AppState.loading;
            _controller.loadRequest(Uri.parse(kAppUrl));
          }
        });
      }
    });
  }

  void _initWebView() {
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (_) {
            if (mounted && _state != AppState.splash) {
              setState(() => _state = AppState.loading);
            }
          },
          onPageFinished: (_) {
            if (mounted) {
              setState(() => _state = AppState.ready);
            }
          },
          onWebResourceError: (error) {
            if (mounted && error.errorCode == -2) {
              setState(() => _state = AppState.noInternet);
            }
          },
        ),
      );
  }

  void _startSplashTimer() {
    Timer(const Duration(seconds: 2), () {
      if (mounted) {
        if (!_hasInternet) {
          setState(() => _state = AppState.noInternet);
        } else {
          setState(() => _state = AppState.loading);
          _controller.loadRequest(Uri.parse(kAppUrl));
        }
      }
    });
  }

  @override
  void dispose() {
    _connectivitySub?.cancel();
    super.dispose();
  }

  void _retry() {
    setState(() => _state = AppState.loading);
    _controller.loadRequest(Uri.parse(kAppUrl));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 300),
        child: _buildBody(),
      ),
    );
  }

  Widget _buildBody() {
    switch (_state) {
      case AppState.splash:
        return _buildSplash();
      case AppState.loading:
        return Stack(
          children: [
            WebViewWidget(controller: _controller),
            const Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  CircularProgressIndicator(color: Color(0xFF0d6efd)),
                  SizedBox(height: 16),
                  Text('Cargando...', style: TextStyle(color: Colors.grey)),
                ],
              ),
            ),
          ],
        );
      case AppState.ready:
        return WebViewWidget(controller: _controller);
      case AppState.error:
        return _buildError();
      case AppState.noInternet:
        return _buildNoInternet();
    }
  }

  Widget _buildSplash() {
    return Container(
      color: Colors.white,
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Image.asset('assets/logo.png', width: 140, height: 60, errorBuilder: (_, __, ___) =>
              const Icon(Icons.wifi, size: 60, color: Color(0xFF0d6efd)),
            ),
            const SizedBox(height: 20),
            const Text('Conecta+', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFF0d6efd))),
            const SizedBox(height: 8),
            const Text('Acompañamiento Espiritual', style: TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }

  Widget _buildNoInternet() {
    return Container(
      color: Colors.white,
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.wifi_off, size: 64, color: Colors.orange),
            const SizedBox(height: 16),
            const Text('Sin conexión a internet', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text('Conectate a internet para usar la app', textAlign: TextAlign.center),
            const SizedBox(height: 24),
            FilledButton.icon(
              onPressed: _retry,
              icon: const Icon(Icons.refresh),
              label: const Text('Reintentar'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildError() {
    return Container(
      color: Colors.white,
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.error_outline, size: 64, color: Colors.red),
            const SizedBox(height: 16),
            const Text('Algo salió mal', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 24),
            FilledButton.icon(
              onPressed: _retry,
              icon: const Icon(Icons.refresh),
              label: const Text('Reintentar'),
            ),
          ],
        ),
      ),
    );
  }
}
