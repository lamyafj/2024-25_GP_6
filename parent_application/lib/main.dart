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
      androidProvider: AndroidProvider.playIntegrity, // Use Play Integrity for production
    );
    print('Firebase Initialized Successfully');
  } catch (e) {
    print('Error Initializing Firebase: $e');
  }
  runApp(Maslak());
}

class Maslak extends StatefulWidget {
  const Maslak({super.key});

  @override
  _MaslakState createState() => _MaslakState();
}

class _MaslakState extends State<Maslak> {
  bool isDarkMode = false; // Tracks whether dark mode is enabled

  void toggleTheme() {
    setState(() {
      isDarkMode = !isDarkMode; // Toggle theme mode
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      debugShowCheckedModeBanner: false,
      routerConfig: router, // Use routerConfig to manage routes
      theme: ThemeData(
        brightness: Brightness.light,
        scaffoldBackgroundColor: Colors.white, // Background color for the entire app
        appBarTheme: AppBarTheme(
          backgroundColor: Colors.white, // AppBar background color
          foregroundColor: AppColors.sColor, // Color for AppBar text and icons
        ),
        inputDecorationTheme: InputDecorationTheme(
          border: const OutlineInputBorder(),
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: AppColors.sColor, width: 2.0), // Focused border color
          ),
          labelStyle: const TextStyle(fontSize: 18),
          floatingLabelStyle: TextStyle(color: AppColors.sColor), // Focused label color
        ),
        textSelectionTheme: TextSelectionThemeData(
          cursorColor: AppColors.sColor,
          selectionColor: AppColors.sColor.withOpacity(0.3),
          selectionHandleColor: AppColors.sColor,
        ),
      ),
      // darkTheme: ThemeData(
      //   brightness: Brightness.dark,
      //   scaffoldBackgroundColor: Colors.black87, // Dark mode background color
      //   appBarTheme: AppBarTheme(
      //     backgroundColor: Colors.black54, // AppBar background color in dark mode
      //     foregroundColor: Colors.white, // Color for AppBar text and icons in dark mode
      //   ),
      //   inputDecorationTheme: InputDecorationTheme(
      //     border: const OutlineInputBorder(),
      //     focusedBorder: OutlineInputBorder(
      //       borderSide: BorderSide(color: Colors.cyanAccent, width: 2.0), // Focused border color for dark mode
      //     ),
      //     labelStyle: const TextStyle(fontSize: 18),
      //     floatingLabelStyle: const TextStyle(color: Colors.cyanAccent), // Focused label color for dark mode
      //   ),
      //   textSelectionTheme: const TextSelectionThemeData(
      //     cursorColor: Colors.cyanAccent,
      //     selectionColor: Color(0xFF1E88E5),
      //     selectionHandleColor: Colors.cyanAccent,
      //   ),
      // ),
      // themeMode: isDarkMode ? ThemeMode.dark : ThemeMode.light, // Change theme based on isDarkMode
      // builder: (context, child) {
      //   return Scaffold(
      //     body: SafeArea(
      //       child: Stack(
      //         children: [
      //           if (child != null) child!,
      //           Positioned(
      //             top: 10,
      //             right: 10,
      //             child: IconButton(
      //               icon: Icon(
      //                 isDarkMode ? Icons.light_mode : Icons.dark_mode,
      //                 color: isDarkMode ? Colors.yellow : Colors.black,
      //               ),
      //               onPressed: toggleTheme,
      //             ),
      //           ),
      //         ],
      //       ),
      //     ),
      //   );
      // },
    );
  }
}





// class Maslak extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp(
//       title: 'Flutter Firebase Demo',
//       home: Scaffold(
//         appBar: AppBar(
//           title: Text('Firebase Connection'),
//         ),
//         body: Center(
//           child: Text('Firebase Initialized'),
//         ),
//       ),
//     );
//   }
// }
