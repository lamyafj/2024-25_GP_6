// // import 'package:flutter/material.dart';
// // import 'package:parent_application/core/routes/app_router.dart';
// // import 'package:parent_application/core/utils/app_colors.dart';

// // void main() {
// //   runApp(const Maslak());
// // }

// // class Maslak extends StatelessWidget {
// //   const Maslak({super.key});

// //   @override
// //   Widget build(BuildContext context) {
// //     return MaterialApp.router(
// //       debugShowCheckedModeBanner: false,
// //       routerConfig: router,
// //       // locale: const Locale('ar'), // Set Arabic locale
// //       // supportedLocales: const [Locale('ar')],
// //       theme: ThemeData(
// //         scaffoldBackgroundColor: Colors.white, // Background color for the entire app
// //         appBarTheme: AppBarTheme(
// //           backgroundColor: Colors.white, // Set your desired AppBar color here
// //           foregroundColor: AppColors.sColor, // Set the color for AppBar text and icons
// //         ),
// //         // You can customize other theme properties as needed
// //       ),

// //     );
// //   }
// // }

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
//       theme: ThemeData(
//         scaffoldBackgroundColor: Colors.white, // Background color for the entire app
//         appBarTheme: AppBarTheme(
//           backgroundColor: Colors.white, // AppBar background color
//           foregroundColor: AppColors.sColor, // color for AppBar text and icons
//         ),
//         // Global TextFormField theme
//         inputDecorationTheme: InputDecorationTheme(
//           border: const OutlineInputBorder(),
//           focusedBorder: OutlineInputBorder(
//             borderSide: BorderSide(color: AppColors.sColor, width: 2.0), // Focused border color
//           ),
//           labelStyle: const TextStyle(fontSize: 18),
//           floatingLabelStyle: TextStyle(color: AppColors.sColor), // Focused label color
//         ),
//         // Global text selection and cursor color
//         textSelectionTheme: TextSelectionThemeData(
//           cursorColor: AppColors.sColor,
//           selectionColor: AppColors.sColor.withOpacity(0.3),
//           selectionHandleColor: AppColors.sColor,
//         ),
//       ),
//     );
//   }
// }

import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:parent_application/core/routes/app_router.dart';
import 'package:parent_application/core/utils/app_colors.dart';
import 'package:firebase_app_check/firebase_app_check.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await Firebase.initializeApp();
    await FirebaseAppCheck.instance.activate(
      androidProvider: AndroidProvider.debug,
    );
    print('Firebase Initialized Successfully');
  } catch (e) {
    print('Error Initializing Firebase: $e');
  }
  runApp(const Maslak());
}

class Maslak extends StatefulWidget {
  const Maslak({super.key});

  @override
  _MaslakState createState() => _MaslakState();
}

class _MaslakState extends State<Maslak> {
  bool isDarkMode = false;

  void toggleTheme() {
    setState(() {
      isDarkMode = !isDarkMode;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      debugShowCheckedModeBanner: false,
      routerConfig: router,
      theme: ThemeData(
        brightness: Brightness.light,
        scaffoldBackgroundColor: Colors.white,
        appBarTheme: AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: AppColors.sColor,
        ),
        inputDecorationTheme: InputDecorationTheme(
          hintStyle: TextStyle(
            color: Color(0xff053A21), // لون الكتابة في النص المساعد
          ),
          labelStyle: TextStyle(
            color: Color(0xff053A21), // لون الكتابة فوق حقل الإدخال
          ),
          border: OutlineInputBorder(
            borderSide: BorderSide(color: Colors.grey), // لون الحدود العادية
          ),
          focusedBorder: OutlineInputBorder(
            borderSide:
                BorderSide(color: Color(0xff053A21)), // لون الحدود عند التركيز
          ),
          enabledBorder: OutlineInputBorder(
            borderSide:
                BorderSide(color: Color(0xff053A21)), // لون الحدود عند التفعيل
          ),
        ),
        // Uncomment the following section if you want to include dark mode
        // darkTheme: ThemeData(
        //   brightness: Brightness.dark,
        //   // Other dark theme properties
        // ),
        // themeMode: isDarkMode ? ThemeMode.dark : ThemeMode.light,
      ),
    );
  }
}
