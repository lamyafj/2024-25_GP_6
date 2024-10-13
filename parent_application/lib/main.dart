// import 'package:flutter/material.dart';
// import 'package:parent_application/core/routes/app_router.dart';
// import 'package:parent_application/core/utils/app_colors.dart';

// void main() {
//   runApp(const Maslak());
// }

// class Maslak extends StatelessWidget {
//   const Maslak({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp.router(
//       debugShowCheckedModeBanner: false,
//       routerConfig: router,
//       // locale: const Locale('ar'), // Set Arabic locale
//       // supportedLocales: const [Locale('ar')],
//       theme: ThemeData(
//         scaffoldBackgroundColor: Colors.white, // Background color for the entire app
//         appBarTheme: AppBarTheme(
//           backgroundColor: Colors.white, // Set your desired AppBar color here
//           foregroundColor: AppColors.sColor, // Set the color for AppBar text and icons
//         ),
//         // You can customize other theme properties as needed
//       ),
      
//     );
//   }
// }

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
      theme: ThemeData(
        scaffoldBackgroundColor: Colors.white, // Background color for the entire app
        appBarTheme: AppBarTheme(
          backgroundColor: Colors.white, // AppBar background color
          foregroundColor: AppColors.sColor, // color for AppBar text and icons
        ),
        // Global TextFormField theme
        inputDecorationTheme: InputDecorationTheme(
          border: const OutlineInputBorder(), 
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: AppColors.sColor, width: 2.0), // Focused border color
          ),
          labelStyle: const TextStyle(fontSize: 18),
          floatingLabelStyle: TextStyle(color: AppColors.sColor), // Focused label color
        ),
        // Global text selection and cursor color
        textSelectionTheme: TextSelectionThemeData(
          cursorColor: AppColors.sColor, 
          selectionColor: AppColors.sColor.withOpacity(0.3), 
          selectionHandleColor: AppColors.sColor,
        ),
      ),
    );
  }
}

