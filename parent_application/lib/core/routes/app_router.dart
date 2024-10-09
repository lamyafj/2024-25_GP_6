import 'package:go_router/go_router.dart';
// import 'package:maslak/features/home/presentation/views/home_view.dart';
import 'package:parent_application/features/home/presentation/widgets/home_nav_bar_widget.dart';
import 'package:parent_application/features/splash/presentation/views/splash_view.dart';

final GoRouter router = GoRouter(
  routes: [
    GoRoute(
      path: "/",
      builder: (context, state) => const SplashView(),
    ),
    GoRoute(
      path: "/homeNavBar",
      builder: (context, state) => const HomeNavBarWidget(),
    ),
    // GoRoute(
    //   path: "/home",
    //   builder: (context, state) => const HomeView(),
    // ),
  ],
);
