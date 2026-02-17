import 'package:go_router/go_router.dart';
import '../features/dashboard/presentation/home_screen.dart';
import '../features/dashboard/presentation/llami_refuge_screen.dart';
import '../features/dashboard/presentation/luchas_screen.dart';
import '../features/dashboard/presentation/checkin_screen.dart';
import '../features/dashboard/presentation/struggle_detail_screen.dart';
import '../features/dashboard/presentation/tutorials_screen.dart';
import '../features/dashboard/presentation/youth_resources_screen.dart';
import '../features/devotionals/presentation/devotionals_screen.dart';
import '../features/devotionals/presentation/devotional_detail_screen.dart';
import '../features/community/presentation/community_screen.dart';
import '../features/community/presentation/question_list_screen.dart';
import '../features/community/presentation/ask_question_screen.dart';
import '../features/community/presentation/question_detail_screen.dart';
import '../features/friends/presentation/friends_screen.dart';
import '../features/landing/presentation/landing_screen.dart';
import '../features/auth/presentation/login_screen.dart';
import '../features/auth/presentation/register_screen.dart';
import '../features/auth/presentation/onboarding_screen.dart';
import '../features/sos/presentation/sos_screen.dart';
import '../features/bible/presentation/bible_screen.dart';
import '../features/profile/presentation/profile_screen.dart';
import '../features/challenges/presentation/challenge_screen.dart';
import '../features/groups/presentation/groups_landing_screen.dart';
import '../features/groups/presentation/create_group_screen.dart';
import '../features/groups/presentation/join_group_screen.dart';
import '../features/groups/presentation/group_detail_screen.dart';
import '../features/gamification/presentation/league_ranking_screen.dart';
import '../features/gamification/presentation/games_lobby_screen.dart';
import '../features/gamification/presentation/potato_game_screen.dart';
import '../features/gamification/presentation/trivia_screen.dart';
import '../features/gamification/presentation/verse_scramble_screen.dart';
import '../features/prayer/presentation/prayer_wall_screen.dart';
import '../features/spiritual_combat/presentation/spiritual_combat_screen.dart';
import '../features/spiritual_combat/presentation/sos_panic_screen.dart';
import '../features/spiritual_combat/presentation/bible_chat_screen.dart';
import '../features/spiritual_combat/presentation/honesty_checkin_screen.dart';
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
      path: '/challenge',
      builder: (context, state) => const ChallengeScreen(),
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
                  path: 'youth-zone',
                  builder: (context, state) => const YouthResourcesScreen(),
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
                GoRoute(
                  path: 'groups',
                  builder: (context, state) => const GroupsLandingScreen(),
                  routes: [
                    GoRoute(
                      path: 'create',
                      builder: (context, state) {
                        // Pass simple boolean extra? Or just use default constructor param handling
                        // Using query param for simplicity or state extra
                        final extra = state.extra as bool? ?? false;
                        return CreateGroupScreen(isLeader: extra);
                      },
                    ),
                    GoRoute(
                      path: 'join',
                      builder: (context, state) => const JoinGroupScreen(),
                    ),
                    GoRoute(
                      path: ':groupId',
                      builder: (context, state) {
                        final id = state.pathParameters['groupId']!;
                        return GroupDetailScreen(groupId: id);
                      },
                    ),
                  ],
                ),
                GoRoute(
                  path: 'leagues',
                  builder: (context, state) => const LeagueRankingScreen(),
                ),
                GoRoute(
                  path: 'games',
                  builder: (context, state) => const GamesLobbyScreen(),
                  routes: [
                    GoRoute(
                      path: 'potato/:roomId',
                      builder: (context, state) {
                        final id = state.pathParameters['roomId']!;
                        return PotatoGameScreen(roomId: id);
                      },
                    ),
                    GoRoute(
                      path: 'trivia',
                      builder: (context, state) => const TriviaScreen(),
                    ),
                    GoRoute(
                      path: 'scramble',
                      builder: (context, state) => const VerseScrambleScreen(),
                    ),
                  ],
                ),
                GoRoute(
                  path: 'prayer',
                  builder: (context, state) => const PrayerWallScreen(),
                ),
                GoRoute(
                  path: 'sos',
                  builder: (context, state) => const SpiritualCombatScreen(),
                ),
                GoRoute(
                  path: 'spiritual-combat/panic',
                  builder: (context, state) => const SosPanicScreen(),
                ),
                GoRoute(
                  path: 'spiritual-combat/chat',
                  builder: (context, state) => const BibleChatScreen(),
                ),
                GoRoute(
                  path: 'spiritual-combat/honesty',
                  builder: (context, state) => const HonestyCheckinScreen(),
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
        // Tab 5: Community (Q&A)
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/comunidad',
              builder: (context, state) => const CommunityScreen(),
              routes: [
                GoRoute(
                  path: 'new',
                  builder: (context, state) => const AskQuestionScreen(),
                ),
                GoRoute(
                  path: ':categoryId',
                  builder: (context, state) {
                    final categoryId = state.pathParameters['categoryId']!;
                    // If it's a UUID/ID format, it's likely a post detail.
                    // But usually categories are strings like 'peticiones-oracion'.
                    // For now, let's treat it as a list if it matches a category.
                    return QuestionListScreen(categoryId: categoryId);
                  },
                  routes: [
                    GoRoute(
                      path: 'post/:id',
                      builder: (context, state) {
                        final id = state.pathParameters['id']!;
                        return QuestionDetailScreen(questionId: id);
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
