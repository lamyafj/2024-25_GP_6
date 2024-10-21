// import 'package:go_router/go_router.dart';
// // import 'package:maslak/features/home/presentation/views/home_view.dart';
// import 'package:parent_application/features/home/presentation/widgets/home_nav_bar_widget.dart';
// import 'package:parent_application/features/splash/presentation/views/splash_view.dart';

// final GoRouter router = GoRouter(
//   routes: [
//     GoRoute(
//       path: "/",
//       builder: (context, state) => const SplashView(),
//     ),
//     GoRoute(
//       path: "/homeNavBar",
//       builder: (context, state) => const HomeNavBarWidget(),
//     ),
//     // GoRoute(
//     //   path: "/home",
//     //   builder: (context, state) => const HomeView(),
//     // ),
//   ],
// );

// // import 'package:go_router/go_router.dart';
// // import 'package:parent_application/features/auth/presentaion/views/login_page.dart';
// // import 'package:parent_application/features/auth/presentaion/views/signup_page.dart';
// // // import 'package:maslak/features/home/presentation/views/home_view.dart';
// // import 'package:parent_application/features/home/presentation/widgets/home_nav_bar_widget.dart';
// // import 'package:parent_application/features/splash/presentation/views/splash_view.dart';

// // final GoRouter router = GoRouter(
// //   routes: [
// //     GoRoute(
// //       path: "/",
// //       builder: (context, state) => const SplashView(),
// //     ),
// //     GoRoute(
// //       path: "/sign_in",
// //       builder: (context, state) => LoginPage(), // Sign-in page
// //     ),
// //     GoRoute(
// //       path: "/sign_up",
// //       builder: (context, state) => SignUpPage(), // Sign-up page
// //     ),
// //     GoRoute(
// //       path: "/homeNavBar",
// //       builder: (context, state) => const HomeNavBarWidget(),
// //     ),
// //     // GoRoute(
// //     //   path: "/home",
// //     //   builder: (context, state) => const HomeView(),
// //     // ),
// //   ],
// // );

// import 'package:go_router/go_router.dart';
// import 'package:flutter/material.dart';
// import 'package:parent_application/features/auth/presentaion/views/signup_page.dart';
// import 'package:parent_application/features/splash/presentation/views/splash_view.dart';
// import 'package:parent_application/features/home/presentation/widgets/home_nav_bar_widget.dart';

// final GoRouter router = GoRouter(
//   initialLocation: "/",
//   routes: [
//     GoRoute(
//       path: "/",
//       builder: (context, state) => const SplashView(),
//       redirect: (context, state) async {
//         await Future.delayed(const Duration(seconds: 3)); // Wait for splash screen duration
//         return "/sign_up"; // Redirect to sign-up page after the splash
//       },
//     ),
//     GoRoute(
//       path: "/sign_up",
//       builder: (context, state) => SignUpPage(
//         onSignUpSuccess: () => GoRouter.of(context).go("/homeNavBar"),
//       ),
//     ),
//     GoRoute(
//       path: "/homeNavBar",
//       builder: (context, state) => const HomeNavBarWidget(),
//     ),
//   ],
// );

// import 'package:go_router/go_router.dart';
// import 'package:flutter/material.dart';
// import 'package:parent_application/features/auth/presentaion/views/signup_page.dart';
// import 'package:parent_application/features/splash/presentation/views/splash_view.dart';
// import 'package:parent_application/features/home/presentation/widgets/home_nav_bar_widget.dart';

// final GoRouter router = GoRouter(
//   initialLocation: "/",
//   routes: [
//     GoRoute(
//       path: "/",
//       builder: (context, state) => const SplashView(),
//     ),
//     GoRoute(
//       path: "/sign_up",
//       builder: (context, state) => SignUpPage(
//         onSignUpSuccess: () {
//           // Navigate to the home page after a successful sign-up
//           GoRouter.of(context).go("/homeNavBar");
//         },
//       ),
//     ),
//     GoRoute(
//       path: "/homeNavBar",
//       builder: (context, state) => const HomeNavBarWidget(),
//     ),
//   ],
// );
import 'package:go_router/go_router.dart';
import 'package:parent_application/features/auth/presentaion/views/login_page.dart';
import 'package:parent_application/features/auth/presentaion/views/signup_page.dart';
import 'package:parent_application/features/home/presentation/widgets/home_nav_bar_widget.dart';
import 'package:parent_application/features/splash/presentation/views/splash_view.dart';

final GoRouter router = GoRouter(
  initialLocation: "/",
  routes: [
    GoRoute(
      path: "/",
      builder: (context, state) => const SplashView(),
      redirect: (context, state) async {
        await Future.delayed(const Duration(seconds: 3));
        return "/login";
      },
    ),
    GoRoute(
      path: "/login",
      builder: (context, state) => LoginPage(),
    ),
    GoRoute(
      path: "/sign_up",
      builder: (context, state) => SignUpPage(),
    ),
    GoRoute(
      path: "/home",
      builder: (context, state) => const HomeNavBarWidget(),
    ),
  ],
);
