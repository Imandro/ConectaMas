import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class AdService {
  /// Simulates showing a rewarded video ad.
  /// Returns [true] if the user watched the ad and should be rewarded.
  /// Returns [false] if the ad failed to load or user cancelled.
  Future<bool> showRewardedAd(BuildContext context) async {
    // In a real app, this would load and show an AdMob/Unity ad.
    // For now, we simulate a 3-second delay with a loading dialog.

    bool watched = false;

    await showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) {
          // Auto-close after 3 seconds
          Future.delayed(const Duration(seconds: 3), () {
            if (context.mounted) {
              watched = true;
              Navigator.of(context).pop();
            }
          });

          return const AlertDialog(
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                CircularProgressIndicator(),
                SizedBox(height: 16),
                Text('Viendo anuncio patrocinado...'),
                SizedBox(height: 8),
                Text('3 segundos restantes',
                    style: TextStyle(fontSize: 12, color: Colors.grey)),
              ],
            ),
          );
        },
      ),
    );

    return watched;
  }
}

final adServiceProvider = Provider<AdService>((ref) {
  return AdService();
});
