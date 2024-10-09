import 'package:flutter/material.dart';
import 'package:parent_application/core/routes/app_router.dart';
import 'package:parent_application/core/utils/app_colors.dart';

void main() {
  runApp(const Maslak());
}

class Maslak extends StatelessWidget {
  const Maslak({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      debugShowCheckedModeBanner: false,
      routerConfig: router,
      // locale: const Locale('ar'), // Set Arabic locale
      // supportedLocales: const [Locale('ar')],
      theme: ThemeData(
        scaffoldBackgroundColor: AppColors.primaryColor, // Background color for the entire app
        appBarTheme: AppBarTheme(
          backgroundColor: AppColors.primaryColor, // Set your desired AppBar color here
          foregroundColor: AppColors.sColor, // Set the color for AppBar text and icons
        ),
        // You can customize other theme properties as needed
      ),
      
    );
  }
}

