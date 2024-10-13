import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
// import 'package:go_router/go_router.dart';
// import 'package:maslak/core/functions/navigation.dart';
// import 'package:maslak/core/utils/app_assets.dart';

class SplashView extends StatefulWidget {
  const SplashView({super.key});

  @override
  State<SplashView> createState() => _SplashViewState();
}

class _SplashViewState extends State<SplashView> {
  @override
  void initState() {
    Future.delayed(const Duration(seconds: 5),
    (){
      context.go("/login");

    }
    );
    super.initState();
  }

  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        // child: Image.asset(Assets.imagesMaslak) ,
        // child: Image.asset(
        //   'assets/images/maslak.png',
        //   width: 200,  // Resize width
        //   height: 200, // Resize height
        //   fit: BoxFit.cover,  // How the image should fit

        child: Image.asset(
          'assets/images/MaslakGif.GIF',  // Path to your GIF file
          width: 300,  // Adjust width as needed
          height: 300,  // Adjust height as needed
          fit: BoxFit.cover,  // How the image should fit the container 
          ),
      ),
    );
  }
}