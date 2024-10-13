// import 'package:flutter/material.dart';

// class LiveLocationView extends StatelessWidget {
//   const LiveLocationView({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: const Text("موقع الباص المباشر", textDirection: TextDirection.rtl),
//         centerTitle: true, // This centers the title
//       ),
//       body: Center(
//         child: const Text("موقع الباص هنا.", textDirection: TextDirection.rtl), // Placeholder text
//       ),
//     );
//   }
// }
import 'package:flutter/material.dart';

class LiveLocationView extends StatelessWidget {
  const LiveLocationView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text(
          "موقع الباص المباشر",
          textDirection: TextDirection.rtl,
        ),
        centerTitle: true, // Center the title
        actions: [
          IconButton(
            icon: const Icon(Icons.keyboard_arrow_right),
            onPressed: () {
              Navigator.of(context).pop(); // Handle back navigation when pressing the arrow
            },
          ),
        ],
      ),
      body: const Center(
        child: Text(
          "موقع الباص هنا.",
          textDirection: TextDirection.rtl,
        ), // Placeholder text
      ),
    );
  }
}
