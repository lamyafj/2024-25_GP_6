import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:parent_application/features/auth/presentaion/views/login_page.dart';
import 'dart:async';

class IntroPage extends StatefulWidget {
  const IntroPage({super.key});

  @override
  _IntroPageState createState() => _IntroPageState();
}

class _IntroPageState extends State<IntroPage> {
  @override
  void initState() {
    super.initState();
    Timer(const Duration(seconds: 7), () {
      // Navigate to LoginPage using GoRouter
      context.go('/login'); // or context.pushReplacement('/login');
    });
  }

  @override
  Widget build(BuildContext context) {
    print("IntroPage is being built");
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          Align(
            alignment: Alignment.bottomCenter,
            child: Image.asset(
              'assets/images/movingbus.gif',
              width: MediaQuery.of(context).size.width,
              height: 750,
              fit: BoxFit.cover,
            ),
          ),
        ],
      ),
    );
  }
}
