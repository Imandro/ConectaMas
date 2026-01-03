import 'package:go_router/go_router.dart';
import '../features/dashboard/presentation/home_screen.dart';
import '../features/dashboard/presentation/llami_refuge_screen.dart';
import '../features/dashboard/presentation/luchas_screen.dart';
import '../features/dashboard/presentation/checkin_screen.dart';
import '../features/dashboard/presentation/struggle_detail_screen.dart';
import '../features/dashboard/presentation/tutorials_screen.dart';
import '../features/devotionals/presentation/devotionals_screen.dart';
import '../features/devotionals/presentation/devotional_detail_screen.dart';
import '../features/community/presentation/community_screen.dart';
import '../features/community/presentation/community_posts_screen.dart';
import '../features/community/presentation/community_post_detail_screen.dart';
import '../features/community/presentation/new_post_screen.dart';
import '../features/friends/presentation/friends_screen.dart';
import '../features/landing/presentation/landing_screen.dart';
import '../features/auth/presentation/login_screen.dart';
import '../features/auth/presentation/register_screen.dart';
import '../features/auth/presentation/onboarding_screen.dart';
import '../features/sos/presentation/sos_screen.dart';
import '../features/bible/presentation/bible_screen.dart';
import '../features/trivia/presentation/trivia_screen.dart';
import '../features/profile/presentation/profile_screen.dart';
import '../shared/navigation/scaffold_with_navbar.dart';

final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const LandingScreen(),
    ),
    GoRoute(
      path: '/sos',
      builder: (context, state) => const SOSScreen(),
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/register',
      builder: (context, state) => const RegisterScreen(),
    ),
    GoRoute(
      path: '/onboarding',
      builder: (context, state) => const OnboardingScreen(),
    ),
    // Authenticated Routes (with Bottom Nav)
    StatefulShellRoute.indexedStack(
      builder: (context, state, navigationShell) {
        return ScaffoldWithNavBar(navigationShell: navigationShell);
      },
      branches: [
        // Tab 1: Home
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/dashboard',
              builder: (context, state) => const HomeScreen(),
              routes: [
                GoRoute(
                  path: 'llami',
                  builder: (context, state) => const LlamiRefugeScreen(),
                ),
                GoRoute(
                  path: 'luchas',
                  builder: (context, state) => const LuchasScreen(),
                  routes: [
                    GoRoute(
                      path: ':id',
                      builder: (context, state) {
                        final id = state.pathParameters['id']!;
                        return StruggleDetailScreen(struggleId: id);
                      },
                    ),
                  ],
                ),
                GoRoute(
                  path: 'tutorials',
                  builder: (context, state) => const TutorialsScreen(),
                ),
                GoRoute(
                  path: 'checkin',
                  builder: (context, state) => const CheckinScreen(),
                ),
                GoRoute(
                  path: 'friends',
                  builder: (context, state) => const FriendsScreen(),
                ),
              ],
            ),
          ],
        ),
        // Tab 2: Devotionals
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/devotionals',
              builder: (context, state) => const DevotionalsScreen(),
              routes: [
                GoRoute(
                  path: ':id',
                  builder: (context, state) {
                    final id = state.pathParameters['id']!;
                    return DevotionalDetailScreen(devotionalId: id);
                  },
                ),
              ],
            ),
          ],
        ),
        // Tab 3: Bible
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/bible',
              builder: (context, state) => const BibleScreen(),
            ),
          ],
        ),
        // Tab 4: Trivia
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/trivia',
              builder: (context, state) => const TriviaScreen(),
            ),
          ],
        ),
        // Tab 5: Community
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/comunidad',
              builder: (context, state) => const CommunityScreen(),
              routes: [
                GoRoute(
                  path: 'new',
                  builder: (context, state) => const NewPostScreen(),
                ),
                GoRoute(
                  path: ':categoryId',
                  builder: (context, state) {
                    final categoryId = state.pathParameters['categoryId']!;
                    return CommunityPostsScreen(categoryId: categoryId);
                  },
                  routes: [
                    GoRoute(
                      path: 'post/:postId',
                      builder: (context, state) {
                        final postId = state.pathParameters['postId']!;
                        return CommunityPostDetailScreen(postId: postId);
                      },
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
        // Tab 6: Profile
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/profile',
              builder: (context, state) => const ProfileScreen(),
            ),
          ],
        ),
      ],
    ),
  ],
);
